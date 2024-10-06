import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../imgs/logo.png"; // Make sure to replace with the actual path to your logo
import { UserContext } from "../App";
import Usernavigation from "./Usernavigation";

const Navbar = () => {
  const { userAuth } = useContext(UserContext);
  const [usernavpanel, setUserNavPanel] = useState(false);
  const userNavRef = useRef(null);

  // Check if userAuth is defined before destructuring
  const token = userAuth?.token;
  const profileImg = userAuth?.profile_img;

  const Handleusernav = () => {
    setUserNavPanel(!usernavpanel);
  };

  // Handle click outside to close the user nav panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userNavRef.current && !userNavRef.current.contains(event.target)) {
        setUserNavPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userNavRef]);

  return (
    <>
      <nav className="navbar flex items-center p-4 bg-white shadow-md relative">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="logo" className="w-full" />
        </Link>
        <div className="w-full relative mt-2 md:mt-0 md:w-auto">
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-80 lg:w-96 bg-grey p-3 pl-10 pr-12 rounded-full placeholder:text-dark-grey focus:outline-none"
          />
          <i className="fi fi-br-search absolute right-4 top-1/2 transform -translate-y-1/2"></i>
        </div>
        <Link to="/edit" className="hidden md:flex gap-2 link">
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>

        {token ? (
          <>
            <div className="relative link">
              <i className="fi fi-br-bell text-2xl cursor-pointer block mt-1"></i> {/* Notification bell icon */}
            </div>
            <div
              className="relative"
              onClick={Handleusernav}
              ref={userNavRef}
            >
              <img
                src={profileImg || "https://i.pravatar.cc/300?img=1"} // Default avatar if profileImg is not available
                alt="User Avatar"
                className="w-12 h-12 rounded-full cursor-pointer"
              />
              {usernavpanel ? <Usernavigation /> : ""}
            </div>
          </>
        ) : (
          <>
            <Link to="/signin" className="btn-dark py-2">
              <p>Sign In</p>
            </Link>
            <Link to="/signup" className="btn-light py-2 hidden md:block">
              <p>Sign Up</p>
            </Link>
          </>
        )}
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
