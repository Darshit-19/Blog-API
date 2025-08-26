const Blog = require("../models/blog");
const uploadOnCloudinary = require("../utility/cloudinary");

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    //  Validate required fields
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    let imageUrl = "";
    // Upload image to Cloudinary if file is present

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      if (result) imageUrl = result.secure_url; // Cloudinary URL
    }
    //  Create new blog
    const newBlog = await Blog.create({
      title,
      content,
      image: imageUrl,
      author: req.user.id,
    });

    //  Send success response
    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error in creating blog:", error);

    //  Send server error response
    res.status(500).json({ message: "Server error: Blog not created" });
  }
};

const getBlogs = async (req, res) => {
  try {
    //Exract page and limit  from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    //Calculate skip
    const skip = (page - 1) * limit;

    // Fecth blogs from db
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // check whether blogs exist or not
    if (blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }

    //Count total number of blogs
    const totalBlogs = await Blog.countDocuments();

    // send back blogs
    res
      .status(200)
      .json({
        message: "Blogs retrieved successfully",
        page,
        limit,
        totalBlogs,
        totalPages: Math.ceil(totalBlogs / limit),
        blogs,
      });
  } catch (error) {
    console.error("Error in retrieving blogs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBlogById = async (req, res) => {
  try {
    //Extracr id from request object
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author", "name email");

    //Check if we found blog or not
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    //Return the blog and succes message
    res.status(200).json({ message: "Blog Found", blog });
  } catch (error) {
    console.error("Error in getBlogById:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateBlog = async (req, res) => {
  try {
    //  Find the blog and check if it exists
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the user is the author of the blog
    if (!blog.author.equals(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update " });
    }

    // Update only the fields that are provided in the request body
    const { title, content } = req.body;
    if (title) blog.title = title;
    if (content) blog.content = content;

    // If a new image file is provided, upload it to Cloudinary
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      if (result) blog.image = result.secure_url;
    }

    //save and return the updated blog
    const updatedBlog = await blog.save();
    res
      .status(200)
      .json({ message: "Blog Updated Succesfully", blog: updatedBlog });
  } catch (error) {
    console.error("Error in updating the blog", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    // Find the blog and check if it exists
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the user is the author of the blog
    if (!blog.author.equals(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can  not delete this Blog" });
    }

    // Delete the blog and return success message
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error in deleting the blog", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog };
