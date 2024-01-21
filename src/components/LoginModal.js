import React, { useContext } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { LoginContext } from "../App.js";
import axios from "axios";

function LoginModal({ open, handleClose }) {

  const {
    url,
    username,
    setUsername,
    password,
    setPassword,
    // userData,
    showLoginError,
    showLoginSuccess,
    showCreateUserSuccess,
    loginMessage,
    loginUser,
    setShowLoginError,
    setShowLoginSuccess,
    setShowCreateUserSuccess,
    setLoginMessage,
  } = useContext(LoginContext);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  };

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
          setLoginMessage(res.data.message);
          setShowCreateUserSuccess(true);
          setShowLoginError(false);
          setShowLoginSuccess(false);
        }
      })
      .catch((err) => {
        setLoginMessage(err.response.data.message);
        setShowCreateUserSuccess(false);
        setShowLoginError(true);
        setShowLoginSuccess(false);
      });
  }
  const handleFormSubmit = (e) => {
    setShowLoginError(false);
    e.preventDefault();
    loginUser(username, password);
  };

  const submitAccount = (e) => {
    e.preventDefault();
    createUserAccount(username, password);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle} component="form" onSubmit={handleFormSubmit}>
        <Typography variant="h5"> Inventory Account Login</Typography>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          margin="normal"
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
        <Button
          ariant="outlined"
          color="secondary"
          fullWidth
          onClick={submitAccount}
        >
          Create Account
        </Button>
        {showLoginError ? (
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
        )}
      </Box>
    </Modal>
  );
}

export default LoginModal;
