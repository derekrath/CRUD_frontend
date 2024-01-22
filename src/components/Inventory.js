import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Typography,
  Modal,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { LoginContext, InventoryContext } from "../App.js";
import axios from "axios";
import "./Inventory.css";

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
  // alignItems: "center",
  gap: 2,
};

//should create a separate component for this
//Add Item Modal Component
function AddItemModal({
  showError,
  errorMessage,
  open,
  onClose,
  userData,
  onSaveAdd,
}) {
  const [newItem, setNewItem] = useState({
    user_id: 0,
    name: "",
    description: "",
    quantity: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, user_id: userData.id, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSaveAdd(newItem);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle} component="form" onSubmit={handleFormSubmit}>
        <Typography variant="h6">Add New Item</Typography>
        <TextField
          name="name"
          label="Name"
          value={newItem.name}
          onChange={handleInputChange}
          style={{ alignItems: "flex-start" }}
        />
        <TextField
          name="description"
          label="Description"
          value={newItem.description}
          onChange={handleInputChange}
          fullWidth
          style={{ alignItems: "flex-start" }}
        />
        <TextField
          name="quantity"
          label="Quantity"
          type="number"
          value={newItem.quantity}
          onChange={handleInputChange}
          style={{ alignItems: "flex-start" }}
          InputProps={{
            inputProps: {
              className: "hide-spinner",
            },
          }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        {showError && (
          <Alert severity="error" style={{ marginBottom: "20px" }}>
            {errorMessage}
          </Alert>
        )}
      </Box>
    </Modal>
  );
}

//should create a separate component for this
// Edit Item Modal Component
function EditItemModal({
  showError,
  errorMessage,
  open,
  onClose,
  item,
  onSaveEdit,
}) {
  const [editedItem, setEditedItem] = useState(
    item || { name: "", description: "", quantity: 0 }
  );

  useEffect(() => {
    if (item) {
      setEditedItem(item);
    }
  }, [item]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({ ...editedItem, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSaveEdit(editedItem);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle} component="form" onSubmit={handleFormSubmit}>
        <Typography variant="h6">Edit Item</Typography>
        <TextField
          name="name"
          label="Name"
          value={editedItem.name}
          onChange={handleInputChange}
          style={{ alignItems: "flex-start" }}
        />
        <TextField
          name="description"
          label="Description"
          value={editedItem.description}
          fullWidth
          onChange={handleInputChange}
          style={{ alignItems: "flex-start" }}
        />
        <TextField
          name="quantity"
          label="Quantity"
          value={editedItem.quantity}
          onChange={handleInputChange}
          style={{ alignItems: "flex-start" }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        {showError && (
          <Alert severity="error" style={{ marginBottom: "20px" }}>
            {errorMessage}
          </Alert>
        )}
      </Box>
    </Modal>
  );
}

function Inventory() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search result
  const [searchPerformed, setSearchPerformed] = useState(false); // New state variable
  const [editModeOn, setEditModeOn] = useState(false);

  const { items, setItems } = useContext(InventoryContext);
  const {
    url,
    userData,
    loggedIn,
    showError,
    errorMessage,
    setShowError,
    setErrorMessage,
  } = useContext(LoginContext);

  // Original code with warning, probably safe to delete now
  // const fetchItems = async () => {
  //   try {
  //     let fetchedItems;
  //     const response = await axios.get(`${url}/items`);
  //     fetchedItems = response.data;

  //     // Filter items based on logged-in user
  //     if (loggedIn) {
  //       fetchedItems = fetchedItems.filter(
  //         (item) => item.user_id === userData.id
  //       );
  //     }

  //     setItems(fetchedItems.sort((a, b) => a.name.localeCompare(b.name)));
  //   } catch (error) {
  //     console.error("Error:", error.response ? error.response.data : error);
  //   }
  // };

  // useEffect(() => {
  //   fetchItems();
  // }, [url, userData]);

  const fetchItems = useCallback(async () => {
    try {
      let fetchedItems;
      const response = await axios.get(`${url}/items`);
      fetchedItems = response.data;

      if (loggedIn) {
        fetchedItems = fetchedItems.filter(
          (item) => item.user_id === userData.id
        );
      }

      setItems(fetchedItems.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
    }
  }, [url, userData?.id, loggedIn, setItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const fetchItemByName = async (name) => {
    try {
      const response = await axios.get(`${url}/items/name/${name}`);
      setItems(response.data);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      setItems([]);
    }
    setSearchPerformed(true);
  };

  const fetchItemById = async (id) => {
    try {
      const response = await axios.get(`${url}/items/id/${id}`);
      setItems([response.data]);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      setItems([]);
    }
    setSearchPerformed(true);
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      fetchItems();
      return;
    }

    const id = parseInt(searchTerm, 10);
    if (!isNaN(id)) {
      fetchItemById(id);
    } else {
      fetchItemByName(searchTerm);
    }
  };

  const handleReset = () => {
    setSearchPerformed(false);
    fetchItems();
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`${url}/items/${itemId}`);
      fetchItems();
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
    }
  };

  const handleAddNewItem = async (item) => {
    try {
      const itemData = { ...item, user_id: userData.id };
      await axios.post(`${url}/items`, itemData);
      setAddItemModalOpen(false);
      setShowError(false);
      fetchItems();
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowError(true);
    }
  };

  const EditableCell = ({ item, field, onChange }) => {
    if (editModeOn) {
      return (
        <TextField
          size="small"
          variant="standard"
          className="editableTextField"
          InputProps={{
            style: {
              fontSize: "inherit",
            },
          }}
          value={item[field]}
          onChange={(e) => onChange(e, item.id, field)}
        />
      );
    }
    // Apply shortenedDescription only to the description field
    if (field === "description") {
      return <>{shortenedDescription(item[field])}</>;
    }
    return <>{item[field]}</>;
  };

  const handleInlineEditChange = (e, itemId, field) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, [field]: e.target.value };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setEditModalOpen(true);
  };

  const handleUpdateItem = async (updatedItem) => {
    try {
      await axios.put(`${url}/items/${updatedItem.id}`, updatedItem);
      setEditModalOpen(false);
      setShowError(false);
      fetchItems();
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowError(true);
    }
  };

  const filterItems = (item) => {
    const searchTextLower = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchTextLower) ||
      (!isNaN(searchTerm) && item.id === parseInt(searchTerm))
    );
  };

  const shortenedDescription = (description) => {
    if (description.length > 100) {
      return `${description.substring(0, 100)}...`;
    }
    return description;
  };

  const handleButtonClick = () => {
    if (editModeOn) {
      handleBulkUpdate();
    }
    setEditModeOn(!editModeOn);
  };

  const handleBulkUpdate = async () => {
    if (editModeOn) {
      try {
        await axios.put(`${url}/items/bulkupdate`, { items });
        setEditModeOn(false);
        fetchItems();
      } catch (error) {
        console.error(
          "Error during bulk update:",
          error.response ? error.response.data : error
        );
      }
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="center" margin="20px">
        <TextField
          label="Search by Name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "20px" }}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Box>
      {searchPerformed && <Button onClick={handleReset}>Reset</Button>}
      {loggedIn ? (
        <Box display="flex" justifyContent="space-between" margin="0px">
          <Button
            startIcon={<AddIcon />}
            onClick={() => setAddItemModalOpen(true)}
          >
            Add Item
          </Button>

          <AddItemModal
            showError={showError}
            errorMessage={errorMessage}
            open={addItemModalOpen}
            onClose={() => {
              setAddItemModalOpen(false);
              setShowError(false);
              setErrorMessage("");
            }}
            userData={userData}
            onSaveAdd={handleAddNewItem}
          />
          <Button onClick={handleButtonClick}>
            {editModeOn ? "Close Editor" : "Edit All"}
          </Button>
        </Box>
      ) : (
        <></>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.filter(filterItems).map((item) => (
              <TableRow key={item.id}>
                <TableCell className="nameCell">
                  <EditableCell
                    item={item}
                    field="name"
                    onChange={handleInlineEditChange}
                  />
                </TableCell>
                <TableCell className="descriptionCell">
                  <EditableCell
                    item={item}
                    field="description"
                    onChange={handleInlineEditChange}
                  />
                </TableCell>
                <TableCell className="otherCell">
                  <EditableCell
                    item={item}
                    field="quantity"
                    onChange={handleInlineEditChange}
                  />
                </TableCell>
                <TableCell className="otherCell">
                  {loggedIn && !editModeOn && (
                    <div>
                      <IconButton onClick={() => handleEditClick(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EditItemModal
        showError={showError}
        errorMessage={errorMessage}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setShowError(false);
          setErrorMessage("");
        }}
        item={currentItem}
        onSaveEdit={handleUpdateItem}
      />
    </div>
  );
}

export default Inventory;
