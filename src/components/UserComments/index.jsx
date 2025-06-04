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

function UserComments(){
    const {userId} = useParams();
    const [user, setUser] = useState(null);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchModel(`/user/${userId}`)
            .then((data) => {
                setUser(data);
                return fetchModel(`/comment/${userId}`);
            })
            .then((comments) => {
                setComments(comments);
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
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

    const handlePhotoClick = (userId) => {
        navigate(`/photos/${userId}`);
    }

    if (!user) {
        return (
            <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
                <Typography variant="h5" color="error">
                    User not found
                </Typography>
                <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    {user.first_name} {user.last_name}'s Comments
                </Typography>
                <Button component={Link} to={`/users/${userId}`} variant="outlined" color="primary">
                    Back to Profile
                </Button>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {comments.length === 0 ? (
                <Typography variant="body1">
                    This user hasn't made any comments yet.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {comments.map((comment) => (
                        <Grid item xs={12} key={comment._id}>
                            <Paper sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex' }}>
                                    <CardMedia
                                        component="img"
                                        image={`http://localhost:8081/images/${comment.photo_file_name}`}
                                        alt="Photo thumbnail"
                                        sx={{ width: 120, height: 120, objectFit: 'cover', cursor: 'pointer' }}
                                        onClick={() => handlePhotoClick(comment.owner_id)}
                                    />
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Posted on {formatDate(comment.date_time)}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            {comment.comment}
                                        </Typography>
                                        <Button 
                                            size="small" 
                                            color="primary"
                                            onClick={() => handlePhotoClick(comment.owner_id)}
                                        >
                                            View Photo
                                        </Button>
                                    </CardContent>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
export default UserComments;