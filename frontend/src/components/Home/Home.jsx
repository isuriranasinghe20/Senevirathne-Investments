import React from 'react'
import Nav from '../Nav/Nav'
import { Link } from 'react-router-dom';

function Home() {

  return (
    
    <div>
      <h1>Welcome to Senevirathne Investments</h1>
      <div>
        <ul>
           <li className="home-li">
            <Link to="/regi" className="active home-a">
                <h1>Register</h1>
            </Link>
        </li>
         <li className="home-li">
            <Link to="/log" className="active home-a">
                <h1>Login</h1>
            </Link>
        </li>
        <li className="home-li">
            <Link to="/aboutus" className="active home-a">
                <h1>About Us</h1>
            </Link>
        </li>
        </ul>
      </div>
    </div>
  )
}

export default Home
