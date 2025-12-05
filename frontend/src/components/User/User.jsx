import React from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function User(props) {
  const { _id, indexNo, nic, name, phone, date, vehicleNumber, model, licenseDate, total, installment,period} = props.user;  

  const history = useNavigate();

  const deleteHandler = async () => {
    await axios.delete(`http://localhost:5000/users/${_id}`)
    .then(res => res.data)
    .then(() => history("/"))
    .then(() => history("/users"));
  }

  return (
    <div>
      <h1>User display</h1>
      <br></br>
      <h1>Index No.: {indexNo}</h1>
      <h1>NIC: {nic}</h1>
      <h1>Name: {name}</h1>
      <h1>Telephone No.: {phone}</h1>
      <h1>Date: {date}</h1>
      <h1>Vehicle No.: {vehicleNumber}</h1>
      <h1>Model: {model}</h1>
      <h1>License Expiry Date: {licenseDate}</h1>
      <h1>Total Amount: {total}</h1>
      <h1>Installment Amount: {installment}</h1>
      <h1>Period: {period}</h1>
  
      <Link to={`/users/${_id}`}><button>Edit</button></Link>
      <button onClick={deleteHandler}>Delete</button>
    </div>
  )
}

export default User
