import React from "react";
import { AppBar, Box, Checkbox, FormControlLabel, Toolbar, Typography, FormGroup } from "@mui/material";

import { useLocation } from "react-router-dom";

import { useState, useEffect } from "react";

import "./styles.css";

import fetchModel from "../../lib/fetchModelData";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar ({advancedFeature, setAdvancedFeature}) {
  const location = useLocation();
  const userId = location.pathname.split("/")[2];

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    ocupation: ""
  });


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchModel(`/user/${userId}`);
        if (data) {
          setUser(data);
        }
      } catch (err) {
        console.error("Error fetching user data: ", err);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <AppBar className="topbar-appBar" position="fixed">
      <Toolbar>
        <Box sx={{flexGrow: 1}}>
          <Typography variant="h6" color="inherit">
            Kiều Hồng Phong - B22DCKH084
          </Typography>
        </Box>
        <FormGroup>
          <FormControlLabel 
            label="Advanced Feature" 
            control={<Checkbox color="default" checked={advancedFeature} onChange={(e) => setAdvancedFeature(e.target.checked)} />}
            />
        </FormGroup>
        <Typography variant="h6" color="inherit">
          {userId ? location.pathname.startsWith("/photos") ? `Photos of ${user.first_name}` : `${user.first_name}'s details` : ""}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
