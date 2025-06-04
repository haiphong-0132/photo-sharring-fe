import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";

import "./styles.css";

import {useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { useState, useEffect } from "react";
/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: ""
  });

  useEffect(() => {
    fetchModel(`/user/${userId}`)
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userId]);


  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" color="inherit">
            Kiều Hồng Phong - B22DCKH084
          </Typography>
        </Box>
        <Typography variant="h6" color="inherit">
          {userId ? location.pathname.startsWith("/photos") ? `Photos of ${user.first_name}` : `${user.first_name}'s details` : ""}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
