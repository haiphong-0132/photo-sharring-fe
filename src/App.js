import './App.css';

import React, { useEffect } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComment from './components/UserComment';
import LoginRegister from './components/LoginRegister';
import ProtectedRoute from './components/ProtectedRoute';

import { useState } from 'react';

const App = (props) => {

  const current_user = sessionStorage.getItem("user");

  const [userLoggedIn, setUserLoggedIn] = useState(current_user);
  const [advancedFeature, setAdvancedFeature] = useState(false);

  return (
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar 
                advancedFeature={advancedFeature} 
                setAdvancedFeature={setAdvancedFeature} 
                userLoggedIn={userLoggedIn} 
                setUserLoggedIn={setUserLoggedIn} />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <ProtectedRoute  userLoggedIn={userLoggedIn}>
                  <UserList />
                </ProtectedRoute>
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route
                    path="/login"
                    element={<LoginRegister setUserLoggedIn={setUserLoggedIn} />}
                  />
                  <Route
                      path="/users/:userId"
                      element = {<ProtectedRoute userLoggedIn={userLoggedIn}><UserDetail /></ProtectedRoute>}
                  />
                  <Route
                      path="/photos/:userId"
                      element = {<ProtectedRoute userLoggedIn={userLoggedIn}><UserPhotos advancedFeature={advancedFeature} /></ProtectedRoute>}
                  />
                  <Route
                      path="/photos/:userId/:photoId"
                      element = {<ProtectedRoute userLoggedIn={userLoggedIn}><UserPhotos advancedFeature={advancedFeature} setAdvancedFeature={setAdvancedFeature}/></ProtectedRoute>}
                  />

                  <Route
                    path="comments/:userId"
                    element = {<ProtectedRoute userLoggedIn={userLoggedIn}><UserComment /></ProtectedRoute>}
                  />

                  <Route path="/users" element={<ProtectedRoute userLoggedIn={userLoggedIn}><UserList /></ProtectedRoute>} />
                  <Route path="/" element={userLoggedIn ? <Navigate to="/users"/> : <Navigate to ="/login"/> }  />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
  );
}

export default App;
