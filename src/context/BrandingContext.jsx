import React, { createContext, useContext, useState, useEffect } from 'react';


const BrandingContext = createContext();

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState({
    logo: null,
    banner: null,
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#10B981',
    tagline: 'Excellence in Education',
    footerText: '© 2024 Institute. All rights reserved.',
    instituteName: 'Institute Portal'
  });
  const [instituteData, setInstituteData] = useState(null);

  useEffect(() => {
    loadBranding();
  }, []);

  const loadBranding = () => {
    try {
      const { getCurrentInstitute, applyInstituteTheme } = require('../utils/instituteConfig');
      const currentInstitute = getCurrentInstitute();
      
      // Apply CSS theme variables
      applyInstituteTheme(currentInstitute.id);
      
      setInstituteData(currentInstitute);
      
      const tenantId = localStorage.getItem('currentTenant') || 'default';
      const saved = localStorage.getItem(`branding_${tenantId}`);
      let customBranding = saved ? JSON.parse(saved) : null;

      // Load custom images from localStorage
      const logoUrl = localStorage.getItem(`logo_${tenantId}`);
      const bannerUrl = localStorage.getItem(`banner_${tenantId}`);
      
      // Merge institute branding with custom branding
      const instituteBranding = {
        logo: logoUrl || currentInstitute.logo,
        banner: bannerUrl || null,
        primaryColor: currentInstitute.branding.primaryColor,
        secondaryColor: currentInstitute.branding.secondaryColor,
        accentColor: currentInstitute.branding.accentColor,
        tagline: currentInstitute.tagline,
        instituteName: currentInstitute.name,
        footerText: `© 2024 ${currentInstitute.name}. All rights reserved.`,
        ...customBranding
      };
      
      setBranding(instituteBranding);
    } catch (error) {
      console.error('Error loading branding:', error);
      setBranding({
        logo: null,
        banner: null,
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#10B981',
        tagline: 'Excellence in Education',
        footerText: '© 2024 Institute. All rights reserved.',
        instituteName: 'Institute Portal'
      });
    }
  };

  const updateBranding = (newBranding) => {
    setBranding(prev => ({ ...prev, ...newBranding }));
    
    // Save to localStorage
    const tenantId = localStorage.getItem('currentTenant') || 'default';
    localStorage.setItem(`branding_${tenantId}`, JSON.stringify({ ...branding, ...newBranding }));
  };

  const getBrandedStyles = () => ({
    primaryGradient: `linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor})`,
    primaryColor: branding.primaryColor,
    secondaryColor: branding.secondaryColor,
    accentColor: branding.accentColor,
    headerStyle: {
      background: `linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor})`
    },
    buttonStyle: {
      backgroundColor: branding.primaryColor
    },
    accentStyle: {
      backgroundColor: branding.accentColor
    }
  });

  const getBrandedClasses = (type = 'primary') => {
    // Convert hex colors to Tailwind-compatible classes
    const colorMap = {
      '#3B82F6': 'blue',
      '#10B981': 'green', 
      '#8B5CF6': 'purple',
      '#EF4444': 'red',
      '#F59E0B': 'yellow',
      '#059669': 'emerald',
      '#7C3AED': 'violet',
      '#DC2626': 'red',
      '#1E40AF': 'blue'
    };

    const getColorName = (hex) => {
      return colorMap[hex] || 'blue';
    };

    switch (type) {
      case 'primary':
        return `bg-${getColorName(branding.primaryColor)}-600 hover:bg-${getColorName(branding.primaryColor)}-700`;
      case 'secondary':
        return `bg-${getColorName(branding.secondaryColor)}-600 hover:bg-${getColorName(branding.secondaryColor)}-700`;
      case 'accent':
        return `bg-${getColorName(branding.accentColor)}-600 hover:bg-${getColorName(branding.accentColor)}-700`;
      case 'text-primary':
        return `text-${getColorName(branding.primaryColor)}-600`;
      case 'text-secondary':
        return `text-${getColorName(branding.secondaryColor)}-600`;
      case 'border-primary':
        return `border-${getColorName(branding.primaryColor)}-600`;
      default:
        return `bg-${getColorName(branding.primaryColor)}-600`;
    }
  };

  const value = {
    branding,
    instituteData,
    updateBranding,
    loadBranding,
    getBrandedStyles,
    getBrandedClasses
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};

export default BrandingProvider;