import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Card,
    CardContent,
    CardMedia,
    Divider,
    CircularProgress,
    Grid,
    Paper,
    Button
} from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';

const BE_URL = process.env.REACT_APP_BE_URL;

function UserComment(){
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComments = async () => {
            try{
                const userComments = await fetchModel(`/comment/${userId}`);
                if (userComments){
                    setComments(userComments);
                }
            } catch (err){
                console.error("Error fetching comments: ", err);
            }
        }

				const fetchUser = async () => {
					try{
						const userData = await fetchModel(`/user/${userId}`);
						if (userData){
							setUser(userData);
						}
					} catch(err){
						console.error("Error fetching user: ", err);
					}
				}

				fetchComments();
				fetchUser();

    }, [userId]);

		const formatDate = (s) => {
			return new Date(s).toLocaleString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
		}

		const handleClickPhoto = (userId, photoId) => {
			navigate(`/photos/${userId}/${photoId}`);
		}

		if (!user){
			return (
				<Box sx={{maxWidth: 800, mx: 'auto', mt: 4, p: 2}}>
					<Typography variant="h5" color="error">
						User not found
					</Typography>
					<Button variant="contained" onClick={() => navigate(-1)} sx={{mt: 2}}>
						Go Back
					</Button>
				</Box>
			);
		}

		return (
			<Box sx={{maxWidth: 800, mx: 'auto', mt: 4, p: 2}}>
				<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
					<Typography variant="h4" component="h1">
						{user.first_name} {user.last_name}'s Comments
					</Typography>
					<Button component={Link} to={`/users/${userId}`} variant="outlined" color="primary">
						Back to Profile
					</Button>
				</Box>

				<Divider sx={{mb: 3}} />

				{comments.length === 0 ? (
					<Typography variant="body1">
						This user hasn't made any comments yet.
					</Typography>): (
					
					<Grid container spacing={2}>
						{comments.map((comment) => (
							<Grid item xs={12} key={comment._id}>
								<Paper sx={{p: 2, overflow: 'hidden'}}>
									<Box sx={{display: "flex", minWidth: 0}}>
										<CardMedia
											component="img"
											image={`${BE_URL}/images/${comment.photo_file_name}`}
											alt="Photo thumbnail"
											sx={{width: 120, height: 120, objectFit: 'cover', cursor:'pointer', flexShrink: 0}}
											onClick={() => handleClickPhoto(comment.owner_id, comment.photo_id)}
										/>
										<CardContent sx={{flex: '1 1 auto', minWidth: 0, overflow:"hidden"}}>
											<Typography variant="body2" color="text.secondary" gutterBottom>
												Posted on {formatDate(comment.date_time)}
											</Typography>
											<Typography variant="body1" sx={{mb:1, wordWrap: 'break-word', wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto'}}>
												{comment.comment}
											</Typography>
											<Button size="small" color="primary" onClick={() => handleClickPhoto(comment.owner_id, comment.photo_id)}>
												View Photo
											</Button>
										</CardContent>
									</Box>
								</Paper>
							</Grid>
						))}
					</Grid>)}

			</Box>
		)
}

export default UserComment;