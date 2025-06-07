import React from "react";
import {
  IconButton,
  Typography,
  Grid,
  Card,
  CardMedia,
  TextField,
  CardContent,
  Button,
  Divider,
  Box,
  List,
  Paper,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowBack, Share, Bookmark, ArrowForward } from "@mui/icons-material";
import "./styles.css";
import { useState, useEffect } from "react";
import fetchModel from "../../lib/fetchModelData";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

/**
 * Define UserPhotos, a React component of Project 4.
 */

const BE_URL = process.env.REACT_APP_BE_URL;

function UserPhotos({ advancedFeature, setAdvancedFeature }) {
  const { userId, photoId } = useParams();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState("outlined");
  const navigate = useNavigate();
  const location = useLocation();
  const [newComment, setNewComment] = useState(null);
  const [editedComment, setEditedComment] = useState({});
  const [isEdit, setIsEdit] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchModel(`/user/${userId}`);
        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error("Error fetching user: ", err);
      }

      try {
        const photoData = await fetchModel(`/photo/photosOfUser/${userId}`);
        if (photoData) {
          setPhotos(photoData);
          if (photoId) {
            const index = photoData.findIndex((photo) => photo._id === photoId);
            setAdvancedFeature(true);
            if (index !== -1) {
              setCurrentPhotoIndex(index);
              const newIsEdit = {};
              photoData[index].comments.forEach((c) => {
                newIsEdit[c._id] = false;
              });
              setIsEdit(newIsEdit);
            }
          } else if (advancedFeature) {
            const firstPhotoId = photoData[0]?._id;
            navigate(`/photos/${userId}/${firstPhotoId}`);
            setCurrentPhotoIndex(0);

            const newIsEdit = {};
            photoData[0].comments.forEach((c) => {
              newIsEdit[c._id] = false;
            });
            setIsEdit(newIsEdit);
          }
        } else if (advancedFeature && photoData.length > 0) {
          navigate(`/photos/${userId}/${photoData[0]._id}`, { replace: true });
        }
      } catch (err) {
        console.error("Error fetching photos: ", err);
      }
    };

    fetchData();
  }, [
    userId,
    photoId,
    currentPhotoIndex,
    setAdvancedFeature,
    advancedFeature,
    navigate,
  ]);

  if (!user) {
    return (
      <Typography variant="h5" color="error">
        User not found
      </Typography>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
        <Typography variant="h5" component="h1">
          {user.first_name} {user.last_name}'s Gallery
        </Typography>

        <Divider sx={{ my: 2 }}></Divider>
        <Typography variant="body1">No photos found for this user.</Typography>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            component={Link}
            to={`/users/${userId}`}
            variant="outlined"
            color="primary"
          >
            Back to Profile
          </Button>
        </Box>
      </Card>
    );
  }

  const handleClickEdit = (comment_id, commentText) => {
    setIsEdit((prev) => ({
      ...prev,
      [comment_id]: true,
    }));

    setEditedComment((prev) => ({
      ...prev,
      [comment_id]: commentText,
    }));
  };

  const handleClickConfirm = async (comment_id) => {
    try {
      const response = await fetch(
        BE_URL + "/api/comment/commentsOfPhoto/" + photoId,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            comment: editedComment[comment_id],
            comment_id: comment_id,
          }),
        }
      );

      if (!response.ok) {
        console.error("Can't comment");
      }

      setSnackbarMessage("Edit comment successfully");
      setSnackbarOpen(true);
      setIsEdit((prev) => ({
        ...prev,
        [comment_id]: false,
      }));
    } catch (err) {
      console.error("Failed: ", err);
    }
  };

  const handleClickPrevious = () => {
    if (currentPhotoIndex > 0) {
      const newIndex = currentPhotoIndex - 1;
      setCurrentPhotoIndex(newIndex);
      navigate(`/photos/${userId}/${photos[newIndex]._id}`);
    }
  };

  const handleClickNext = () => {
    if (currentPhotoIndex < photos.length - 1) {
      const newIndex = currentPhotoIndex + 1;
      setCurrentPhotoIndex(newIndex);
      navigate(`/photos/${userId}/${photos[newIndex]._id}`);
    }
  };

  const handleClickShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setSnackbarMessage("Photo URL copied to clipboard!");
        setSnackbarOpen(true);
      })
      .catch(() => {
        setSnackbarMessage("Failed to copy URL");
        setSnackbarOpen(true);
      });
  };

  const handleClickBookmark = () => {
    const currentUrl = window.location.href;
    const photoTitle = `Photo ${currentPhotoIndex + 1} of ${user.first_name} ${
      user.last_name
    }`;
    if (bookmarked === "outlined") {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setSnackbarMessage(`Bookmark ${photoTitle} successfully!`);
        setBookmarked("contained");
      });
    } else {
      setSnackbarMessage(`Cancel bookmark ${photoTitle} sucessfully!`);
      setBookmarked("outlined");
    }
    setSnackbarOpen(true);
  };

  const handleAddCommentClick = async () => {
    try {
      const response = await fetch(
        BE_URL + "/api/comment/commentsOfPhoto/" + photoId,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            comment: newComment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network not ok");
      }

      const data = await response.json();

      const updatedPhotos = [...photos];

      updatedPhotos[currentPhotoIndex] = {
        ...updatedPhotos[currentPhotoIndex],
        comments: [...updatedPhotos[currentPhotoIndex].comments, data.comment],
      };

      setPhotos(updatedPhotos);

      setNewComment("");
      setSnackbarMessage("Comment added successfully!");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error in server: ", err);
    }
  };

  const formatDate = (s) => {
    return new Date(s).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  if (!advancedFeature) {
    return (
      <div className="user-photos">
        <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, px: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" component="h1">
              {user.first_name} {user.last_name}'s Photos
            </Typography>
            <Button
              component={Link}
              to={`/users/${userId}`}
              variant="outlined"
              color="primary"
            >
              Back to Profile
            </Button>
          </Box>

          <Grid container spacing={2}>
            {photos.map((photo) => (
              <Grid item xs={12} sm={6} md={4} key={photo._id}>
                <Card>
                  <CardMedia
                    component="img"
                    image={`${BE_URL}/images/${photo.file_name}`}
                    alt={`Photo by ${user.first_name}`}
                    sx={{ width: "100%", height: "auto" }}
                  />
                  <CardContent>
                    <Typography variant="caption">
                      Posted on {formatDate(photo.date_time)}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                      Comments ({photo.comments ? photo.comments.length : 0})
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {photo.comments && photo.comments.length > 0 ? (
                      <List>
                        {photo.comments.map((comment) => (
                          <Paper key={comment._id} sx={{ mb: 2, p: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                component={Link}
                                to={`/users/${comment.user?._id}`}
                                sx={{
                                  color: "primary.main",
                                  textDecoration: "none",
                                }}
                              >
                                {comment.user?.first_name}{" "}
                                {comment.user?.last_name}
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
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
    );
  }

  const currentPhoto = photos[currentPhotoIndex];

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <IconButton
          onClick={handleClickPrevious}
          disabled={currentPhotoIndex === 0}
          size="large"
          title="Previous photo"
        >
          <ArrowBack />
        </IconButton>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6">
            Photo {currentPhotoIndex + 1} of {photos.length}
          </Typography>

          <Button
            startIcon={<Share />}
            onClick={handleClickShare}
            size="small"
            variant="outlined"
          >
            Share
          </Button>

          <Button
            startIcon={<Bookmark />}
            onClick={handleClickBookmark}
            size="small"
            variant={bookmarked}
          >
            Bookmark
          </Button>
        </Box>
        <IconButton
          onClick={handleClickNext}
          disabled={currentPhotoIndex === photos.length - 1}
          size="large"
          title="Next photo"
        >
          <ArrowForward />
        </IconButton>
      </Box>
      <Card>
        <CardMedia
          component="img"
          image={`${BE_URL}/images/${currentPhoto.file_name}`}
          alt="User photo"
          sx={{
            width: "100%",
            height: "auto",
            maxHeight: 600,
            objectFit: "contain",
          }}
        />
        <CardContent>
          <Typography variant="caption">
            Posted on {formatDate(currentPhoto.date_time)}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Comments ({currentPhoto.comments ? currentPhoto.comments.length : 0}
            )
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="comment"
                label="Add comment"
                onChange={(e) => {
                  setNewComment(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleAddCommentClick}
                disabled={!newComment || newComment.trim() === ""}
              >
                <AddIcon />
                Add comment
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {currentPhoto.comments && currentPhoto.comments.length > 0 && (
            <List>
              {currentPhoto.comments.map((comment) => (
                <Paper key={comment._id} sx={{ mb: 2, p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      component={Link}
                      to={`/users/${comment.user?._id}`}
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      {comment.user?.first_name} {comment.user?.last_name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {formatDate(comment.date_time)}
                    </Typography>
                  </Box>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10}>
                      {!isEdit[comment._id] ? (
                        <Typography variant="body2">
                          {comment.comment}
                        </Typography>
                      ) : (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="comment"
                          label="Edit comment"
                          value={editedComment[comment._id]}
                          onChange={(e) => {
                            setEditedComment((prev) => ({
                              ...prev,
                              [comment._id]: e.target.value,
                            }));
                          }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={2}>
                      {!isEdit[comment._id] ? (
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() =>
                            handleClickEdit(comment._id, comment.comment)
                          }
                        >
                          <EditIcon />
                          Edit
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleClickConfirm(comment._id)}
                        >
                          Confirm
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
}

export default UserPhotos;
