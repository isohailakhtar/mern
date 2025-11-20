import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Welcome from './pages/Welcome';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in, object = logged in

  useEffect(() => {
    // check session
    axios.get('/api/session')
      .then(res => setUser(res.data.user))
      .catch(err => {
        console.error(err);
        setUser(null);
      });
  }, []);

  if (user === undefined) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Welcome user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
