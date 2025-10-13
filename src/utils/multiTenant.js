// Multi-tenant utility functions for institute isolation

export const getTenantFromSubdomain = () => {
  const hostname = window.location.hostname;
  
  // Extract subdomain from hostname
  if (hostname.includes('collegeportal.in')) {
    const subdomain = hostname.split('.')[0];
    return subdomain !== 'www' ? subdomain : null;
  }
  
  // For development/localhost
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('tenant') || 'demo';
};

export const getCurrentTenant = () => {
  return localStorage.getItem('currentTenant') || getTenantFromSubdomain();
};

export const setCurrentTenant = (tenantId) => {
  localStorage.setItem('currentTenant', tenantId);
};

// Institute database with tenant isolation
export const instituteDatabase = {
  'pallavieng': {
    id: 'pallavieng',
    name: 'Pallavi Engineering College',
    code: 'PEC2024',
    subdomain: 'pallavieng.collegeportal.in',
    admin: {
      name: 'Dr. Rajesh Kumar',
      email: 'admin@pallavi.edu.in',
      password: 'pallavi@2024',
      designation: 'Principal'
    },
    config: {
      theme: 'green',
      logo: 'PEC',
      departments: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'],
      academicYear: '2024-25',
      established: '2001',
      affiliation: 'JNTUH',
      accreditation: 'NAAC A Grade'
    },
    branding: {
      logo: null,
      banner: null,
      primaryColor: '#10B981',
      secondaryColor: '#059669',
      accentColor: '#3B82F6',
      tagline: 'Excellence in Engineering Education',
      footerText: '© 2024 Pallavi Engineering College. All rights reserved.'
    },
    permissions: {
      admin: ['manage_users', 'manage_departments', 'manage_data', 'customize_branding', 'view_analytics'],
      faculty: ['upload_marks', 'manage_schedules', 'upload_materials', 'communicate_students', 'mark_attendance'],
      student: ['view_timetable', 'view_exams', 'view_results', 'view_attendance', 'view_notifications'],
      parent: ['view_student_progress', 'view_fee_dues', 'view_attendance', 'view_notifications']
    },
    users: [],
    timetables: [],
    notifications: [],
    registeredDate: '2024-01-15T00:00:00.000Z',
    status: 'active'
  },
  'sreyas': {
    id: 'sreyas',
    name: 'Sreyas Institute of Engineering & Technology',
    code: 'SIET2024',
    subdomain: 'sreyas.collegeportal.in',
    admin: {
      name: 'Prof. Sunitha Reddy',
      email: 'admin@sreyas.edu.in',
      password: 'sreyas@2024',
      designation: 'Director'
    },
    config: {
      theme: 'purple',
      logo: 'SIET',
      departments: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'],
      academicYear: '2024-25',
      established: '2008',
      affiliation: 'JNTUH',
      accreditation: 'NAAC B+ Grade'
    },
    branding: {
      logo: null,
      banner: null,
      primaryColor: '#8B5CF6',
      secondaryColor: '#7C3AED',
      accentColor: '#F59E0B',
      tagline: 'Innovation Through Technology',
      footerText: '© 2024 Sreyas Institute of Engineering & Technology. All rights reserved.'
    },
    permissions: {
      admin: ['manage_users', 'manage_departments', 'manage_data', 'customize_branding', 'view_analytics'],
      faculty: ['upload_marks', 'manage_schedules', 'upload_materials', 'communicate_students', 'mark_attendance'],
      student: ['view_timetable', 'view_exams', 'view_results', 'view_attendance', 'view_notifications'],
      parent: ['view_student_progress', 'view_fee_dues', 'view_attendance', 'view_notifications']
    },
    users: [],
    timetables: [],
    notifications: [],
    registeredDate: '2024-02-10T00:00:00.000Z',
    status: 'active'
  }
};

// Get current institute data based on tenant
export const getCurrentInstituteData = () => {
  const tenantId = getCurrentTenant();
  return instituteDatabase[tenantId] || null;
};

// Get institute data by ID
export const getInstituteData = (tenantId) => {
  return instituteDatabase[tenantId] || null;
};

// Tenant-specific data operations
export const getTenantData = (tenantId, dataType) => {
  const institute = instituteDatabase[tenantId];
  if (!institute) return null;
  
  return institute[dataType] || [];
};

export const setTenantData = (tenantId, dataType, data) => {
  if (!instituteDatabase[tenantId]) return false;
  
  instituteDatabase[tenantId][dataType] = data;
  return true;
};

