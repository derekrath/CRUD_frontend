import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
// import axios from 'axios';
import Home from "./components/Home";
import Profile from "./components/Profile";
import Inventory from "./components/Inventory";
import NavBar from "./components/NavBar";
import LoginModal from "./components/LoginModal"; // Import the login modal component
import "./App.css";

export const LoginContext = createContext();
// export const LoginFunctionsContext = createContext();
export const BlogContext = createContext();

const axios = require("axios");

function App() {
  const dev = process.env.NODE_ENV !== "production";
  const url = dev
    ? `http://localhost:${process.env.REACT_APP_PORT}`
    : "https://your-production-url.com";

  const [loggedIn, setLoggedIn] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userData, setUserData] = useState('')
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookies, removeCookies] = useCookies([
    "username-cookie",
    "passwordRaw-hash-cookie",
  ]);
  // const [showLoginError, setShowLoginError] = useState(false);
  // const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  // const [showCreateUserSuccess, setShowCreateUserSuccess] = useState(false);
  // const [loginMessage, setLoginMessage] = useState('')

  const nextMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1);
  }, []);

  // Login user function
  const loginUser = useCallback(
    (username, password) => {
      axios({
        method: "post",
        url: `${url}/login`,
        data: {
          username,
          password,
        },
      })
        .then((res) => {
          if (res) {
            let hashedPassword = res.data;
            setCookies("username-cookie", username, { expires: nextMonth });
            // !!!!!Change to the hash, hide the raw password!!!!
            setCookies("password-hash-cookie", hashedPassword, {
              expires: nextMonth,
            });
            // setShowLoginError(false);
            // setShowLoginSuccess(true);
            // setShowCreateUserSuccess(false);
            // !!!!!Change to the hash, hide the raw password!!!!
            setUserData({
              username,
              hashedPassword,
            });
            // setLoginMessage("LOGIN SUCCESSFUL");
          }
        })
        .catch((e) => {
          setCookies("username-cookie", "", { expires: nextMonth });
          setCookies("password-hash-cookie", "", { expires: nextMonth });
          // setShowLoginError(true);
          // setShowLoginSuccess(false);
          // setShowCreateUserSuccess(false);
          // setLoginMessage("INVALID USERNAME OR PASSWORD");
        });
    },
    [url, nextMonth, setCookies]
  );

  // Logout user function
  const handleLogout = (e) => {
    logout();
  };

  function logout() {
    removeCookies("username-cookie");
    removeCookies("passwordRaw-hash-cookie");
    // setShowCreateUserSuccess(false)
    // setShowLoginError(false)
    // setShowLoginSuccess(false)
    // setUserData();
  }
  // const logoutUser = useCallback(() => {
  //   removeCookie("user-cookie");
  //   setLoggedIn(false);
  // }, [removeCookie]);

  // // Handle login modal toggle
  const toggleLoginModal = () => {
    setLoginModalOpen(!loginModalOpen);
  };

  // Check if user is already logged in via cookies
  useEffect(() => {
    if (cookies["user-cookie"]) {
      setLoggedIn(true);
    }
  }, [cookies]);

  const loginContext = {
    url,
    cookies,
    username,
    password,
    // userData,
    // showLoginError,
    // showLoginSuccess,
    // showCreateUserSuccess,
    // loginMessage,
    // setUserData,
    setUsername,
    setPassword,
    loginUser,
    setCookies,
    removeCookies,
    // setShowLoginError,
    // setShowLoginSuccess,
    // setShowCreateUserSuccess,
    // setLoginMessage
  };

  // login with cookies
  useEffect(() => {
    let username = cookies["username-cookie"];
    let hashedPassword = cookies["password-hash-cookie"];
    if (username && hashedPassword) {
      let password = hashedPassword;
      loginUser(username, password);
    }
  }, [cookies, loginUser]);

  return (
    <div className="App">
      <LoginContext.Provider value={loginContext}>
        <NavBar
          loggedIn={loggedIn}
          handleLoginLogout={loggedIn ? logout : toggleLoginModal}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
        <LoginModal open={loginModalOpen} handleClose={toggleLoginModal} />
      </LoginContext.Provider>
    </div>
  );
}

export default App;
