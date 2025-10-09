const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createMeetEvent, oauth2Client } = require('./googleAuth');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
const organizations = new Map();
const users = new Map();
const results = new Map();
const virtualClasses = new Map();

// Email transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'demo@gmail.com',
    pass: process.env.EMAIL_PASS || 'demo-password'
  }
});

// OAuth2 endpoints
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events']
  });
  res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens securely (in production, use database)
    res.json({ access_token: tokens.access_token, refresh_token: tokens.refresh_token });
  } catch (error) {
    res.status(500).json({ error: 'OAuth callback failed' });
  }
});

// Subdomain middleware
const subdomainMiddleware = (req, res, next) => {
  const host = req.get('host');
  const subdomain = host.split('.')[0];
  
  if (subdomain && subdomain !== 'localhost' && subdomain !== '127') {
    req.subdomain = subdomain;
    req.organization = organizations.get(subdomain);
  }
  
  next();
};

app.use(subdomainMiddleware);

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based access middleware
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

// Routes

// Organization registration
app.post('/api/organizations', async (req, res) => {
  try {
    const { name, adminName, adminEmail, adminPhone, type } = req.body;
    const subdomain = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (organizations.has(subdomain)) {
      return res.status(400).json({ error: 'Organization already exists' });
    }
    
    const orgId = Date.now().toString();
    const organization = {
      id: orgId,
      name,
      subdomain,
      type,
      plan: 'free',
      settings: {
        branding: { logo: '', primaryColor: '#22c55e' },
        features: { analytics: false, customBranding: false, extendedStorage: false }
      },
      createdAt: new Date()
    };
    
    organizations.set(subdomain, organization);
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = {
      id: Date.now().toString(),
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      role: 'admin',
      organizationId: orgId,
      password: hashedPassword
    };
    
    users.set(adminEmail, adminUser);
    
    res.status(201).json({ organization, subdomain: `${subdomain}.myapp.com` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create organization' });
  }
});

// Results management
app.get('/api/results', authMiddleware, (req, res) => {
  try {
    const userResults = Array.from(results.values()).filter(result => {
      if (req.user.role === 'student') {
        return result.studentId === req.user.id && result.organizationId === req.user.organizationId;
      }
      return result.organizationId === req.user.organizationId;
    });
    
    res.json(userResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

app.post('/api/results', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  try {
    const { studentId, subject, marks, totalMarks, examType, semester } = req.body;
    
    const resultId = Date.now().toString();
    const result = {
      id: resultId,
      studentId,
      subject,
      marks: parseInt(marks),
      totalMarks: parseInt(totalMarks),
      examType,
      semester,
      organizationId: req.user.organizationId,
      createdBy: req.user.id,
      createdAt: new Date()
    };
    
    // Calculate grade
    const percentage = (result.marks / result.totalMarks) * 100;
    if (percentage >= 90) result.grade = 'A+';
    else if (percentage >= 80) result.grade = 'A';
    else if (percentage >= 70) result.grade = 'B+';
    else if (percentage >= 60) result.grade = 'B';
    else result.grade = 'C';
    
    results.set(resultId, result);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create result' });
  }
});

// Plan management
app.post('/api/organizations/upgrade', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  try {
    const { plan } = req.body;
    const organization = req.organization;
    
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    
    organization.plan = plan;
    organization.settings.features = {
      analytics: plan !== 'free',
      customBranding: plan === 'premium',
      extendedStorage: plan !== 'free'
    };
    
    organizations.set(organization.subdomain, organization);
    res.json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upgrade plan' });
  }
});

// Virtual Classes
app.post('/api/virtual-classes', authMiddleware, roleMiddleware(['faculty', 'admin']), async (req, res) => {
  try {
    const { title, subject, date, time, duration, description, attendees } = req.body;
    
    // Create Google Meet event
    const meetData = await createMeetEvent(req.user.accessToken, {
      title, description, date, time, duration: parseInt(duration), attendees
    });
    
    const classData = {
      id: Date.now().toString(),
      title, subject, date, time, duration: parseInt(duration), description,
      meetLink: meetData.meetLink,
      eventId: meetData.eventId,
      organizationId: req.user.organizationId,
      createdBy: req.user.id,
      students: attendees?.length || 0,
      status: 'scheduled',
      createdAt: new Date()
    };
    
    virtualClasses.set(classData.id, classData);
    
    // Send notifications
    if (attendees?.length) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: attendees.join(','),
        subject: `Virtual Class: ${title}`,
        html: `
          <h3>${title}</h3>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Duration:</strong> ${duration} minutes</p>
          <p><strong>Join Link:</strong> <a href="${meetData.meetLink}">Click here to join</a></p>
          ${description ? `<p><strong>Description:</strong> ${description}</p>` : ''}
        `
      };
      
      await transporter.sendMail(mailOptions);
    }
    
    res.status(201).json(classData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to schedule class' });
  }
});

app.get('/api/virtual-classes', authMiddleware, (req, res) => {
  try {
    const userClasses = Array.from(virtualClasses.values()).filter(c => 
      c.organizationId === req.user.organizationId
    );
    res.json(userClasses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});