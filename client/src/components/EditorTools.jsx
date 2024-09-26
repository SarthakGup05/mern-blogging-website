import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Header from "@editorjs/header";
import Marker from "@editorjs/marker";


// import { Uploadimg } from '../common/aws'; // Import the Uploadimg function

// const UploadImgByFile = async (file) => {
//   try {
//     // Call the Uploadimg function, which uploads the file to S3 (or wherever)
//     const fileUrl = await Uploadimg(file);

//     if (fileUrl) {
//       // Return the image URL in the format expected by Editor.js
//       return {
//         success: 1,
//         file: {
//           url: fileUrl, // The image URL (no need to wrap in {})
//         },
//       };
//     } else {
//       throw new Error("Failed to upload image");
//     }
//   } catch (err) {
//     console.error("Error during file upload:", err);
//     return {
//       success: 0,
//       message: err.message || "Error uploading image by file",
//     };
//   }
// };


// const UploadImgByURL = async (url) => {
//   try {
//     // Check if the URL is valid and starts with http or https
//     if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
//       // Optionally, you can add logic to check if the URL actually points to an image
//       const response = await fetch(url);
//       if (response.ok) {
//         // If the URL is valid and the request succeeds, return the formatted object
//         return {
//           success: 1,
//           file: {
//             url: url, // The image URL
//           },
//         };
//       } else {
//         throw new Error("Failed to fetch image from URL");
//       }
//     } else {
//       throw new Error("Invalid URL");
//     }
//   } catch (err) {
//     return {
//       success: 0,
//       message: err.message || "Error uploading image by URL",
//     };
//   }
// };


// Create an object with the imported tools and their configurations
const editorTools = {
  embed: {
    class: Embed,
    inlineToolbar: true,
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: "Start Typing...",
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  marker: {
    class: Marker,
    inlineToolbar: true,
  },
  // image: {
  //   class: Image,
  //   config: {
  //     uploader: {
  //       byFile: UploadImgByFile, // This will handle image uploads by file
  //       byUrl: UploadImgByURL,   // This will handle image uploads by URL
  //     },
  //   },
  // },
  inlineCode: {
    class: InlineCode,
  },
};

export { editorTools };


// Export the editor tools object
