import React, { useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function UpdateUser() {

    const [inputs, setInputs] = React.useState({
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
    const history = useNavigate();
    const id = useParams().id;

    useEffect(() => {
        const fetchHandler = async () => {
            await axios.get(`http://localhost:5000/users/${id}`)
            .then(res => res.data)
            .then(data => setInputs(data.user));
        }
        fetchHandler();
    
    }, [id]);

    const sendRequest = async () => {
        await axios.put(`http://localhost:5000/users/${id}`, {
            indexNo: String(inputs.indexNo),
            nic: String(inputs.nic),
            name: String(inputs.name),
            phone: String(inputs.phone),
            date: new Date(inputs.date),
            vehicleNumber: String(inputs.vehicleNumber),
            model: String(inputs.model),
            licenseDate: new Date(inputs.licenseDate),
            total: Number(inputs.total),
            installment: Number(inputs.installment),
            period: Number(inputs.period),
        }).then(res => res.data);
    }

    const handleChange = (e) => {
    setInputs((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs);
        sendRequest().then(() => 
        history("/users"));
    };


  return (
    <div>
      <h1>Update User</h1>
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
        <label>Phone</label>
        <input type="text" name="phone" onChange={handleChange} value={inputs.phone} required></input>
        <br />
        <label>Date</label>
        <input type="date" name="date" onChange={handleChange} value={inputs.date ? inputs.date.substring(0,10) : ""} required></input>
        <br />
        <label>Vehicle Number</label>
        <input type="text" name="vehicleNumber" onChange={handleChange} value={inputs.vehicleNumber} required></input>
        <br />
        <label>Model</label>
        <input type="text" name="model" onChange={handleChange} value={inputs.model} required></input>
        <br />
        <label>License Date</label>
        <input type="date" name="licenseDate" onChange={handleChange} value={inputs.licenseDate ? inputs.licenseDate.substring(0,10) : ""} required></input>
        <br />
        <label>Total</label>
        <input type="number" name="total" onChange={handleChange} value={inputs.total} required></input>
        <br />
        <label>Installment</label>
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

export default UpdateUser
