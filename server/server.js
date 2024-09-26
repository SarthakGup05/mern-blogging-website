import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
// AWS SDK for S3
// For file upload
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js";
import { generateUniqueUsername, createAccessToken, generateUniqueId } from "./utils.js";
import cors from "cors";

import { signInValidator, signUpValidator, blogValidator } from "./validations/validator.js";
import { validationResult } from "express-validator";
import admin from "firebase-admin";
import Securityservicekey from "./travel-blog-react1-firebase-adminsdk-c6ljr-9f653f126a.json" assert { type: "json" };

import { generateUploadURL } from "./Aws.js";
import { verifyToken } from "./middlewere.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

// AWS S3 Configuration

// Multer setup for handling file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

admin.initializeApp({
  credential: admin.credential.cert(Securityservicekey),
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Update with your frontend origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// MongoDB connection
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Routes

//upload url image

app.get("/get-upload-url", async (req, res) => {
  try {
    const uploadUrl = await generateUploadURL(); // Use the function from aws.js
    res
      .status(200)
      .json({ message: "Pre-signed URL generated successfully", uploadUrl });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error.message);
    res
      .status(500)
      .json({
        message: "Error generating pre-signed URL",
        error: error.message,
      });
  }
});
// User signup route
app.post("/signup", signUpValidator, async (req, res) => {
  const { fullName, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const usernameBase = email.split("@")[0];
    const username = await generateUniqueUsername(usernameBase);

    const user = new User({
      personal_info: { fullName, username, email, password: hashedPassword },
    });

    await user.save();
    const token = createAccessToken(user);

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// User signin route
app.post("/signin", signInValidator, async (req, res) => {
  const { username, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ "personal_info.username": username });

    if (
      !user ||
      !(await bcrypt.compare(password, user.personal_info.password))
    ) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const token = createAccessToken(user);
    res.status(200).json({ message: "Sign in successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Google Auth Route
app.post("/google-auth", async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name } = decodedToken;

    let user = await User.findOne({ "personal_info.email": email });

    if (!user) {
      const usernameBase = email.split("@")[0];
      const username = await generateUniqueUsername(usernameBase);

      user = new User({
        personal_info: { fullName: name, username, email, google_auth: true },
      });

      await user.save();
    }

    const accessToken = createAccessToken(user);
    res
      .status(200)
      .json({
        message: "Google authentication successful",
        token: accessToken,
      });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Google authentication failed", error: error.message });
  }
});

app.post('/create-blog', verifyToken, blogValidator, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get the blog data from the request body
    const { title, des, banner, tags, content, draft } = req.body;

    // Ensure 'des' does not exceed maxlength (This should already be handled by the validator)
    // if (des.length > 200) {
    //   return res.status(400).json({ message: 'Description cannot be more than 200 characters long' });
    // }

    // Generate a unique blog_id
    const blog_id = generateUniqueId();

    // Get the author ID from the JWT token (attached to req.user by the verifyToken middleware)
    const authorId = req.user.id; // Assuming req.user contains { id: ... }

    // Create a new blog post
    const newBlog = new Blog({
      blog_id,
      title,
      des,
      banner,
      tags,
      content,
      draft: Boolean(draft), // Ensure draft is a boolean value
      author: authorId // Linking the blog to the author (user)
    });

    // Save the blog post to the database and update the user's post count if it's not a draft
    const savedBlog = await newBlog.save();

    // Increment total posts for the user if the post is published (not a draft)
    const incrementVal = draft ? 0 : 1;
    await User.findByIdAndUpdate(
      authorId,
      { 
        $inc: { "account_info.total_posts": incrementVal },
        $push: { blogs: savedBlog._id } // Add the blog ID to the user's blogs array
      }
    );

    // Respond with the saved blog data and blog ID
    res.status(201).json({
      message: 'Blog post created successfully!',
      blogId: savedBlog._id, // Return the generated blog ID
      blog: savedBlog
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Server error, could not create blog post' });
  }
});


    // Extract the blog ID



// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
