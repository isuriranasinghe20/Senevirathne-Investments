import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
    const history = useNavigate();
    const [user,setUser] = useState({
        username:"",
        email:"",
        password:""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({...prevUser, [name]:value}));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        
        sendRequest().then(() => {
            alert("Registered Successfully");
            history("/log");
        }).catch((err) => {
            alert(err.message);
        })
    };

    const sendRequest = async () => {
        await axios .post("http://localhost:5000/auth/register", {
            username: String(user.username),
            email: String(user.email),
            password: String(user.password)
        }).then(res => res.data);
    }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input type="text" value={user.username} onChange={handleInputChange} name="username" required></input>
        <br />
        <label>Email</label>
        <input type="email" value={user.email} onChange={handleInputChange} name="email" required></input>
        <br />
        <label>Password</label>
        <input type="password" value={user.password} onChange={handleInputChange} name="password" required></input>
        <br />
        <button type="submit">Register</button>  
      </form>
    </div>
  )
}

export default Register
