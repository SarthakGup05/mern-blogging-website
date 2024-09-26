import mongoose, { Schema } from "mongoose";

const blogSchema = mongoose.Schema({
  blog_id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    // required: true, // Uncomment if needed
  },
  des: {
    type: String,
     // Keep or increase this limit based on your needs
    // required: true // Uncomment if needed
  },
  content: {
    type: [Schema.Types.Mixed], // Use Mixed type if content can be of different types
    // required: true // Uncomment if needed
  },
  tags: {
    type: [String],
    // required: true // Uncomment if needed
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  activity: {
    total_likes: {
      type: Number,
      default: 0
    },
    total_comments: {
      type: Number,
      default: 0
    },
    total_reads: {
      type: Number,
      default: 0
    },
    total_parent_comments: {
      type: Number,
      default: 0
    },
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'comments'
  },
  draft: {
    type: Boolean,
    default: false
  }
}, 
{ 
  timestamps: {
    createdAt: 'publishedAt'
  } 
});

export default mongoose.model("Blog", blogSchema); // Use "Blog" for model name
