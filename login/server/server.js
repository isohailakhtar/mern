// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/demo';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Connect to MongoDB (demo DB)
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected to', MONGO_URI))
  .catch(err=> console.error('MongoDB connect error', err));

// Define a User model mapped to existing 'users' collection.
// Adjust fields if your documents use different field names.
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  // add other fields your documents have (optional)
}, { collection: 'users' }); // IMPORTANT: keep collection name to use existing data

const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.json());
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ ok: false, error: 'Missing credentials' });

  try {
    // Plain-text check (matches existing plain-text storage)
    const user = await User.findOne({ username: username, password: password }).lean();
    if (!user) return res.status(401).json({ ok: false, error: 'Invalid credentials' });

    // Save session user minimal info
    req.session.user = { id: user._id.toString(), username: user.username };
    return res.json({ ok: true, user: req.session.user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// GET /api/session
app.get('/api/session', (req, res) => {
  if (req.session && req.session.user) return res.json({ ok: true, user: req.session.user });
  return res.json({ ok: true, user: null });
});

// POST /api/logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ ok: false, error: 'Logout failed' });
    res.clearCookie('connect.sid');
    return res.json({ ok: true });
  });
});

// Optional protected endpoint
app.get('/api/welcome', (req, res) => {
  if (req.session && req.session.user) return res.json({ ok: true, message: `Welcome ${req.session.user.username}` });
  return res.status(401).json({ ok: false, error: 'Not authenticated' });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
