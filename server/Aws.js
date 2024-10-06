// aws.js

import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';

dotenv.config();

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // Make sure this is set in your .env
});

// Function to generate a pre-signed URL for image upload
export const generateUploadURL = async () => {
  const date = new Date();
  const filename = `${date.getTime()}_${nanoid()}.jpeg`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET, // Ensure this is set correctly in your .env
    Key: filename,
    Expires: 60 * 60, // URL expiration time (in seconds, e.g., 1 hour)
    ContentType: "image/jpeg",
  };

  try {
    // Generate the signed URL
    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw new Error("Could not generate the URL");
  }
};
