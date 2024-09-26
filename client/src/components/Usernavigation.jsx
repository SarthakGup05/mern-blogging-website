import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../App";

const Usernavigation = () => {
  const { userAuth, setUserAuth } = useContext(UserContext);
  const navigate = useNavigate();
  const username = userAuth?.username; // Extract username

  // Function to clear session and redirect to sign-in
  const handleSignOut = () => {
    // Clear session data
    setUserAuth(null); // Clear userAuth context
    sessionStorage.clear(); // Clear session storage (if you store any data there)
    localStorage.clear(); // Clear local storage (if you store any data there)

    // Redirect to sign-in page
    navigate("/signin");
  };

  return (
    <div className="absolute right-0 z-50 bg-white border border-grey w-60 overflow-hidden">
      <Link to="/write" className="block p-2 link w-full text-left pl-8 py-4">Write</Link>
      <Link to="/dashboard" className="block p-2 link text-left pl-8 py-4">Dashboard</Link>
      <Link to="/profile" className="block p-2 link text-left pl-8 py-4">Profile</Link>
      <Link to="/settings" className="block p-2 link text-left pl-8 py-4">Settings</Link>
      <hr />
      <button
        onClick={handleSignOut}
        className="block p-2 text-red link hover:text-red  pl-8 py-4 w-full text-left"
      >
        Sign Out
      </button>
      {username && <p className="p-2">Welcome, {username}</p>}
    </div>
  );
};

export default Usernavigation;
