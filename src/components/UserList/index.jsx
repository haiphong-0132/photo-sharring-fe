import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
  Box,
  Chip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import { useState, useEffect } from "react";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */

function UserList () {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchModel("/user/list")
      .then((data) => {
        setUsers(data);
        const stats = {};
        data.forEach((user) => {
          stats[user._id] = {
            photoCount: 0,
            commentCount: 0,
          }
          fetchModel(`/comment/${user._id}`)
            .then((comments) => {
              stats[user._id].commentCount = comments.length;
            })
            
            .then(() => {
              return fetchModel(`/photo/photosOfUser/${user._id}`);
            })
            .then((photos) => {
              stats[user._id].photoCount = photos.length;
            })

            .then(() => {
              setUserStats((prevStats) => ({
                ...prevStats,
                [user._id]: stats[user._id],
              }));
            })
        })
      }).catch((error) => {
        console.error("Error fetching user data:", error);
      }
    );
  }, []);


  return (
    <div className="user-list">
      <Typography variant="h5" sx={{ mb: 2, mt: 2 }}>
        User List
      </Typography>
      <List component="nav">
        {users.map((item) => (
          <React.Fragment key={item._id}>
            <ListItem sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                {item.first_name[0] + item.last_name[0]}
              </Avatar>
              <ListItemText>
                <Link
                  to={`/users/${item._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {item.first_name} {item.last_name}
                </Link>
              </ListItemText>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={userStats[item._id]?.photoCount || 0}
                  color="success"
                  size="small"
                  component={Link}
                  to={`/photos/${item._id}`}
                  clickable
                />
                <Chip 
                  label={userStats[item._id]?.commentCount || 0}
                  color="error"
                  size="small"
                  component={Link}
                  to={`/comments/${item._id}`}
                  clickable
                />
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}


export default UserList;
