import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";
import logo from "../imgs/logo.png";
import PageAnimation from "../common/pageAnimation";
import BannerImg from "../imgs/blog banner.png"; // Default banner image
import { Uploadimg } from "../common/aws"; // Import the upload function
import toast, { Toaster } from "react-hot-toast";
import { EditorContext } from "../pages/Editor";
import EditorJS from "@editorjs/editorjs";
import { editorTools } from "./EditorTools";

const Blogeditor = () => {
  const navigate = useNavigate(); // Initialize navigation
  const { userAuth } = useContext(UserContext); // Destructure userAuth
  const token = userAuth?.token;
  const {
    blog,
    blog: { title, Banner, tags, des },
    setBlog,
    TextEditor,
    setTextEditor,
    SetEditorState,
  } = useContext(EditorContext);

  const [previewUrl, setPreviewUrl] = useState(Banner || BannerImg); // Initialize with either the stored banner or the default image
  const [isPublishing, setIsPublishing] = useState(false); // Track button state
  const textareaRef = useRef(null);

  // Log the initial image URL when component mounts
  useEffect(() => {
    console.log("Initial Banner Image URL:", previewUrl);
  }, [previewUrl]);

  // Initialize EditorJS only once
  useEffect(() => {
    const editor = new EditorJS({
      holder: "textEditor",
      data: { blocks: blog.content || [] }, // Load existing content if any
      tools: editorTools,
      placeholder: "Let's write an awesome story",
      onReady: () => setTextEditor(editor),
    });

    return () => {
      editor.destroy(); // Cleanup on unmount
      setTextEditor(null);
    };
  }, [blog.content, setTextEditor]);

  // Handle uploading the banner to AWS
  const handleUploadBanner = async (e) => {
    const img = e.target.files[0]; // Get the selected file
    if (img) {
      const localUrl = URL.createObjectURL(img);
      setPreviewUrl(localUrl); // Show a local preview image immediately
      console.log("Local preview URL:", localUrl);

      try {
        toast.loading("Uploading image...");
        const uploadUrl = await Uploadimg(img); // Upload to AWS and get the uploaded URL
        toast.dismiss();
        if (uploadUrl) {
          setBlog((prev) => ({ ...prev, Banner: uploadUrl })); // Update blog with AWS URL
          setPreviewUrl(uploadUrl); // Show the uploaded image from AWS
          console.log("Uploaded Banner URL from AWS:", uploadUrl);
          toast.success("Image uploaded successfully!");
        }
      } catch (error) {
        toast.dismiss();
        toast.error("Error uploading image. Please try again.");
      }
    }
  };

  // Handle auto-resizing of the textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
      setBlog((prev) => ({ ...prev, title: textarea.value })); // Update blog title
    }
  };

  // Handle publishing event
  const handlePublishEvent = () => {
    if (!previewUrl || !title) {
      return toast.error("Please complete all required fields (title and banner).");
    }

    if (TextEditor && TextEditor.isReady) {
      TextEditor.save()
        .then((data) => {
          console.log("EditorJS Data:", data);
          if (data.blocks.length) {
            setBlog((prev) => ({ ...prev, content: data.blocks }));
            SetEditorState("publish");
            toast.success("Blog is ready to publish!");
          } else {
            toast.error("Write something to publish it.");
          }
        })
        .catch((err) => {
          console.error("Error saving the blog:", err);
          toast.error("Failed to save the blog.");
        });
    } else {
      toast.error("Editor is not ready.");
    }
  };

  // Save blog as a draft
  const SaveDraftBtn = async () => {
    if (!title.length) {
      return toast.error("Please write a title before saving the draft.");
    }
  
    try {
      setIsPublishing(true); // Disable the publish button
      const loadingToast = toast.loading("Saving draft...");
  
      // Build the blog object
      const blogObj = {
        title: title.trim(),  // Ensure title has no trailing spaces
        des: des?.trim() || "No description provided",  // Provide default value if description is missing
        banner: Banner || BannerImg,  // Use either the uploaded banner or the default one
        tags: tags?.length ? tags : ["untagged"],  // Provide default tag if none are provided
        content: blog.content?.length ? blog.content : [],  // Ensure content is passed correctly
        draft: true,  // Mark it as a draft
      };
  
      // Log the data to verify it's being passed correctly
      console.log("Saving draft with the following data:", blogObj);
  
      // Make the API request
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
        toast.success("Blog draft saved successfully!");
  
        // Wait for 500ms, then navigate to the home page
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        toast.dismiss(loadingToast);
        toast.error("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error saving the draft:", error);
      toast.dismiss();  // Dismiss the loading toast
      if (error.response) {
        // If there's a response from the server, show a detailed error message
        toast.error(`Failed to save draft: ${error.response.data.message || "Server error"}`);
      } else {
        // For other errors (network issues, etc.)
        toast.error("Failed to save draft. Please try again.");
      }
    } finally {
      setIsPublishing(false); // Enable the button again after submission
    }
  };
  

  // Adjust textarea height when the title changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [title]);

  return (
    <>
      <nav className="navbar">
        <Toaster />
        <Link to={"/"} className="flex-none w-10">
          <img src={logo} alt="Logo" />
        </Link>
        <p className="text-black max-md:hidden line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button
            className={`btn-dark py-2 ${isPublishing ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={handlePublishEvent}
            disabled={isPublishing} // Disable button during publishing
          >
            Publish
          </button>
          <button
            className={`btn-light py-2 ${isPublishing ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={SaveDraftBtn}
            disabled={isPublishing} // Disable button during draft saving
          >
            Save Draft
          </button>
        </div>
      </nav>

      <PageAnimation>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  src={previewUrl || BannerImg} // Show preview or default image
                  className="w-full h-full object-cover z-20"
                  alt="Banner"
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg" // Accept common image types
                  hidden
                  onChange={handleUploadBanner} // Trigger upload on file select
                />
              </label>
            </div>

            <textarea
              ref={textareaRef}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full outline-none resize-none leading-tight placeholder:opacity-40"
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} // Prevent Enter default
              onInput={adjustTextareaHeight}
              rows={1}
              value={title}
            />

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </PageAnimation>
    </>
  );
};

export default Blogeditor;
