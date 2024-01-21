import React, { useContext } from "react";
import { InventoryContext, LoginContext } from "../App.js";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";

function Home() {
  const { userData, users } = useContext(LoginContext);
  const { items } = useContext(InventoryContext);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Elite Inventory Management System
      </Typography>
      <Typography variant="body1" gutterBottom>
        Manage inventory more efficiently.
      </Typography>
      <Grid
        item
        xs={12}
        sm={6}
        display="flex"
        justifyContent="center"
        marginTop="100px"
      >
        <Card style={{ backgroundColor: userData ? "lightgreen" : "pink" }}>
          <CardContent>
            <Typography variant="h6">Login Status</Typography>
            <Typography variant="body1">
              You are {userData ? "Logged In" : "Logged Out"}.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid container spacing={2} style={{ marginTop: "50px" }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">User Count</Typography>
              <Typography variant="body1">
                There are currently {users.length} users.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Inventory Size</Typography>
              <Typography variant="body1">
                There are currently {items.length} items in inventory.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
