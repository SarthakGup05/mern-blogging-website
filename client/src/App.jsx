import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserAuthForm from "./pages/userAuthForm";
import { createContext, useState, useEffect } from "react";
import { retrieveFromSession } from "./common/session";
import Editor from "./pages/editor";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({ token: null });

  useEffect(() => {
    try {
      // Retrieve user data from session storage
      const userInSession = retrieveFromSession('user');

      if (userInSession) {
        const parsedUser = JSON.parse(userInSession);

        // Validate the structure of the parsed object
        if (parsedUser && parsedUser.token) {
          setUserAuth(parsedUser);
        } else {
          // If the token is not present, reset userAuth to default
          setUserAuth({ token: null });
        }
      } else {
        // If no user is found in session, reset userAuth
        setUserAuth({ token: null });
      }
    } catch (error) {
      console.error("Error retrieving user from session:", error);
      setUserAuth({ token: null }); // Reset to default on error
    }
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/edit" element={<Editor/>}/>
        <Route path="/" element={<Navbar />}>
          <Route path="signin" element={<UserAuthForm type='sign-in' />} />
          <Route path="signup" element={<UserAuthForm type='sign-up' />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
