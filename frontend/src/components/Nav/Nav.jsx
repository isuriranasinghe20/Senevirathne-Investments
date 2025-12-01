import React from 'react'
import './nav.css';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <div>
      <ul className="home-ul">
        <li className="home-li">
            <Link to="/mainhome" className="active home-a">
                <h1>Home</h1>
            </Link>
        </li>
        <li className="home-li">
            <Link to="/customerdetails" className="active home-a">
                <h1>Customer Details</h1>
            </Link>
        </li>
        <li className="home-li">
            <Link to="/aboutus" className="active home-a">
                <h1>About Us</h1>
            </Link>
        </li>
      </ul>
    </div>
  )
}

export default Nav
