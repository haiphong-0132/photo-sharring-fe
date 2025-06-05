import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar, Box, Chip, Badge,
  IconButton
} from "@mui/material";

import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import "./styles.css";

import fetchModel from "../../lib/fetchModelData";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList () {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const [userStats, setUserStats] = useState({
      numComments: 0,
      numPhotos: 0
    });

    useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchModel(`/user/list`);
        if (data) {
          setUsers(data);

          for (const user of data) {
            const stats = {
              numPhotos: 0,
              numComments: 0
            };

            try {
              const comments = await fetchModel(`/comment/${user._id}`);
              if (comments) {
                stats.numComments = comments.length;
              }
            } catch (err) {
              console.error(`Error fetching comments for user ${user._id}:`, err);
            }

            try {
              const photos = await fetchModel(`/photo/photosOfUser/${user._id}`);
              if (photos) {
                stats.numPhotos = photos.length;
              }
            } catch (err) {
              console.error(`Error fetching photos for user ${user._id}:`, err);
            }

            setUserStats((prevStats) => ({
              ...prevStats,
              [user._id]: stats
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching user list: ", err);
      }
    };

    fetchData();
  }, []);


    return (
      <div className="user-list">
        <Typography variant="h5" sx={{mb: 2, mt: 2}}>
          Users List
        </Typography>
        <List component="nav">
          {users.map((item) => (
            <React.Fragment key={item._id}>
              <ListItem sx={{display: "flex", alignItems: "center"}}>
                <Avatar sx={{bgcolor: "primary.main", mr: 2}}>
                  {item.first_name[0] + item.last_name[0]}
                </Avatar>
                <ListItemText>
                  <Link to={`/users/${item._id}`} style={{textDecoration: "none", color: "inherit"}}>
                    {item.first_name} {item.last_name}
                  </Link>
                </ListItemText>
                <Box sx={{display: "flex", gap: 1}}>
                  <Badge badgeContent={userStats[item._id]?.numPhotos || 0} color="success">
                    <IconButton
                      color="default"
                      size="small"
                      component={Link}
                      to={`/photos/${item._id}`}
                      clickable="true"
                    >
                      <PhotoOutlinedIcon />
                    </IconButton>
                  </Badge>

                  <Badge badgeContent={userStats[item._id]?.numComments || 0} color="error">
                    <IconButton
                      color="default"
                      size="small"
                      component={Link}
                      to={`/comments/${item._id}`}
                      clickable="true"
                    >
                      <CommentOutlinedIcon />
                    </IconButton>
                  </Badge>
                </Box>
              </ListItem>
              <Divider/>
            </React.Fragment>
          ))}
        </List>
      </div>
    );
}

export default UserList;
