import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../Nav/Nav.jsx';

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/users/${id}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log(err));
  }, [id]);

  const deleteHandler = async () => {
    await axios.delete(`http://localhost:5000/users/${id}`)
      .then(() => navigate("/users"));
  };

  const uploadFiles = async (e, type) => {
  const files = e.target.files;
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  await axios.post(
    `http://localhost:5000/users/${id}/upload/${type}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  window.location.reload();
  };

  const deleteFile = async (type, index) => {
  await axios.delete(
    `http://localhost:5000/users/${id}/delete-file/${type}/${index}`
  );
  window.location.reload();
};


  if (!user) return <h2>Loading...</h2>;

  return (
    <div>
      <Nav />
      <h1>User Details</h1>

      <h3>Index No.: {user.indexNo}</h3>
      <h3>NIC: {user.nic}</h3>
      <h3>Name: {user.name}</h3>
      <h3>Telephone No.: {user.phone}</h3>
      <h3>Date: {user.date}</h3>
      <h3>Vehicle No.: {user.vehicleNumber}</h3>
      <h3>Model: {user.model}</h3>
      <h3>License Expiry Date: {user.licenseDate}</h3>
      <h3>Total Amount: {user.total}</h3>
      <h3>Monthly Installment Amount: {user.installment}</h3>
      <h3>Period: {user.period}</h3>
      <h3>Customer Type: {user.customerType}</h3>

            {/* ----------------------------- CUSTOMER NIC ------------------------------ */}
      <h2>Customer NIC</h2>
      <input type="file" multiple onChange={(e) => uploadFiles(e, "customerNic")} />

      {user.customerNicDocs.map((file, index) => (
        <div key={index}>
          <img src={`http://localhost:5000/${file}`} width="120" />
          <br />
          <a href={`http://localhost:5000/${file}`} download>Download</a>
          <button onClick={() => deleteFile("customerNic", index)}>Delete</button>
        </div>
      ))}

      <hr />

      {/* ----------------------------- GUARANTOR NIC ------------------------------ */}
      <h2>Guarantor NIC</h2>
      <input type="file" multiple onChange={(e) => uploadFiles(e, "guarantorNic")} />

      {user.guarantorNicDocs.map((file, index) => (
        <div key={index}>
          <img src={`http://localhost:5000/${file}`} width="120" />
          <br />
          <a href={`http://localhost:5000/${file}`} download>Download</a>
          <button onClick={() => deleteFile("guarantorNic", index)}>Delete</button>
        </div>
      ))}

      <hr />

      {/* ----------------------------- VEHICLE BOOK ------------------------------ */}
      <h2>Vehicle Book</h2>
      <input type="file" multiple onChange={(e) => uploadFiles(e, "vehicleBook")} />

      {user.vehicleBookDocs.map((file, index) => (
        <div key={index}>
          <img src={`http://localhost:5000/${file}`} width="120" />
          <br />
          <a href={`http://localhost:5000/${file}`} download>Download</a>
          <button onClick={() => deleteFile("vehicleBook", index)}>Delete</button>
        </div>
      ))}

      <hr />

      {/* ----------------------------- VEHICLE LICENSE ------------------------------ */}
      <h2>Vehicle License</h2>
      <input type="file" multiple onChange={(e) => uploadFiles(e, "vehicleLicense")} />

      {user.vehicleLicenseDocs.map((file, index) => (
        <div key={index}>
          <img src={`http://localhost:5000/${file}`} width="120" />
          <br />
          <a href={`http://localhost:5000/${file}`} download>Download</a>
          <button onClick={() => deleteFile("vehicleLicense", index)}>Delete</button>
        </div>
      ))}



      <button onClick={() => navigate(`/users/${id}`)}>Edit</button>
      <button onClick={deleteHandler}>Delete</button>
    </div>
  );
}

export default UserDetails;
