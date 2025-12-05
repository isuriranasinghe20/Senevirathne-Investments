import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ClosedActivity() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/closed-users/${id}`)
      .then(res => setUser(res.data))
      .catch(err => console.log(err));

    axios.get(`http://localhost:5000/closed-activity/${id}`)
      .then(res => setActivities(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!user) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Closed User Activity</h1>
      <hr />

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>No</th>
            <th>Date</th>
            <th>Paid Amount</th>
            <th>Paid</th>
          </tr>
        </thead>

        <tbody>
          {activities.map(a => (
            <tr key={a._id}>
              <td>{a.no}</td>
              <td>{new Date(a.date).toLocaleDateString("en-CA")}</td>
              <td>{a.paidAmount}</td>
              <td>{a.paid ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClosedActivity;
