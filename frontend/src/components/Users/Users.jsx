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

       {/* TABLE OF USERS */}
      <table border="1" cellPadding="10" style={{ width: "90%", margin: "auto" }}>
        <thead>
          <tr>
            <th>Index No</th>
            <th>NIC</th>
            <th>Name</th>
            <th>Vehicle No</th>
            <th>Customer Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users && users.map((user) => (
            <tr key={user._id}>
              <td>{user.indexNo}</td>
              <td>{user.nic}</td>
              <td>{user.name}</td>
              <td>{user.vehicleNumber}</td>
              <td>{user.customerType}</td>
              <td>
                <button onClick={() => navigate(`/user/${user._id}`)}>
                  View More
                </button>
                <button 
                  onClick={() => navigate(`/activity/${user._id}`)} 
                  style={{ marginLeft: "10px" }} >
                  Activity
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
}

export default Users
