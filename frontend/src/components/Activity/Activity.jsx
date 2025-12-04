import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Activity() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/users/${id}`)
      .then(res => setUser(res.data.user))
      .catch(err => console.log(err));
  }, [id]);

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Activity</h1>
      <hr />

      <h2>Name: {user.name}</h2>
      <h3>Total Amount: {user.total}</h3>
      <h3>Installment Amount: {user.installment}</h3>
      <h3>Period: {user.period}</h3>
    </div>
  );
}

export default Activity;
