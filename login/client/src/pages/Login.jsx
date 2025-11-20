import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', { username, password });
      if (res.data.ok) {
        setUser(res.data.user);
        navigate('/');
      } else {
        setErr(res.data.error || 'Login failed');
      }
    } catch (error) {
      setErr(error.response?.data?.error || 'Login error');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4" style={{ maxWidth: 420, width: '100%' }}>
        <h3 className="mb-3 text-center">Login</h3>
        {err && <div className="alert alert-danger">{err}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
          </div>
          <button className="btn btn-primary w-100">Login</button>
        </form>
        <div className="mt-3 text-muted small">Use the setup route to create a user (dev).</div>
      </div>
    </div>
  );
}
