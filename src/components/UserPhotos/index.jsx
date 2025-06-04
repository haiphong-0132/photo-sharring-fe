import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Divider,
  Box,
  List,
  Paper,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { useState, useEffect } from "react";

/**
 * Define UserPhotos, a React component of Project 4.
 */

function UserPhotos() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchModel(`/user/${userId}`)
      .then((data) => {
        setUser(data);
        return fetchModel(`/photo/photosOfUser/${userId}`);
      })
      .then((data) => {
        setPhotos(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userId]);

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

  const formatDate = (s) => {
    return new Date(s).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                  image={`https://2qxzt2-8081.csb.app/images/${photo.file_name}`}
                  alt={`Photo by ${user.first_name} ${user.last_name}`}
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
                              to={`/users/${comment.user._id}`}
                              sx={{
                                color: "primary.main",
                                textDecoration: "none",
                              }}
                            >
                              {comment.user.first_name} {comment.user.last_name}
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

export default UserPhotos;
