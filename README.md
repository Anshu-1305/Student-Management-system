# Smart Student Management System

A modern, responsive Student Management System built with React.js and Tailwind CSS.

## 🚀 Features

### Authentication & Role-Based Access
- **Login/Signup** with role selection (Admin, Faculty, Student)
- **JWT-ready authentication** (currently using mock authentication)
- **Protected routes** based on user roles

### Dashboard Pages
- **Admin Dashboard**: Manage students, faculty, view analytics
- **Faculty Dashboard**: Mark attendance, upload exam results
- **Student Dashboard**: View profile, attendance, results, notifications

### Core Modules
- **Student Management**: Add, edit, delete, view student details
- **Faculty Management**: Assign subjects, manage classes
- **Attendance Tracking**: Faculty can mark, students can view
- **Exam & Results**: Faculty uploads marks, students view report cards
- **Analytics**: Charts and graphs for attendance & performance
- **Notifications**: Reminders and announcements

### Modern UI Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Toggle between light and dark themes
- **Animated Components**: Smooth transitions and hover effects
- **Search & Filter**: In tables and data views
- **Interactive Charts**: Using Recharts library

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-student-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Demo Credentials

Use these credentials to test different roles:

- **Admin**: admin@demo.com (any password)
- **Faculty**: faculty@demo.com (any password)  
- **Student**: student@demo.com (any password)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout wrapper
│   ├── Navbar.jsx      # Top navigation bar
│   └── Sidebar.jsx     # Side navigation menu
├── pages/              # Page components
│   ├── Login.jsx       # Authentication page
│   ├── AdminDashboard.jsx
│   ├── FacultyDashboard.jsx
│   └── StudentDashboard.jsx
├── context/            # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── ThemeContext.jsx # Theme management
├── data/               # Mock data
│   └── mockData.js     # Sample data for development
├── utils/              # Utility functions
│   └── constants.js    # App constants
└── index.css          # Global styles
```

## 🎨 Key Features Implemented

### 1. Authentication System
- Role-based login with Admin, Faculty, and Student roles
- Protected routes that redirect based on user permissions
- Persistent login state using localStorage

### 2. Responsive Design
- Mobile-first design approach
- Collapsible sidebar for mobile devices
- Responsive grid layouts for different screen sizes

### 3. Dark Mode
- System-wide dark mode toggle
- Persistent theme preference
- Smooth transitions between themes

### 4. Interactive Dashboards
- **Admin**: Student management table with search/filter, analytics charts
- **Faculty**: Attendance marking interface, exam result upload
- **Student**: Personal profile, attendance overview, performance charts

### 5. Data Visualization
- Line charts for performance trends
- Bar charts for monthly statistics
- Pie charts for attendance overview
- Interactive tooltips and responsive design

### 6. Modern UI Components
- Animated cards with hover effects
- Loading states and transitions
- Icon-based navigation
- Status badges and indicators

## 🔄 Future Enhancements

- **Backend Integration**: Connect to REST APIs
- **Real-time Updates**: WebSocket integration for live data
- **File Upload**: Profile pictures and document management
- **Advanced Analytics**: More detailed reporting and insights
- **Mobile App**: React Native version
- **Email Notifications**: Automated email system
- **Calendar Integration**: Class schedules and events

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the amazing utility-first CSS framework
- **Recharts** for beautiful and responsive charts
- **Lucide React** for the comprehensive icon library
- **Vite** for the fast development experience