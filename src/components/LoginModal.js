// src/components/LoginModal.js
import React, { useEffect, useContext, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  // Typography,
  // Alert,
} from "@mui/material";
// import axios from 'axios';
// import { useCookies } from "react-cookie";
import { LoginContext } from "../App.js";

const axios = require("axios");

function LoginModal({ open, handleClose }) {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [loginMessage, setLoginMessage] = useState("Login Failed");

  const {
    url,
    username,
    setUsername,
    password,
    setPassword,
    // userData,
    // showLoginError,
    // showLoginSuccess,
    // showCreateUserSuccess,
    // loginMessage,
    loginUser,
    // setShowLoginError,
    // setShowLoginSuccess,
    // setShowCreateUserSuccess,
    // setMessageText,
  } = useContext(LoginContext);

  async function createUserAccount(username, password) {
    axios({
      method: "post",
      url: `${url}/users`,
      data: {
        username,
        password,
      },
    })
      .then((res) => {
        if (res) {
          // setMessageText(res.data.message)
          // setShowCreateUserSuccess(true)
          // setShowLoginError(false)
          // setShowLoginSuccess(false)
        }
      })
      .catch((e) => {
        // setMessageText('USERNAME IS ALREADY IN USE')
        // setShowCreateUserSuccess(false)
        // setShowLoginError(true)
        // setShowLoginSuccess(false)
      });
  }

  const handleLogin = (e) => {
    // setShowLoginError(false)
    e.preventDefault();
    // let password = passwordRaw;
    // let username = usernameInput;
    loginUser(username, password);
  };
  // const handleLogin = () => {
  //   axios.post('/login', { username, password })
  //     .then(response => {
  //       setLoginMessage('Login successful');
  //       Cookies.set('user', username);
  //       // Handle successful login
  //     })
  //     .catch(error => {
  //       setLoginMessage('Login failed');
  //       // Handle login error
  //     });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // login(e.target[0].value, e.target[1].value)
  // }

  const submitAccount = (e) => {
    e.preventDefault();
    createUserAccount(username, password);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <Button onClick={handleLogin}>Submit</Button>
        <Button onClick={submitAccount}>Create Account</Button>
        {/* <Typography>{loginMessage}</Typography> */}
        {/* {showLoginError ? (
          <Alert severity="error">{loginMessage}</Alert>
        ) : (
          <></>
        )}
        {showLoginSuccess ? (
          <Alert severity="success">{loginMessage}</Alert>
        ) : (
          <></>
        )}
        {showCreateUserSuccess ? (
          <Alert severity="info">{loginMessage}</Alert>
        ) : (
          <></>
        )} */}
      </Box>
    </Modal>
  );
}

export default LoginModal;
