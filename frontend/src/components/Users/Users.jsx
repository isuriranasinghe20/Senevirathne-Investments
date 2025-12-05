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

  const handlePrintReceipt = (user) => {
  const receiptWindow = window.open("", "PRINT", "width=300,height=600");

  const customerTypeText =
    user.customerType === "INSTALLMENT"
      ? "Installment Payer"
      : "Interest Payer";

  // Generate receipt timestamp
  const generatedDateTime = new Date().toLocaleString("en-LK", {
    timeZone: "Asia/Colombo",
  });

  receiptWindow.document.write(`
    <html>
      <head>
        <style>
          body { 
            font-family: Arial; 
            width: 58mm; 
            padding: 10px;
            font-size: 12px;
            align-items: center;
          }
          h2 ,h3, p {
            text-align: center;
            margin: 0;
            padding: 0;
          }
          .footer {
            margin-top: 15px;
            text-align: center;
            border-top: 1px dashed #000;
            padding-top: 10px;
            font-size: 11px;
          }
        </style>
      </head>

      <body>
        <h2><strong>Senevirathne Investments</strong></h2>
        <hr />

        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Vehicle No:</strong> ${user.vehicleNumber}</p>
        <p><strong>Loan received:</strong> Rs. ${user.total}</p>
        <p><strong>Received Date:</strong> ${new Date(user.date).toLocaleDateString()}</p>

        <div class="footer">
          <br />
          <p>Received By : ........................................</p>
          <br />
          <p>Paid By     : ................................................</p>
          <br />
          Thank you!<br/>
          Call: 077-7860211
          <br/><br/>
          <p style="font-size:10px;">Receipt Generated: ${generatedDateTime}</p>
        </div>
      </body>
    </html>
  `);

  receiptWindow.document.close();
  receiptWindow.focus();
  receiptWindow.print();
  receiptWindow.close();
};

  
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

      <button
        onClick={() => navigate("/closedFiles")}
        style={{ padding: "10px 20px" }}
      >
      Closed Files
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

                <button 
                  onClick={() => handlePrintReceipt(user)}
                   style={{ marginLeft: "10px" }}
                >
                  Print Receipt
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
