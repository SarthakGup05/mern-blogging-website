import { body } from "express-validator";

// Validator for Sign-Up
const signUpValidator = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

// Validator for Sign-In
const signInValidator = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
const blogValidator = [
  // Validate 'title' field: required, string, and not empty
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),

  // Validate 'des' field: required, string, and not empty, with min and max length
  body('des')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string'),
    
    

  // Validate 'banner' field: optional, but if present must be a valid URL
  body('banner')
    .optional()
    .isURL().withMessage('Banner must be a valid URL'),

  // Validate 'tags' field: optional, must be an array of strings
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array of strings')
    .custom((tags) => {
      if (!tags.length || tags.length > 10) {
        throw new Error('Tags array must have at least one tag and no more than 10 tags');
      }
      if (!tags.every(tag => typeof tag === 'string')) {
        throw new Error('All tags must be strings');
      }
      return true;
    }),

  // Validate 'content' field: required, array
  body('content')
    .notEmpty().withMessage('Content is required')
    .isArray().withMessage('Content must be an array'),

  // Validate 'draft' field: optional, must be boolean
  body('draft')
    .optional()
    .isBoolean().withMessage('Draft must be a boolean')
];
// Exporting the validators
export { signUpValidator, signInValidator, blogValidator };
