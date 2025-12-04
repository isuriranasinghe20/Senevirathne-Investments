import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AddUser() {
    const history = useNavigate();
    const [inputs,setInputs] = useState({
        indexNo:"",
        nic:"",
        name:"",
        phone:"",
        date:"",
        vehicleNumber:"",
        model:"",
        licenseDate:"",
        total:"",
        installment:"",
        period:""
    });

const handleChange = (e) => {
    setInputs((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => {
        alert("User Added Successfully");
        history("/users");
    }).catch(() => {
        alert("Unable to add user");
    
    });
};

const sendRequest = async () => {
    await axios
      .post("http://localhost:5000/users", {
        indexNo: String(inputs.indexNo),
        nic: String(inputs.nic),
        name: String(inputs.name),
        phone: String(inputs.phone),
        date: String(inputs.date),
        vehicleNumber: String(inputs.vehicleNumber),
        model: String(inputs.model),
        licenseDate: String(inputs.licenseDate),
        total: Number(inputs.total),
        installment: Number(inputs.installment),
        period: Number(inputs.period),
      })
      .then((res) => res.data);
}

  return (
    <div>
      <h1>Add User</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label>No </label>
        <input type="text" name="indexNo" onChange={handleChange} value={inputs.indexNo} required></input>
        <br />
        <label>NIC</label>
        <input type="text" name="nic" onChange={handleChange} value={inputs.nic} required></input>
        <br />
        <label>Name</label>
        <input type="text" name="name" onChange={handleChange} value={inputs.name} required></input>
        <br />
        <label>Telephone No.</label>
        <input type="text" name="phone" onChange={handleChange} value={inputs.phone} required></input>
        <br />
        <label>Date</label>
        <input type="date" name="date" onChange={handleChange} value={inputs.date} required></input>
        <br />
        <label>Vehicle No.</label>
        <input type="text" name="vehicleNumber" onChange={handleChange} value={inputs.vehicleNumber} required></input>
        <br />
        <label>Model</label>
        <input type="text" name="model" onChange={handleChange} value={inputs.model} required></input>
        <br />
        <label>License Date</label>
        <input type="date" name="licenseDate" onChange={handleChange} value={inputs.licenseDate} required></input>
        <br />
        <label>Total Amount</label>
        <input type="number" name="total" onChange={handleChange} value={inputs.total} required></input>
        <br />
        <label>Installment Amount</label>
        <input type="number" name="installment" onChange={handleChange} value={inputs.installment} required></input>
        <br />
        <label>Period</label>
        <input type="number" name="period" onChange={handleChange} value={inputs.period} required></input>
        <br />
        
        <button type="submit">Submit</button>  
        </form>
    </div>
  )
}

export default AddUser