// Authentication with tenant isolation
export const authenticateUser = (email, password, tenantId) => {
  const institute = instituteDatabase[tenantId];
  if (!institute) return null;
  
  // Check admin credentials
  if (institute.admin.email === email && institute.admin.password === password) {
    return {
      ...institute.admin,
      role: 'admin',
      tenantId: tenantId,
      institute: institute.name
    };
  }
  
  // Check other users in the institute
  const user = institute.users.find(u => u.email === email && u.password === password);
  if (user) {
    return {
      ...user,
      tenantId: tenantId,
      institute: institute.name
    };
  }
  
  return null;
};

// Register new institute
export const registerInstitute = (instituteData) => {
  const tenantId = instituteData.subdomain.split('.')[0];
  
  instituteDatabase[tenantId] = {
    id: tenantId,
    name: instituteData.instituteName,
    code: instituteData.instituteCode,
    subdomain: instituteData.subdomain,
    admin: {
      name: instituteData.adminName,
      email: instituteData.adminEmail,
      password: instituteData.adminPassword,
      designation: 'Administrator'
    },
    config: {
      theme: 'blue',
      logo: instituteData.instituteCode,
      departments: [],
      academicYear: '2024-25',
      established: instituteData.establishedYear,
      affiliation: instituteData.affiliatedTo,
      accreditation: instituteData.accreditation,
      address: instituteData.address,
      city: instituteData.city,
      state: instituteData.state,
      pincode: instituteData.pincode
    },
    branding: {
      logo: null,
      banner: null,
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#10B981',
      tagline: 'Excellence in Education',
      footerText: `© 2024 ${instituteData.instituteName}. All rights reserved.`
    },
    permissions: {
      admin: ['manage_users', 'manage_departments', 'manage_data', 'customize_branding', 'view_analytics'],
      faculty: ['upload_marks', 'manage_schedules', 'upload_materials', 'communicate_students', 'mark_attendance'],
      student: ['view_timetable', 'view_exams', 'view_results', 'view_attendance', 'view_notifications'],
      parent: ['view_student_progress', 'view_fee_dues', 'view_attendance', 'view_notifications']
    },
    users: [],
    timetables: [],
    notifications: [],
    registeredDate: new Date().toISOString(),
    status: 'active'
  };
  
  return tenantId;
};

// Data isolation middleware
export const ensureDataIsolation = (operation, tenantId) => {
  const currentTenant = getCurrentTenant();
  
  if (currentTenant !== tenantId) {
    throw new Error('Access denied: Data isolation violation');
  }
  
  return operation();
};

// Branding management
export const updateInstituteBranding = (tenantId, brandingData) => {
  if (!instituteDatabase[tenantId]) return false;
  
  instituteDatabase[tenantId].branding = {
    ...instituteDatabase[tenantId].branding,
    ...brandingData
  };
  
  return true;
};

export const getInstituteBranding = (tenantId) => {
  const institute = instituteDatabase[tenantId];
  return institute ? institute.branding : null;
};

// Permission management
export const hasPermission = (tenantId, userRole, permission) => {
  const institute = instituteDatabase[tenantId];
  if (!institute || !institute.permissions[userRole]) return false;
  
  return institute.permissions[userRole].includes(permission);
};

export const updateRolePermissions = (tenantId, role, permissions) => {
  if (!instituteDatabase[tenantId]) return false;
  
  instituteDatabase[tenantId].permissions[role] = permissions;
  return true;
};

// Super admin functions
export const getAllInstitutes = () => {
  return Object.values(instituteDatabase).map(institute => ({
    id: institute.id,
    name: institute.name,
    code: institute.code,
    subdomain: institute.subdomain,
    admin: institute.admin.name,
    email: institute.admin.email,
    status: institute.status || 'active',
    registeredDate: institute.registeredDate,
    departments: institute.config.departments.length,
    students: institute.users.filter(u => u.role === 'student').length,
    faculty: institute.users.filter(u => u.role === 'faculty').length,
    branding: institute.branding
  }));
};

export const getSystemStats = () => {
  const institutes = Object.values(instituteDatabase);
  
  return {
    totalInstitutes: institutes.length,
    activeInstitutes: institutes.filter(i => i.status === 'active').length,
    totalStudents: institutes.reduce((sum, i) => sum + i.users.filter(u => u.role === 'student').length, 0),
    totalFaculty: institutes.reduce((sum, i) => sum + i.users.filter(u => u.role === 'faculty').length, 0),
    totalDepartments: institutes.reduce((sum, i) => sum + i.config.departments.length, 0)
  };
};

// Institute management
export const updateInstituteStatus = (tenantId, status) => {
  if (!instituteDatabase[tenantId]) return false;
  
  instituteDatabase[tenantId].status = status;
  return true;
};

export const deleteInstitute = (tenantId) => {
  if (!instituteDatabase[tenantId]) return false;
  
  delete instituteDatabase[tenantId];
  return true;
};