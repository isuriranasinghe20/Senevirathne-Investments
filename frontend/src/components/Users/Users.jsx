import React, { useEffect, useState } from 'react'
import axios from 'axios';
import User from '../User/User.jsx';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav/Nav.jsx';

const URL = "http://localhost:5000/users";

const fetchHandler = async () => {
    return await axios.get(URL).then((res) => res.data);
}

function Users() {

  const navigate = useNavigate();

  const [users, setUsers] = useState();  
  useEffect(() => {
  fetchHandler().then((data) => 
    setUsers(data.users));
  },[]);
  
  return (
     <div>
      <Nav />
      <h1>Users Page</h1>

      <button 
        onClick={() => navigate("/addUser")} 
        style={{ padding: "10px 20px", marginBottom: "20px" }}
      >
        Add User
      </button>

      <div> 
        {users && users.map((user, i) => ( 
          <div key={i}> <User user={user} /> 
          </div> 
        ))} 
      </div>
    </div>
  );
}

export default Users
