const express = require("express");
const router = express.Router();
const { createBlog, getBlogs , getBlogById , updateBlog , deleteBlog} = require("../controllers/blogController");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/blogs", authMiddleware, upload.single('image') , createBlog); // create a blog
router.get("/blogs", authMiddleware , getBlogs); // get all blogs
router.get("/blogs/:id", authMiddleware , getBlogById)  // get blog by id
router.put("/blogs/:id", authMiddleware , upload.single('image') , updateBlog)  //update the blog
router.delete("/blogs/:id", authMiddleware , deleteBlog) // delete the blog

module.exports = router;
