import './App.css';

import React, { useEffect } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComment from './components/UserComment';

import { useState } from 'react';

const App = (props) => {
  const [advancedFeature, setAdvancedFeature] = useState(false);

  return (
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar advancedFeature={advancedFeature} setAdvancedFeature={setAdvancedFeature} />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route
                      path="/users/:userId"
                      element = {<UserDetail />}
                  />
                  <Route
                      path="/photos/:userId"
                      element = {<UserPhotos advancedFeature={advancedFeature} />}
                  />
                  <Route
                      path="/photos/:userId/:photoId"
                      element = {<UserPhotos advancedFeature={advancedFeature} setAdvancedFeature={setAdvancedFeature}/>}
                  />

                  <Route
                    path="comments/:userId"
                    element = {<UserComment />}
                  />

                  <Route path="/users" element={<UserList />} />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
  );
}

export default App;
