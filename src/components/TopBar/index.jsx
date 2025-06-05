import React from "react";
import { AppBar, Menu, Box, Button, Checkbox, FormControlLabel, Toolbar, Typography, FormGroup, Avatar, MenuItem } from "@mui/material";

import { useLocation, Link, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import "./styles.css";

import fetchModel from "../../lib/fetchModelData";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar ({advancedFeature, setAdvancedFeature, userLoggedIn, setUserLoggedIn}) {
  const location = useLocation();
  const userId = location.pathname.split("/")[2];

  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const navigate = useNavigate();

  
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    ocupation: ""
  });

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setAnchor(null);
    setUserLoggedIn(null);
    navigate("/login");
  }

  const handleAvatarClick = (e) => {
    setAnchor(e.currentTarget);
  }

  const handleProfile = () => {
    setAnchor(null);
    navigate(`/users/${userLoggedIn.id}`);
  }

  

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
        {!userLoggedIn ? (
          <Button sx={{mx: 1}} component={Link} to="/login" variant="outlined" color="inherit">
            Login
          </Button>
        ) : (
          <>
            <FormGroup>
              <FormControlLabel 
                label="Advanced Feature" 
                control={<Checkbox color="default" checked={advancedFeature} onChange={(e) => setAdvancedFeature(e.target.checked)} />}
              />
            </FormGroup>

            <Avatar sx={{mx: 1, cursor: 'pointer', '&:hover': {opacity: 0.8}}} onClick={handleAvatarClick}>
              {userLoggedIn.first_name? userLoggedIn.first_name[0].toUpperCase() + userLoggedIn.last_name[0].toUpperCase() : ''}
            </Avatar>

            <Menu
              anchorEl={anchor}
              open={open} 
              onClose={() => setAnchor(null)} 
              MenuListProps={{'aria-labelledby': 'basic-button'}}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

          </>
        )}
        <Typography variant="h6" color="inherit">
          {userId ? location.pathname.startsWith("/photos") ? `Photos of ${user.first_name}` : `${user.first_name}'s details` : ""}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
