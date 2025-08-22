# Blogify API 🚀

A production-ready, secure, and scalable REST API for a blogging platform, built with **Node.js, Express, and MongoDB**.

This API provides a complete backend solution, featuring JWT-based authentication, role-based access control, image uploads to Cloudinary, and full CRUD functionality for blog posts.

---

## ✨ Features

- 🔐 **Authentication & Authorization**: Secure user registration and login using JSON Web Tokens (JWT).
- 👥 **Role-Based Access Control**: Differentiates between `Admin` and `User` roles, restricting access to sensitive operations.
- 📝 **Full CRUD Operations**: Create, Read, Update, and Delete functionality for blog posts.
- 📸 **Image Upload**: Seamless image uploads handled by Multer and stored in the cloud with Cloudinary.
- 🛡️ **Secure & Scalable**: Implements password hashing with `bcrypt` and utilizes environment variables for safe configuration management.
- 📚 **RESTful Architecture**: Follows REST principles for a predictable and well-structured API.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Token (`jsonwebtoken`), `bcrypt`
- **File Handling**: Multer, Cloudinary
- **Environment**: `dotenv`
- **Middleware**: `cors`

---
