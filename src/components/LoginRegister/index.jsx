import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Tab,
    Tabs,
    Alert,
    Stack,
    Snackbar
} from "@mui/material";



import { useForm } from "react-hook-form";
import { responsiveProperty } from "@mui/material/styles/cssUtils";

const BE_URL = process.env.REACT_APP_BE_URL;

export default function LoginRegister({setUserLoggedIn}){
    const [tabValue, setTabValue] = useState(0);
    const [error, setError] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(0);

    const navigate = useNavigate();

    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: {errors: loginErrors}
    } = useForm();

    const {
        register: registerSignup,
        handleSubmit: handleSignupSubmit,
        formState: {errors: signupErrors}
    } = useForm();

    const handleTabChange = (e, newVal) => {
        setTabValue(newVal);
        setError("");
    };

    const onLoginSubmit = async (data) => {
        setError("");
        try {
            const response = await fetch(`${BE_URL}/admin/login`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                
            });

            const result = await response.json();

            if (!response.ok){
                throw new Error(result.message || "Login failed");
            }

            sessionStorage.setItem("token", result.token);
            
            setUserLoggedIn(result.user);

            setSnackbarMessage("Login successful");
            setSnackbarOpen(true);

            navigate("/users");

        } catch (err) {
            setError(err.message || "Login failed. Try again");
        }
    };

    const onSignupSubmit = async (data) => {
        setError("");
        try {
            if (data.password !== data.confirmPassword){
                throw new Error ("Passwords do not match");
            }

            const response = await fetch(`${BE_URL}/user`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    login_name: data.login_name,
                    password: data.password,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    location: data.location,
                    description: data.description,
                    occupation: data.occupation
                })
            });
            
            const result = await response.json();

            if (!response.ok){
                throw new Error(result.message || "Registration failed");
            }
            

            setSnackbarMessage("Registration successful. Please log in");
            setSnackbarOpen(true);


        } catch(err){
            setError(err.message || "Register failed");
        }
    }

    return (
        <>
        <Box maxWidth="sm">
            <Paper elevation={3} sx={{mt: 8, p: 4}}>
                <Typography variant="h4" align="center" gutterBottom>
                    Photo Sharing App
                </Typography>

                <Tabs value={tabValue} onChange={handleTabChange} centered sx={{mb: 3}}>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                {error && (
                    <Alert severity="error" sx={{mb: 2}}>
                        {error}
                    </Alert>
                )}

                {tabValue === 0 && (
                    <Box component="form" onSubmit={handleLoginSubmit(onLoginSubmit)} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="login_name"
                            label="Login name"
                            {...registerLogin("login_name", {
                                required: "Login name is required",
                            })}
                            error={!!loginErrors.login_name}
                            helperText={!!loginErrors.login_name?.message}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="password"
                            type="password"
                            {...registerLogin("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                            error={!!loginErrors.password}
                            helperText={!!loginErrors.password?.message}
                        />

                        <Button type="submit" fullWidth variant="outlined" sx={{mt: 3, mb: 2}}>
                            Sign In
                        </Button>
                    </Box>             
                )}
                
                {tabValue === 1 && (
                    <Box component="form" onSubmit={handleSignupSubmit(onSignupSubmit)} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="login_name"
                            label="Login name"
                            {...registerSignup("login_name", {
                                required: "Login name is required",
                            })}
                            error={!!signupErrors.login_name}
                            helperText={!!signupErrors.login_name?.message}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="password"
                            type="password"
                            {...registerSignup("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                            error={!!signupErrors.password}
                            helperText={!!signupErrors.password?.message}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="confirm_password"
                            label="Confirm password"
                            type="password"
                            {...registerSignup("confirm_password", {
                                required: "Please confirm your password",
                                validate: (value, formValues) => {
                                    return value === formValues.password || "Passwords don't match"
                                }
                            })}
                            error={!!signupErrors.confirm_password}
                            helperText={!!signupErrors.confirm_password?.message}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="first_name"
                            label="First name"
                            {...registerSignup("first_name", {
                                required: "First name is required"
                            })}
                            error={!!signupErrors.first_name}
                            helperText={!!signupErrors.first_name?.message}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="last_name"
                            label="Last name"
                            {...registerSignup("last_name", {
                                required: "Last name is required"
                            })}
                            error={!!signupErrors.last_name}
                            helperText={!!signupErrors.last_name?.message}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="location"
                            label="Location"
                            {...registerSignup("location")}
                            error={!!signupErrors.location}
                            helperText={!!signupErrors.location?.message}
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            id="description"
                            label="Description"
                            {...registerSignup("description")}
                            error={!!signupErrors.description}
                            helperText={!!signupErrors.description?.message}
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            id="occupation"
                            label="Occupation"
                            {...registerSignup("occupation")}
                            error={!!signupErrors.occupation}
                            helperText={!!signupErrors.occupation?.message}
                        />
                        <Button type="submit" fullWidth variant="outlined" sx={{mt: 3, mb: 2}}>
                            Register
                        </Button>
                    </Box>
                )}

            </Paper>
        </Box>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
        />
        </>

        
    )
}
