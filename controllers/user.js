const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    //  Generate token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    //  Respond with user data (not password)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role, // useful if you add roles later
        createdAt: newUser.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error(error);

    // Handle Mongo duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Find user and include password
    const findUser = await User.findOne({ email }).select("+password");
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Compare password
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //  Generate token
    const token = jwt.sign(
      { id: findUser._id, role: findUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    //  Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
      },
      token
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser };
