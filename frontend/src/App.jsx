import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home.jsx";
import AboutUs from "./components/AboutUs/AboutUs.jsx";
import Users from "./components/Users/Users.jsx";
import Nav from "./components/Nav/Nav.jsx";
import AddUser from "./components/AddUser/AddUser.jsx";
import UpdateUser from "./components/UpdateUser/UpdateUser.jsx";
import Register from "./components/Register/Register.jsx";
import Login from "./components/Login/Login.jsx";
import UserDetails from "./components/UserDetails/UserDetails.jsx";
import Activity from "./components/Activity/Activity.jsx";

function App() {
  return (
    <div>
      
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/mainhome" element={<Home />} />
          <Route path="/regi" element={<Register />} />
          <Route path="/log" element={<Login />} />
          <Route path="/users" element={<Users />} />
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/users/:id" element={<UpdateUser />} />
          <Route path="/user/:id" element={<UserDetails />} />
          <Route path="/activity/:id" element={<Activity />} />
          <Route path="/aboutus" element={<AboutUs />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
