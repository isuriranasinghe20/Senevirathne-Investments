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


      <button onClick={() => navigate(`/users/${id}`)}>Edit</button>
      <button onClick={deleteHandler}>Delete</button>
    </div>
  );
}

export default UserDetails;
