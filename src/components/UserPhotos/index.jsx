import React from "react";
import { IconButton, Typography, Grid, Card, CardMedia, CardContent, Button, Divider, Box, List, Paper, Chip, Snackbar, Alert} from "@mui/material";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {ArrowBack, Share, Bookmark, ArrowForward} from "@mui/icons-material"
import "./styles.css";
import { useState, useEffect } from "react";
import fetchModel from "../../lib/fetchModelData";
/**
 * Define UserPhotos, a React component of Project 4.
 */

const BE_URL = process.env.REACT_APP_BE_URL;

function UserPhotos ({advancedFeature, setAdvancedFeature}) {
    const {userId, photoId} = useParams();
    const [user, setUser] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [bookmarked, setBookmarked] = useState('outlined');
    const navigate = useNavigate();
    const location = useLocation();
    

    useEffect(() => {

      const fetchData = async () => {
        try{
          const userData = await fetchModel(`/user/${userId}`);
          if (userData){
          setUser(userData);
          }
        } catch (err){
          console.error("Error fetching user: ", err);
        }

        try{
          const photoData = await fetchModel(`/photo/photosOfUser/${userId}`);
          if (photoData){
            setPhotos(photoData);
            if (photoId){
              const index = photoData.findIndex(photo => photo._id === photoId);
              setAdvancedFeature(true);
              if (index !== -1){
                setCurrentPhotoIndex(index);
              }
            }


          }
          else if (advancedFeature && photoData.length > 0){
            navigate(`/photos/${userId}/${photoData[0]._id}`, {replace: true})
          }

        } catch(err){
          console.error("Error fetching photos: ", err);
        }
      }

      fetchData();
    }, [userId, photoId, setAdvancedFeature, advancedFeature, navigate]);

    if (!user){
      return (
        <Typography variant="h5" color="error">
          User not found
        </Typography>
      );
    }

    if (!photos || photos.length === 0){
      return(
        <Card sx={{maxWidth: 600, mx: "auto", mt: 4, p: 2}}>
          <Typography variant="h5" component="h1">
            {user.first_name} {user.last_name}'s Gallery
          </Typography>
        
          <Divider sx={{my: 2}}></Divider>
          <Typography variant="body1">
            No photos found for this user.
          </Typography>
          <Box sx={{mt: 2, display: "flex", justifyContent: "center"}}>
            <Button component={Link} to={`/users/${userId}`} variant="outlined" color="primary">
              Back to Profile
            </Button>
          </Box>
        </Card>
      )
    }

    const handleClickPrevious = () => {
      if (currentPhotoIndex > 0){
        const newIndex = currentPhotoIndex - 1;
        setCurrentPhotoIndex(newIndex);
        navigate(`/photos/${userId}/${photos[newIndex]._id}`);
      }
    }

    const handleClickNext = () => {
      if (currentPhotoIndex < photos.length - 1){
        const newIndex = currentPhotoIndex + 1;
        setCurrentPhotoIndex(newIndex);
        navigate(`/photos/${userId}/${photos[newIndex]._id}`);
      }
    }

    const handleClickShare = () => {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setSnackbarMessage('Photo URL copied to clipboard!');
        setSnackbarOpen(true);
      }).catch(() => {
        setSnackbarMessage('Failed to copy URL');
        setSnackbarOpen(true);
      })
    };

    const handleClickBookmark = () => {
      const currentUrl = window.location.href;
      const photoTitle = `Photo ${currentPhotoIndex + 1} of ${user.first_name} ${user.last_name}`;
      if (bookmarked === "outlined"){
        navigator.clipboard.writeText(currentUrl).then(() => {
          setSnackbarMessage(`Bookmark ${photoTitle} successfully!`);
          setBookmarked("contained");
        })
      }
      else{
        setSnackbarMessage(`Cancel bookmark ${photoTitle} sucessfully!`);
        setBookmarked("outlined");
      }
      setSnackbarOpen(true);
      
    };

    const formatDate = (s) => {
      return new Date(s).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (!advancedFeature){
      return (
        <div className="user-photos">
          <Box sx={{maxWidth: 1200, mx: "auto", mt: 4, px: 2}}>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
              <Typography variant="h4" component="h1">
                {user.first_name} {user.last_name}'s Photos
              </Typography>
              <Button component={Link} to={`/users/${userId}`} variant="outlined" color="primary">
                Back to Profile
              </Button>
            </Box>

            <Grid container spacing={2}>
              {photos.map((photo) => (
                <Grid item xs={12} sm={6} md={4} key={photo._id}>
                  <Card>
                    <CardMedia component="img" image={`${BE_URL}/images/${photo.file_name}`} alt={`Photo by ${user.first_name}`} sx={{width: '100%', height: "auto"}} />
                      <CardContent>
                        <Typography variant="caption">
                          Posted on {formatDate(photo.date_time)}
                        </Typography>
                        <Typography variant="h6" sx={{mt: 2, mb: 1}}>
                          Comments ({photo.comments ? photo.comments.length : 0})
                        </Typography>

                        <Divider sx={{mb: 2}} />

                        {photo.comments && photo.comments.length > 0 ? (
                          <List>
                            {photo.comments.map((comment) => (
                              <Paper key={comment._id} sx={{mb: 2, p: 2}}>
                                <Box sx={{display: "flex", justifyContent: "space-between", mb: 1}}>
                                  <Typography variant="subtitle2" component={Link} to={`/users/${comment.user._id}`} sx={{color: "primary.main", textDecoration: "none"}}>
                                    {comment.user.first_name} {comment.user.last_name}
                                  </Typography>

                                  <Typography variant="caption" color="text.secondary">
                                    {formatDate(comment.date_time)}
                                  </Typography>
                                </Box>

                                <Typography variant="body2">
                                  {comment.comment}
                                </Typography>
                              </Paper>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No comments yet.
                          </Typography>
                        )}
                      </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

          </Box>
        </div>
      )
    }

    const currentPhoto = photos[currentPhotoIndex];

    return (
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <IconButton onClick={handleClickPrevious} disabled={currentPhotoIndex === 0} size="large" title="Previous photo">
            <ArrowBack />
          </IconButton>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">
              Photo {currentPhotoIndex + 1} of {photos.length}
            </Typography>

            <Button startIcon={<Share />} onClick={handleClickShare} size="small" variant="outlined">
              Share
            </Button>

            <Button startIcon={<Bookmark />} onClick={handleClickBookmark} size="small" variant={bookmarked}>
              Bookmark            
            </Button>

          </Box>
            <IconButton onClick={handleClickNext} disabled={currentPhotoIndex === photos.length - 1} size="large" title="Next photo">
              <ArrowForward />
            </IconButton>

        </Box>
        <Card>
          <CardMedia component="img" image={`${BE_URL}/images/${currentPhoto.file_name}`} alt="User photo" sx={{width: '100%', height: 'auto', maxHeight: 600, objectFit: 'contain'}} />
          <CardContent>
            <Typography variant="caption">
              Posted on {formatDate(currentPhoto.date_time)}
            </Typography>
            <Typography variant="h6" sx={{mt: 2, mb: 1}}>
              Comments ({currentPhoto.comments ? currentPhoto.comments.length : 0})
            </Typography>

            <Divider sx={{mb: 2}} />

            {currentPhoto.comments && currentPhoto.comments.length > 0 && (
              <List>
                {currentPhoto.comments.map((comment) => (
                  <Paper key={comment._id} sx={{mb: 2, p: 2}}>
                    <Box sx={{display: "flex", justifyContent: "space-between", mb: 1}}>
                      <Typography variant="subtitle2" component={Link} to={`/users/${comment.user._id}`} sx={{color: "primary.main", textDecoration: "none"}}>
                        {comment.user.first_name} {comment.user.last_name}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.date_time)}
                      </Typography>
                    </Box>

                    <Typography variant="body2">
                      {comment.comment}
                    </Typography>

                  </Paper>
                ))}
              </List>
            )}
          </CardContent>  
          
        </Card>
          
          <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
              <Alert onClose={() => setSnackbarOpen(false)}>{snackbarMessage}</Alert>
          </Snackbar>
      
      </Box>
    )
    
}

export default UserPhotos;
