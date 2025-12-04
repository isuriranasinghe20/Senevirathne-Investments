import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
     const history = useNavigate();

    const [user,setUser] = useState({
        identifier: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({...prevUser, [name]:value}));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
            const response = await sendRequest();

            if(response.status === "ok"){
                alert("Login Successful");
                history("/users");
            } else {
                alert("Invalid Credentials");
            }
        } catch(err){
            alert("error"+err.message);
        }
    };

    const sendRequest = async () => {
        return await axios .post("http://localhost:5000/login", {
            identifier: user.identifier,
            password: user.password,
        }).then(res => res.data);
    }
  return (
    <div>
    <h1>User Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Username or Email</label>
        <input
          type="text"
          name="identifier"
          value={user.identifier}
          onChange={handleInputChange}
          required
        />
        <br />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleInputChange}
          required
        />
        <br />
        <button type="submit">Login</button>  
      </form>
      
    </div>
  )
}

export default Login
