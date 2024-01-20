import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Inventory from "./components/Inventory";
import NavBar from "./components/NavBar";
import LoginModal from "./components/LoginModal";
import "./App.css";
import axios from "axios";

export const LoginContext = createContext();
export const BlogContext = createContext();

function App() {
  // const url = "http://localhost:8080";
  const dev = process.env.NODE_ENV !== "production";
  // for Heroku:
  const url = dev
    ? `http://localhost:${process.env.REACT_APP_PORT}`
    : "https://CRUD-server.herokuapp.com";
  // const url = dev ? 'http://localhost:8080' : 'https://CRUD-server.herokuapp.com';

  const [loggedIn, setLoggedIn] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState("");
  const [cookies, setCookies, removeCookies] = useCookies([
    "username-cookie",
    "passwordRaw-hash-cookie",
  ]);
  const [showLoginError, setShowLoginError] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [showCreateUserSuccess, setShowCreateUserSuccess] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

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
          if (res.data) {
            setUserData(res.data.user);
            setLoggedIn(true);
            //better to use a token for better security, but this works for now
            let hashedPassword = res.data.user.hashedPassword;
            setCookies("username-cookie", username, { expires: nextMonth });
            setCookies("password-hash-cookie", hashedPassword, {
              expires: nextMonth,
            });
            setShowLoginError(false);
            setShowLoginSuccess(true);
            setShowCreateUserSuccess(false);
            setLoginMessage("LOGIN SUCCESSFUL");
          }
        })
        .catch((err) => {
          setCookies("username-cookie", "", { expires: nextMonth });
          setCookies("password-hash-cookie", "", { expires: nextMonth });
          setShowLoginError(true);
          setShowLoginSuccess(false);
          setShowCreateUserSuccess(false);
          setLoginMessage(err.response.data.message);
        });
    },
    [url, nextMonth, setCookies]
  );

  function logout() {
    removeCookies("username-cookie");
    removeCookies("passwordRaw-hash-cookie");
    setShowCreateUserSuccess(false);
    setShowLoginError(false);
    setShowLoginSuccess(false);
    setUserData(null);
    setLoggedIn(false);
  }

  // // Handle login modal toggle
  const toggleLoginModal = () => {
    setLoginModalOpen(!loginModalOpen);
  };

  // Check if user is already logged in via cookies
  useEffect(() => {
    let username = cookies["username-cookie"];
    let hashedPassword = cookies["password-hash-cookie"];
    if (username && hashedPassword) {
      let password = hashedPassword;
      loginUser(username, password);
    }
  }, [cookies, loginUser]);

  useEffect(() => {
    const getUsers = async () => {
      axios.get(`${url}/users`).then((userList) => setUsers(userList.data));
    };
    getUsers();
  }, [url, userData]);

  useEffect(() => {
    if (userData) {
      setLoginModalOpen(false);
    }
  }, [userData]);

  const loginContext = {
    url,
    cookies,
    username,
    password,
    userData,
    users,
    showLoginError,
    showLoginSuccess,
    showCreateUserSuccess,
    loginMessage,
    setUserData,
    setUsername,
    setPassword,
    loginUser,
    logout,
    toggleLoginModal,
    setCookies,
    removeCookies,
    setShowLoginError,
    setShowLoginSuccess,
    setShowCreateUserSuccess,
    setLoginMessage,
  };

  return (
    <div className="App">
      <LoginContext.Provider value={loginContext}>
        <NavBar loggedIn={loggedIn} />
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
