import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


function ClosedUserDetails() {
  const { id } = useParams(); // get user id from route
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    axios
      .get(`http://localhost:5000/closed-users/${id}`)
      .then(res => setUser(res.data.user))
      .catch(err => console.log(err));
  }, [id]);

  if (!user) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate("/addUser", { state: { user } })}
        style={{ padding: "10px 20px", marginBottom: "20px" }}
      >
        Return Details
      </button>

      <h1>User Details</h1>
      <h2>Name: {user.name}</h2>
      <p>Index No: {user.indexNo}</p>
      <p>NIC: {user.nic}</p>
      <p>Phone: {user.phone}</p>
      <p>Date: {user.date}</p>
      <p>Vehicle No: {user.vehicleNumber}</p>
      <p>Model: {user.model}</p>
      <p>License Date: {user.licenseDate}</p>
      <p>Total Loan: Rs. {user.total}</p>
      <p>Installment: Rs. {user.installment}</p>
      <p>Period: {user.period}</p>
      <p>Customer Type: {user.customerType}</p>
      <p>Status: {user.status}</p>
      <p>Closed: {user.isClosed ? "Yes" : "No"}</p>

      <h3>Uploaded Files:</h3>
      <div>
        <h4>Customer NIC Documents:</h4>
        {user.customerNicDocs?.map((file, i) => (
          <p key={i}><a href={`http://localhost:5000/${file}`} target="_blank">{file.split("/").pop()}</a></p>
        ))}

        <h4>Guarantor NIC Documents:</h4>
        {user.guarantorNicDocs?.map((file, i) => (
          <p key={i}><a href={`http://localhost:5000/${file}`} target="_blank">{file.split("/").pop()}</a></p>
        ))}

        <h4>Vehicle Book Documents:</h4>
        {user.vehicleBookDocs?.map((file, i) => (
          <p key={i}><a href={`http://localhost:5000/${file}`} target="_blank">{file.split("/").pop()}</a></p>
        ))}

        <h4>Vehicle License Documents:</h4>
        {user.vehicleLicenseDocs?.map((file, i) => (
          <p key={i}><a href={`http://localhost:5000/${file}`} target="_blank">{file.split("/").pop()}</a></p>
        ))}
      </div>
    </div>
  );
}

export default ClosedUserDetails;
