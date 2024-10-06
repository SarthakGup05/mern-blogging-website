import mongoose, { Schema } from "mongoose";

let profile_imgs_name_list = [
  "Garfield",
  "Tinkerbell",
  "Annie",
  "Loki",
  "Cleo",
  "Angel",
  "Bob",
  "Mia",
  "Coco",
  "Gracie",
  "Bear",
  "Bella",
  "Abby",
  "Harley",
  "Cali",
  "Leo",
  "Luna",
  "Jack",
  "Felix",
  "Kiki",
];
let profile_imgs_collections_list = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];

const userSchema = mongoose.Schema(
  {
    personal_info: {
      fullName: {
        type: String,
        lowercase: true,
        required: [true, "Full name is required"],
        minlength: [3, "Full name must be at least 3 characters long"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: true,
        validate: {
          validator: function (v) {
            return /^\S+@\S+\.\S+$/.test(v); // Simple email regex validation
          },
          message: (props) => `${props.value} is not a valid email format!`,
        },
      },
      password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        validate: {
          validator: function (v) {
            return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v); // Password complexity validation
          },
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
        },
      },
      username: {
        type: String,
        minlength: [3, "Username must be at least 3 characters long"],
        unique: true,
        required: [true, "Username is required"],
      },
      bio: {
        type: String,
        maxlength: [200, "Bio should not be more than 200 characters"],
        default: "",
      },
      profile_img: {
        type: String,
        default: function () {
          const collection =
            profile_imgs_collections_list[
              Math.floor(Math.random() * profile_imgs_collections_list.length)
            ];
          const seed =
            profile_imgs_name_list[
              Math.floor(Math.random() * profile_imgs_name_list.length)
            ];
          return `https://api.dicebear.com/6.x/${collection}/svg?seed=${seed}`;
        },
      },
      avatar: { type: String, default: "https://i.pravatar.cc/300?img=1" },
      google_auth: {
        type: Boolean,
        default: false,
      }
    },
    social_links: {
      youtube: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    account_info: {
      total_posts: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
    blogs: {
      type: [Schema.Types.ObjectId],
      ref: "blogs",
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

export default mongoose.model("users", userSchema);
