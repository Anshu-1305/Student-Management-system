const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/syllabus', require('./routes/syllabus'));
// Pending signup users waiting for admin approval
const pendingUsers = new Map();

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Smart SMS Backend API',
    version: '2.0.0',
    status: 'running'
  });
});

// Signup endpoint - creates a pending user for admin approval
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, role = 'student', branch, section, regulation } = req.body;

    if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });

    // Enforce admin password length
    if (role === 'admin' && password.length < 15) {
      return res.status(400).json({ error: 'Admin password must be at least 15 characters' });
    }

    // Check existing in users or pending
    if (users.has(email) || pendingUsers.has(email)) {
      return res.status(400).json({ error: 'User already exists or pending' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const pending = {
      id: Date.now().toString(),
      name,
      email,
      password: hashed,
      role,
      branch,
      section,
      regulation,
      createdAt: new Date()
    };

    pendingUsers.set(email, pending);
    res.status(201).json({ message: 'Signup successful. Awaiting admin approval.' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Admin: list pending users
app.get('/api/pending-users', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  try {
    const list = Array.from(pendingUsers.values()).map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, branch: u.branch, section: u.section }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
});

// Admin: approve a pending user by email
app.post('/api/approve-user', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  try {
    const { email } = req.body;
    const pending = pendingUsers.get(email);
    if (!pending) return res.status(404).json({ error: 'Pending user not found' });

    // Activate user into users map
    users.set(email, { ...pending, isActive: true });
    pendingUsers.delete(email);

    res.json({ message: 'User approved and activated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve user' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});