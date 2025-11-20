import React from 'react';
import axios from 'axios';

export default function Welcome({ user, setUser }) {
  const logout = async () => {
    await axios.post('/api/logout');
    setUser(null);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {user.username}!</h2>
        <button className="btn btn-outline-secondary" onClick={logout}>Logout</button>
      </div>

      <div className="card p-4">
        <h5>Dashboard / Welcome Page</h5>
        <p>This is the protected welcome page that only shows when the session exists.</p>
      </div>
    </div>
  );
}
