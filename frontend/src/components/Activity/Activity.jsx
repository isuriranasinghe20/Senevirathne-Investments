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

  //receipt printing function
  const handlePrintReceipt = (row) => {
  const receiptWindow = window.open("", "PRINT", "width=300,height=600");

  const customerTypeText =
    user.customerType === "INSTALLMENT"
      ? "Installment"
      : "Interest";

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
          }
          h2, h3, p {
            margin: 5px 0;
            text-align: center;
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
        <p><strong>Vehicle:</strong> ${user.vehicleNumber}</p>
        
        <p>
          <strong>Paid Amount:</strong> Rs.${row.paidAmount} <br />
          (${customerTypeText})
        </p>

        <p><strong>Paid Date:</strong> ${row.date.substring(0, 10)}</p>

        <div class="footer">
        <br /><br />
          ...................................................
          <br /><br />
          Thank you for your payment!<br />
          Call: 077-7860211
           <br/>
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

const [isClosed, setIsClosed] = useState(false); 

  // Fetch user details
  useEffect(() => {
  axios.get(`http://localhost:5000/users/${id}`)
    .then(res => {
      setUser(res.data.user);
      setStatus(res.data.user.status);  
      setIsClosed(res.data.user.isClosed || false);
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
          onChange={(e) => {
            const newStatus = e.target.value;
            setStatus(newStatus);

            // Immediately send to server
            axios
              .put(`http://localhost:5000/users/${id}`, { ...user, status: newStatus })
              .then(() => console.log("Status updated successfully"))
              .catch((err) => console.log(err));
          }}
        >
          <option value="Reliable">Reliable</option>
          <option value="Moderate">Moderate</option>
          <option value="High Risk">High Risk</option>
        </select>

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
                disabled={isClosed}
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
                disabled={isClosed}
              />
            </td>
            <td>
              <input
                type="number"
                value={a.paidAmount || 0}
                onChange={(e) =>
                  setActivities((prev) =>
                    prev.map((act) =>
                      act._id === a._id ? { ...act, paidAmount: e.target.value } : act
                    )
                  )
                }
                disabled={isClosed}
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
                disabled={isClosed}
              />
            </td>
            <td>
              <button
                onClick={() =>
                  axios.put(`http://localhost:5000/activity/${a._id}`, a)
                    .then(() => alert("Updated!"))
                }
                disabled={isClosed}
              >
                Update
              </button>
              <button
                onClick={() =>
                  axios.delete(`http://localhost:5000/activity/${a._id}`)
                    .then(() =>
                      setActivities((prev) => prev.filter((act) => act._id !== a._id))
                    )
                }
                disabled={isClosed}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
              <button
                onClick={() => handlePrintReceipt(a)}
                style={{ marginLeft: "10px" }}
              >
                Print Receipt
              </button>
            </td>
          </tr>

          

        ))}

        <tr>
          <td>
            <input
              type="number"
              name="no"
              value={form.no}
              onChange={handleChange}
              disabled={isClosed}
            />
          </td>
          <td>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              disabled={isClosed}
            />
          </td>
          <td>
            <input
              type="number"
              name="paidAmount"
              value={form.paidAmount}
              onChange={handleChange}
              disabled={isClosed}
            />
          </td>
          <td>
            <input
              type="checkbox"
              name="paid"
              checked={form.paid}
              onChange={handleChange}
              disabled={isClosed}
            /> Paid
          </td>
          <td>
            <button onClick={handleSave} disabled={isClosed}>
              Save
            </button>
          </td>
        </tr>

      </tbody>

      </table>

      <div style={{ marginTop: "20px" }}>
      <label>
  <input
    type="checkbox"
    checked={isClosed}
    onChange={(e) => {
      const value = e.target.checked;
      setIsClosed(value);

      // immediately send to server
      axios
        .put(`http://localhost:5000/users/${id}`, { ...user, isClosed: value })
        .then(() => alert("Status updated!"))
        .catch((err) => console.log(err));
    }}
  />
  Mark as Closed
</label>

       </div>



    </div>
  );
}

export default Activity;
