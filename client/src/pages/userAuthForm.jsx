import React, { useRef, useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import {
  Email,
  Lock,
  AccountCircle,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";
import PageAnimation from "../common/pageAnimation";
import axios from "axios";
import * as Yup from "yup";
import { storeInsession } from "../common/session";
import { UserContext } from "../App";
import { handleGoogleSignIn } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null); // Reference for the form element
  const { userAuth, setUserAuth } = useContext(UserContext); // Destructure both userAuth and setUserAuth
  const token = userAuth?.token;

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    ...(type === "sign-up" && {
      fullName: Yup.string()
        .min(3, "Full name must be at least 3 characters long")
        .required("Full name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
    username: Yup.string()
      .min(3, "Username must be at least 3 characters long")
      .required("Username is required"),
  });

  const handleServerAuth = async (serverRoute, formDataObject) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}${serverRoute}`,
        formDataObject,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // Handle successful response
      storeInsession("user", JSON.stringify(data));
      setUserAuth(data);
      navigate("/"); // Redirect to home after successful sign-in/sign-up
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(
          "User not found. Please check your username and try again."
        );
      } else {
        toast.error(
          "Failed to authenticate. Please check your input and try again."
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverRoute = type === "sign-in" ? "/signin" : "/signup";
    const form = new FormData(formRef.current);
    const formDataObject = Object.fromEntries(form.entries());

    try {
      await validationSchema.validate(formDataObject, { abortEarly: false });
      await handleServerAuth(serverRoute, formDataObject);
    } catch (errors) {
      errors.inner.forEach((err) => {
        toast.error(err.message);
      });
    }
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();

    try {
      const user = await handleGoogleSignIn();
      const formDataObject = { token: user.token };
      await handleServerAuth("/google-auth", formDataObject);
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to authenticate with Google. Please try again.");
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return token ? (
    <Navigate to="/" />
  ) : (
    <PageAnimation keyvalue={type}>
      <section className="h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <Toaster />
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-6 md:mb-10">
          {type === "sign-in" ? "Welcome Back" : "Join Us Today"}
        </h1>
        <form
          ref={formRef}
          className="w-full max-w-md space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          {type === "sign-up" && (
            <>
              <TextField
                label="Full Name"
                name="fullName"
                variant="outlined"
                fullWidth
                required
                className="bg-gray-100 rounded-md"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person className="text-gray-500" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                required
                className="bg-gray-100 rounded-md"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email className="text-gray-500" />
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}

          {type === "sign-in" && (
            <TextField
              label="Username"
              name="username"
              variant="outlined"
              fullWidth
              required
              className="bg-gray-100 rounded-md"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle className="text-gray-500" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            required
            className="bg-gray-100 rounded-md"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock className="text-gray-500" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {type === "sign-up" && (
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              className="bg-gray-100 rounded-md"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-gray-500" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="py-3 rounded-md"
            sx={{
              backgroundColor: "black",
              "&:hover": {
                backgroundColor: "#333",
              },
              borderRadius: "8px",
            }}
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </Button>

          <div className="relative w-full flex items-center gap-2 my-6 text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p className="uppercase opacity-50">or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <Button
            onClick={handleGoogleAuth}
            variant="outlined"
            fullWidth
            startIcon={<FcGoogle />}
            className="py-3 rounded-md"
            sx={{
              borderColor: "#ccc",
              color: "black",
              borderRadius: "8px",
            }}
          >
            {type === "sign-in"
              ? "Sign in with Google"
              : "Sign up with Google"}
          </Button>
        </form>
      </section>
    </PageAnimation>
  );
};

export default UserAuthForm;
