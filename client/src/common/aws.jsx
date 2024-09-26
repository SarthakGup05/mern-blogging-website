// import axios from 'axios';

export const Uploadimg = async (file) => {
  try {
    const response = await fetch("http://localhost:3000/get-upload-url");
    const { uploadUrl } = await response.json();

    const s3Response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (s3Response.ok) {
      const imageUrl = uploadUrl.split('?')[0]; // URL without query parameters
      console.log("Image successfully uploaded to:", imageUrl);
      return imageUrl;
    } else {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

