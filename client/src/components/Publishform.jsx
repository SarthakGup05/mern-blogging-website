import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import PageAnimation from "../common/pageAnimation";
import toast, { Toaster } from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import { EditorContext } from "../pages/Editor";
import Tags from "./tags";
import BannerImg from "../imgs/blog banner.png"; // Default banner image
import { UserContext } from "../App";

const Publishform = () => {
  const CharLimit = 200;
  const TagLimit = 10;
  const navigate = useNavigate(); // Initialize navigation
  const { userAuth } = useContext(UserContext); // Destructure userAuth
  const token = userAuth?.token;
  const [isPublishing, setIsPublishing] = useState(false); // Track button state

  const {
    SetEditorState,
    setBlog,
    blog: { title, Banner, tags, des, content }, // Banner holds the S3 URL or null
    blog,
  } = useContext(EditorContext);

  useEffect(() => {
    console.log("Banner Image URL:", Banner || BannerImg);
  }, [Banner]);

  const handleCloseEvent = () => {
    SetEditorState("editor");
  };

  const handleTitleChange = (e) => {
    setBlog({ ...blog, title: e.target.value });
  };

  const handleDesChange = (e) => {
    setBlog({ ...blog, des: e.target.value });
  };

  const handleEnterKey = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleTagEvt = (e) => {
    const tag = e.target.value.trim();
    if ((e.keyCode === 13 || e.keyCode === 188) && tag) {
      e.preventDefault();
      if (tags.length < TagLimit && !tags.includes(tag)) {
        setBlog({ ...blog, tags: [...blog.tags, tag] });
      }
      e.target.value = "";
    } else if (tags.length >= TagLimit) {
      toast.error(`You can add a maximum of ${TagLimit} tags.`);
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    setBlog({ ...blog, tags: updatedTags });
  };

  const publishBlog = async () => {
    if (!title.length) {
      return toast.error("Write a title before publishing it.");
    }
    if (!des.length || des.length > CharLimit) {
      return toast.error(
        "Write a description and make sure it's not too long."
      );
    }
    if (!tags.length) {
      return toast.error("Add at least one tag to your blog to rank your blog.");
    }

    try {
      setIsPublishing(true); // Disable the publish button
      const loadingToast = toast.loading("Publishing...");

      const blogObj = {
        title,
        des,
        banner: Banner || BannerImg,
        tags,
        content,
        draft: false,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/create-blog`,
        blogObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.dismiss(loadingToast);
        toast.success("Blog published successfully!");

        // Wait for 5000 ms, then navigate to the home page
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error publishing the blog:", error);
      toast.error("Failed to publish the blog. Please try again.");
    } finally {
      setIsPublishing(false); // Enable the button again after submission
    }
  };

  return (
    <PageAnimation>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />
        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        >
          <CloseIcon />
        </button>

        <div className="max-w-[550px] center">
          <p className="text-grey mb-1">Preview</p>

          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            {Banner ? (
              <img
                src={Banner}
                alt="Blog Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={BannerImg}
                alt="Default Banner"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div>
            <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-1">
              {title || "Untitled Blog"}
            </h1>
            <p className="font-gelasio line-clamp-2 text-xl leading-7">
              {des || "No description available"}
            </p>
          </div>

          <div className="border-grey lg:border-1 lg:pl-8">
            <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
            <input
              type="text"
              placeholder="Blog Title"
              className="input-box pl-4"
              value={title || ""}
              onChange={handleTitleChange}
            />

            <p className="text-dark-grey mb-2 mt-9">
              Write a short description about your blog
            </p>
            <textarea
              maxLength={CharLimit}
              value={des || ""}
              className="h-40 resize-none leading-7 input-box pl-4"
              onChange={handleDesChange}
              onKeyDown={handleEnterKey}
            />
            <p className="mt-1 text-dark-grey text-sm text-right">
              {CharLimit - (des ? des.length : 0)} Characters left
            </p>

            <p className="text-dark-grey mb-2 mt-9">
              Topics - (Help in searching and ranking)
            </p>
            <div className="relative input-box pl-2 py-2 pb-4">
              <input
                type="text"
                placeholder="tags"
                className="sticky input-box bg-white top-0 left-0 pl-4 mb-4 focus:bg-white"
                onKeyDown={handleTagEvt}
              />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <Tags key={i} tag={tag} onDelete={handleDeleteTag} />
                ))}
              </div>
            </div>
            <p className="mt-1 text-dark-grey text-sm text-right">
              {TagLimit - tags.length} tags left
            </p>

            <button
              className={`px-9 btn-dark ${
                isPublishing ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={publishBlog}
              disabled={isPublishing} // Disable button during publishing
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </section>
    </PageAnimation>
  );
};

export default Publishform;
