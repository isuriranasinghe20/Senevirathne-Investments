import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home.jsx";
import Customer from "./components/Customer/Customer.jsx";
import AboutUs from "./components/AboutUs/AboutUs.jsx";

function App() {
  return (
    <div>
      <Home />
      <React.Fragment>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/mainhome" element={<Home />} /> */}
          <Route path="/customerdetails" element={<Customer />} />
          <Route path="/aboutus" element={<AboutUs />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
