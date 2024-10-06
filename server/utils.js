import User from "./Schema/User.js"; // Import your User schema
import jwt from 'jsonwebtoken';


import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique identifier.
 * @returns {string} A unique ID string.
 */
async function generateUniqueUsername(baseName) {
  let username = baseName.toLowerCase().replace(/[^a-z0-9]/g, ""); // Normalize the base name
  let isUnique = false;
  let suffix = 1;

  while (!isUnique) {
    const existingUser = await User.findOne({
      "personal_info.username": username,
    });

    if (existingUser) {
      username = `${baseName}${suffix}`; // Append a number to the base name
      suffix++;
    } else {
      isUnique = true; // Username is unique, break the loop
    }
  }

  return username;
}

//jwt access token
function createAccessToken(user) {
    const payload = {
      id: user._id,           // User ID from the database
      email: user.personal_info.email, // User email
      username: user.personal_info.username // User username
    };
  
    const secretKey = process.env.JWT_SECRET; // Your secret key from .env file
    const options = {
      expiresIn: '24h' // Token expires in 1 hour
    };
  
    // Sign the JWT with the payload, secret key, and options
    const token = jwt.sign(payload, secretKey, options);
  
    return token;
    
  }
  const generateUniqueId = () => {
    return uuidv4(); // Generates a unique UUID
  };

export { generateUniqueUsername, createAccessToken, generateUniqueId };
