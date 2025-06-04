import React from "react";
import {Typography, Card, CardContent, CardActions, Button, Avatar, Box, Divider, Chip} from "@mui/material";

import "./styles.css";
import {useParams, Link, useNavigate} from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import {useState, useEffect} from "react";
/**
 * Define UserDetail, a React component of Project 4.
 */


function UserDetail() {
	const [user, setUser] = useState({
		first_name: "",
		last_name: "",
		location: "",
		description: "",
		occupation: ""
	});
    const {userId} = useParams();
    const navigate = useNavigate();
    
	useEffect(() => {
		fetchModel(`/user/${userId}`)
			.then((data) => {
				setUser(data);
			})
			.catch((error) => {
				console.error("Error fetching user data:", error);
			});
	}, [userId])

    if (!user){
		return (
			<Card sx={{maxWidth: 600, mx: "auto", mt: 4}}>
				<Typography variant="h5" color="error">User not found</Typography>
				<Button variant="contained" onClick={() => navigate(-1)} sx={{mt: 2}}>Go Back</Button>
			</Card>
		)
    }

	const userInitials = `${user.first_name[0]}${user.last_name[0]}`;

    return (
		<div className="user-detail">
        <Card sx={{maxWidth: 600, mx: "auto", mt: 4}}>
			<CardContent>
				<Box sx={{display: "flex", alignItems: "center", mb: 3}}>
					<Avatar sx={{width: 80, height: 80, bgcolor: "primary.main", mr: 3}}>
						{userInitials}
					</Avatar>
					<Box>
						<Typography variant="h4" component="h1">
							{user.first_name} {user.last_name}
						</Typography>
						<Chip label={user.occupation} size="small" sx={{mt: 1}} />
					</Box>
				</Box>

				<Divider sx={{my:2}}/>

				<Box sx={{mb: 2}}>
					<Typography variant="subtitle1" color="text.secondary" gutterBottom>
						<strong>Location</strong>
					</Typography>
					<Typography variant="body1">{user.location}</Typography>
				</Box>

				<Box>
					<Typography variant="subtitle1" color="text.secondary" gutterBottom>
						<strong>Description</strong>
					</Typography>
					<Typography variant="body1">{user.description}</Typography>
				</Box>
			</CardContent>
			
			<Divider/>

			<CardActions sx={{p: 2, justifyContent: "flex-end"}}>
				<Button component={Link} to={`/photos/${userId}`} variant="outlined" color="primary">
					See Gallery
				</Button>
			</CardActions>
		</Card>
		</div>
    );
}

export default UserDetail;
