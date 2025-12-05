import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ClosedFiles() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/closed-users")
      .then(res => setUsers(res.data.users))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Closed Users</h1>

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
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.indexNo}</td>
              <td>{user.nic}</td>
              <td>{user.name}</td>
              <td>{user.vehicleNumber}</td>
              <td>{user.customerType}</td>
              <td>
                  <button onClick={() => navigate(`/closed-user/${user._id}`)}>
                    View More
                  </button>
                  <button onClick={() => navigate(`/closed-users/${user._id}/activity`)}>
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

export default ClosedFiles;
