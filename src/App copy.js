import './App.css';
import Home from './components/Home';
import Profile from './components/Profile';
import Inventory from './components/Inventory';
import { Navigate, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.js";
import { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useCookies } from 'react-cookie';

export const LoginContext = createContext();
export const UserContext = createContext();

const axios = require('axios');

function App() {

  const dev = process.env.NODE_ENV !== 'production'; // true or false
  const url = dev ? `http://localhost:${process.env.REACT_APP_PORT}` : 'https://z-prefix-server.herokuapp.com';

  const [userData, setUserData] = useState('')
  const [usernameInput, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [cookies, setCookies, removeCookies] = useCookies(['username-cookie', 'passwordRaw-hash-cookie']);
  // const [showLoginError, setShowLoginError] = useState(false);
  // const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  // const [showCreateUserSuccess, setShowCreateUserSuccess] = useState(false);
  // const [messageText, setMessageText] = useState('')

  // const [content, setContent] = useState('');
  // const [title, setTitle] = useState('');
  // const [userBlogs, setUserBlogs] = useState([]);
  // const [allUserBlogs, setAllUserBlogs] = useState([]);

  const nextMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1);
  }, []);

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
            setCookies("password-hash-cookie", hashedPassword, {
              expires: nextMonth,
            });
            // setShowLoginError(false);
            // setShowLoginSuccess(true);
            // setShowCreateUserSuccess(false);
            setUserData({
              username,
              hashedPassword,
            });
            setMessageText("LOGIN SUCCESSFUL");
          }
        })
        .catch((e) => {
          setCookies("username-cookie", "", { expires: nextMonth });
          setCookies("password-hash-cookie", "", { expires: nextMonth });
          // setShowLoginError(true);
          // setShowLoginSuccess(false);
          // setShowCreateUserSuccess(false);
          // setMessageText("INVALID USERNAME OR PASSWORD");
        });
    },
    [url, nextMonth, setCookies]
  );

  //login with cookies
  useEffect(() => {
    let username = cookies["username-cookie"];
    let passwordHash = cookies["password-hash-cookie"];
    if (username && passwordHash) {
      let password = passwordHash;
      loginUser(username, password);
    }
  }, [cookies, loginUser]);

  const loginContext = { cookies, usernameInput, passwordInput, userData }; //add other required context
  // const userContext = { items }; //add other required context

  return (
    <div className="App">
      <LoginContext.Provider value={loginContext}>
        {/* <UserContext.Provider value={userContext}> */}
          <NavBar title="Inventory Management" />
          <Routes>
            {/* <Route path="/" element={<Navigate replace to="/home" />} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        {/* </UserContext.Provider> */}
      </LoginContext.Provider>
    </div>
  );
}

export default App;
