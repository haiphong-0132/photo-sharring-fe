import React from "react";
import { Alert, Snackbar, Modal, AppBar, Menu, IconButton, Box, Button, Checkbox, FormControlLabel, Toolbar, Typography, FormGroup, Avatar, MenuItem } from "@mui/material";

import { useLocation, Link, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import "./styles.css";

import fetchModel from "../../lib/fetchModelData";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
/**
 * Define TopBar, a React component of Project 4.
 */

const BE_URL = process.env.REACT_APP_BE_URL;

function TopBar ({advancedFeature, setAdvancedFeature, userLoggedIn, setUserLoggedIn}) {
  const location = useLocation();
  const userId = location.pathname.split("/")[2];

  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [files, setFiles] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState(null);

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

  const handleCheckboxChange = (e) => {
    setAdvancedFeature(e.target.checked);
    const pathname = location.pathname;
    if (pathname.startsWith("/photos") && !e.target.checked && pathname.split("/")[3]){
      navigate(`/photos/${userId}`);
    }
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0){
      setFiles(selectedFiles);
      const newPreviewUrls = selectedFiles.map((f) => URL.createObjectURL(f));
      setPreviewUrls(newPreviewUrls);
      setError('');
    }
  }

  const handleUploadClick = () => {
    document.getElementById("photo-upload-input").click();
  }

  const handleUploadSummit = async () => {
    if (!files || files.length === 0){
      setSnackbarMessage('Select files to upload');
      setSnackbarOpen(true);
      return;
    }
    setError('');
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch(BE_URL + '/photos/new', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        },
        body: formData
      });

      if (response.ok){
        setSnackbarMessage(`Upload ${files.length} image successfully`);
        setSnackbarOpen(true);
        setFiles(null);
        setPreviewUrls('');
        setModalOpen(false);
        setError('');
      }
      else{
        setError("Failed to upload");
      }

    } catch (err){
      console.error("Error uploading: ", err);
      setError("Failed to upload photo. Try again");
    }



    
  }

  const handleModalClose = () => {
    setModalOpen(false);
    setFiles(null);
    setPreviewUrls('');
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
    <>
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
                control={<Checkbox color="default" checked={advancedFeature} onChange={(e) => handleCheckboxChange(e)} />}
              />
            </FormGroup>

            <IconButton sx={{mx: 1, bgcolor:"#2196f3", color:"white"}} size="medium" onClick={() => setModalOpen(true)}>
              <AddPhotoAlternateOutlinedIcon fontSize="inherit" />
            </IconButton>
            <Modal 
              open={modalOpen}
            >
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                outline: 'none',
                maxHeight: '90vh',
                overflow: 'auto'
              }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Upload New Photo
                </Typography>
                {error && (
                  <Typography color="error" variant="body2" sx={{mb: 2}}>
                    {error}
                  </Typography>
                )}
                <input 
                  type="file" 
                  id="photo-upload-input" 
                  accept="image/*" 
                  multiple
                  style={{display: 'none'}}
                  onChange={handleFileChange}
                />

                <Box 
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 3,
                    mb: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#2196f3' }
                  }}
                  onClick={handleUploadClick}
                >
                  {previewUrls && previewUrls.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                      {previewUrls.map((url, index) => (
                        <img 
                          key={index}
                          src={url} 
                          alt={`Preview ${index + 1}`} 
                          style={{maxWidth: '100%', maxHeight: '120px', marginBottom: '10px'}} 
                        />
                      ))}
                    </Box>
                  ) : (
                    <CloudUploadIcon sx={{fontSize: 60, color: "#ccc", mb: 2}}/>
                  )}

                  <Typography>
                    {files ? `${files.length} photo${files.length > 1 ? 's' : ''} selected` : 'Select photos'}
                  </Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent:'flex-end', gap:2}}>
                  <Button variant="outlined" onClick={handleModalClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUploadSummit}
                    disabled={!files || files.length === 0}
                  >
                    Upload
                  </Button>
               </Box>
              </Box>
            </Modal>

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
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={() => setSnackbarOpen(false)}
      color="success"
    >
      <Alert onClose={() => setSnackbarOpen(false)}>{snackbarMessage}</Alert>
    </Snackbar>
    
    </>
  );
}

export default TopBar;
