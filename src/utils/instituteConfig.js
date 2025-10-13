// Institute Configuration with Dynamic Theming
export const institutes = {
  'pallavi': {
    id: 'pallavi',
    name: 'Pallavi Engineering College',
    shortName: 'PEC',
    logo: '/api/placeholder/60/60',
    established: '2001',
    location: 'Hyderabad, Telangana',
    affiliation: 'JNTUH Affiliated',
    accreditation: 'NAAC A Grade',
    type: 'Private Engineering College',
    tagline: 'Excellence in Engineering Education',
    adminCredentials: {
      email: 'admin@pallavi.edu.in',
      password: 'pallavi@2024',
      name: 'Dr. Rajesh Kumar',
      designation: 'Principal & Administrator'
    },
    branding: {
      primaryColor: '#059669',
      secondaryColor: '#047857',
      accentColor: '#10b981',
      gradientFrom: 'from-green-600',
      gradientTo: 'to-green-800',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-700'
    },
    customization: {
      headerStyle: 'modern',
      cardStyle: 'rounded',
      buttonStyle: 'solid',
      layout: 'grid'
    }
  },
  'sreyas': {
    id: 'sreyas',
    name: 'Sreyas Institute of Engineering & Technology',
    shortName: 'SIET',
    logo: '/api/placeholder/60/60',
    established: '2008',
    location: 'Hyderabad, Telangana',
    affiliation: 'JNTUH Affiliated',
    accreditation: 'NAAC B+ Grade',
    type: 'Private Engineering Institute',
    tagline: 'Innovation Through Technology',
    adminCredentials: {
      email: 'admin@sreyas.edu.in',
      password: 'sreyas@2024',
      name: 'Prof. Sunitha Reddy',
      designation: 'Director & Administrator'
    },
    branding: {
      primaryColor: '#7c3aed',
      secondaryColor: '#6d28d9',
      accentColor: '#8b5cf6',
      gradientFrom: 'from-purple-600',
      gradientTo: 'to-purple-800',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-700'
    },
    customization: {
      headerStyle: 'elegant',
      cardStyle: 'shadow',
      buttonStyle: 'gradient',
      layout: 'list'
    }
  },
  'jntuh': {
    id: 'jntuh',
    name: 'Jawaharlal Nehru Technological University Hyderabad',
    shortName: 'JNTUH',
    logo: '/api/placeholder/60/60',
    established: '1972',
    location: 'Hyderabad, Telangana',
    affiliation: 'Autonomous University',
    accreditation: 'NAAC A+ Grade',
    type: 'Government University',
    tagline: 'Leading in Technical Education',
    adminCredentials: {
      email: 'admin@jntuh.ac.in',
      password: 'jntuh@2024',
      name: 'Prof. A. Govardhan',
      designation: 'Vice-Chancellor'
    },
    branding: {
      primaryColor: '#2563eb',
      secondaryColor: '#1d4ed8',
      accentColor: '#3b82f6',
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-blue-800',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-700'
    },
    customization: {
      headerStyle: 'classic',
      cardStyle: 'bordered',
      buttonStyle: 'outline',
      layout: 'compact'
    }
  }
};

// Get current institute with branding
export const getCurrentInstitute = () => {
  const instituteId = localStorage.getItem('currentInstitute') || 'jntuh';
  return institutes[instituteId] || institutes.jntuh;
};

// Apply institute-specific CSS variables
export const applyInstituteTheme = (instituteId) => {
  const institute = institutes[instituteId];
  if (!institute) return;
  
  const root = document.documentElement;
  root.style.setProperty('--institute-primary', institute.branding.primaryColor);
  root.style.setProperty('--institute-secondary', institute.branding.secondaryColor);
  root.style.setProperty('--institute-accent', institute.branding.accentColor);
};

// Get institute-specific classes
export const getInstituteClasses = (instituteId, type = 'primary') => {
  const institute = institutes[instituteId] || institutes.jntuh;
  const { branding } = institute;
  
  switch (type) {
    case 'header':
      return `bg-gradient-to-r ${branding.gradientFrom} ${branding.gradientTo}`;
    case 'button':
      return `${branding.textColor} ${branding.bgColor} ${branding.borderColor} ${branding.hoverColor}`;
    case 'card':
      return `${branding.bgColor} ${branding.borderColor}`;
    case 'text':
      return branding.textColor;
    default:
      return branding.textColor;
  }
};

// Set current institute
export const setCurrentInstitute = (instituteId) => {
  if (institutes[instituteId]) {
    localStorage.setItem('currentInstitute', instituteId);
    return true;
  }
  return false;
};

// Get all available institutes
export const getAllInstitutes = () => {
  return Object.values(institutes);
};

// Initialize institute theme on app load
export const initializeInstituteTheme = () => {
  const currentInstitute = getCurrentInstitute();
  applyInstituteTheme(currentInstitute.id);
  return currentInstitute;
};