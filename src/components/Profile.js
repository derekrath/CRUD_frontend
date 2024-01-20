import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Grid, Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoginContext } from "../App.js";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const { userData, setUserData, url, logout } = useContext(LoginContext);
  const [editableFields, setEditableFields] = useState({});
  const [localUserData, setLocalUserData] = useState({ ...userData }); // Local state to manage edits

  const handleEditClick = (field) => {
    setEditableFields({ ...editableFields, [field]: true });
    setLocalUserData({ ...localUserData, [field]: userData[field] }); // Initialize local state with current userData
  };

  const handleFieldChange = (field, value) => {
    const newValue = value !== null && value !== undefined ? value : "";
    setLocalUserData({ ...localUserData, [field]: newValue });
  };

  const handleFieldBlur = (field) => {
    setEditableFields({ ...editableFields, [field]: false });
    updateUserProfile(localUserData);
  };

  const updateUserProfile = (updatedUserData) => {
    setUserData({ ...userData, id: updatedUserData.id });
  };

  const handleDeleteAccount = () => {
    axios
      .delete(`${url}/users/${userData.id}`)
      .then((response) => {
        logout();
        navigate("/");
      })
      .catch((error) => {

      });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Paper elevation={3} style={{ padding: "20px", maxWidth: "800px" }}>
        <Typography variant="h5" gutterBottom>
          User Profile
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteAccount}
          // style={{ marginTop: "20px" }}
        >
          Delete Account
        </Button>
        <Grid container spacing={2}>
          {/* ID Display (Non-editable) */}
          <Grid item xs={12} sm={6}>
            <Paper elevation={2} style={{ padding: "10px", margin: "10px" }}>
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                ID:
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "5px" }}>
                {userData.id}
              </Typography>
            </Paper>
          </Grid>

          {/* Editable First Name */}
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={2}
              style={{
                padding: "10px",
                margin: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  First Name:
                </Typography>
                {editableFields["first_name"] ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={localUserData.first_name}
                    onChange={(e) =>
                      handleFieldChange("first_name", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("first_name")}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleFieldBlur("first_name");
                      }
                    }}
                  />
                ) : (
                  <Typography variant="body1" style={{ marginLeft: "5px" }}>
                    {userData.first_name}
                  </Typography>
                )}
              </div>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => handleEditClick("first_name")}
              >
                Edit
              </Button>
            </Paper>
          </Grid>

          {/* Editable Last Name */}
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={2}
              style={{
                padding: "10px",
                margin: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Last Name:
                </Typography>
                {editableFields["last_name"] ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={localUserData.last_name}
                    onChange={(e) =>
                      handleFieldChange("last_name", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("last_name")}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleFieldBlur("last_name");
                      }
                    }}
                  />
                ) : (
                  <Typography variant="body1" style={{ marginLeft: "5px" }}>
                    {userData.last_name}
                  </Typography>
                )}
              </div>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => handleEditClick("last_name")}
              >
                Edit
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Profile;
