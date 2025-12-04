import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Activity() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("Moderate");


  // New states for activity records
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    no: "",
    date: "",
    paidAmount: "",
    paid: false,
    
  });

  const totalPaidAmount = activities.reduce((sum, a) => {
  return sum + (Number(a.paidAmount) || 0);
  }, 0);


  // Fetch user details
  useEffect(() => {
  axios.get(`http://localhost:5000/users/${id}`)
    .then(res => {
      setUser(res.data.user);
      setStatus(res.data.user.status);  // <-- set initial status
    })
    .catch(err => console.log(err));
}, [id]);


  // Fetch user's activity records
  useEffect(() => {
    axios
      .get(`http://localhost:5000/activity/${id}`)
      .then((res) => setActivities(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  // Handle input changes for new row
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  // Save new activity row
  function handleSave() {
    axios
      .post("http://localhost:5000/activity", {
        userId: id,
        no: form.no,
        date: form.date,
        paid: form.paid,
      })
      .then((res) => {
        setActivities([...activities, res.data]); // Add to table
        setForm({ no: "", date: "", paid: false }); // Clear inputs
      })
      .catch((err) => console.log(err));
  }

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Activity</h1>
      <hr />

      {/* User main details */}
      <h2>Name: {user.name}</h2>
      <h3>Total Amount: {user.total}</h3>
      <h3>Installment Amount: {user.installment}</h3>
      <h3>Period: {user.period}</h3>
      <h3 style={{ marginTop: "15px" }}>Total Paid Amount: Rs {totalPaidAmount}</h3>
      <div style={{ marginBottom: "20px" }}>
       <label>Status: </label>
         <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            >
            <option value="Reliable">Reliable</option>
            <option value="Moderate">Moderate</option>
            <option value="High Risk">High Risk</option>
         </select>
         <button
             style={{ marginLeft: "10px" }}
              onClick={() =>
          axios.put(`http://localhost:5000/users/${id}`, { ...user, status })
          .then(() => alert("Status updated"))
        }
         >
         Save Status
        </button>
      </div>


      <br /><hr /><br />

      {/* Activity Table */}
      <h2>Payment History</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>No</th>
            <th>Date</th>
            <th>Paid Amount (Rs)</th>
            <th>Paid</th>
          </tr>
        </thead>

        <tbody>
  {activities.map((a, i) => (
    <tr key={i}>
      <td>
        <input
          type="number"
          value={a.no}
          onChange={(e) =>
            setActivities((prev) =>
              prev.map((act) =>
                act._id === a._id ? { ...act, no: e.target.value } : act
              )
            )
          }
        />
      </td>

      <td>
        <input
          type="date"
          value={a.date ? a.date.substring(0, 10) : ""}
          onChange={(e) =>
            setActivities((prev) =>
              prev.map((act) =>
                act._id === a._id ? { ...act, date: e.target.value } : act
              )
            )
          }
        />
      </td>

      <td>
      <input
        type="number"
        value={a.paidAmount || 0}
        onChange={(e) =>
          setActivities(prev =>
            prev.map(act => act._id === a._id ? { ...act, paidAmount: e.target.value } : act)
          )
        }
      />
    </td>

      <td>
        <input
          type="checkbox"
          checked={a.paid}
          onChange={(e) =>
            setActivities((prev) =>
              prev.map((act) =>
                act._id === a._id ? { ...act, paid: e.target.checked } : act
              )
            )
          }
        />
      </td>

      <td>
        <button
          onClick={() =>
            axios
              .put(`http://localhost:5000/activity/${a._id}`, a)
              .then(() => alert("Updated!"))
          }
        >
          Update
        </button>

        <button
          onClick={() =>
            axios
              .delete(`http://localhost:5000/activity/${a._id}`)
              .then(() =>
                setActivities((prev) =>
                  prev.filter((act) => act._id !== a._id)
                )
              )
          }
          style={{ marginLeft: "10px" }}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}

 
  <tr>
    <td>
      <input type="number" name="no" value={form.no} onChange={handleChange} />
    </td>
    <td>
      <input type="date" name="date" value={form.date} onChange={handleChange} />
    </td>
    <td>
    <input type="number" name="paidAmount" value={form.paidAmount} onChange={handleChange} />
  </td>
    <td>
      <input type="checkbox" name="paid" checked={form.paid} onChange={handleChange} /> Paid
    </td>
    <td>
      <button onClick={handleSave}>Save</button>
    </td>
  </tr>
</tbody>

      </table>


    </div>
  );
}

export default Activity;
