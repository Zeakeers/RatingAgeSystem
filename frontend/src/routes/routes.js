import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainComponent from "../App";
import ListGames from "../pages/ListGame";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainComponent />} />
                <Route path="/list-games" element={<ListGames />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
