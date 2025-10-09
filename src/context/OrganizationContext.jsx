import React, { createContext, useContext, useState, useEffect } from 'react';

const OrganizationContext = createContext();

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

export const OrganizationProvider = ({ children }) => {
  const [organization, setOrganization] = useState(null);
  const [subdomain, setSubdomain] = useState('');
  const [plan, setPlan] = useState('free');

  useEffect(() => {
    // Extract subdomain from URL
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    if (parts.length > 2) {
      const extractedSubdomain = parts[0];
      setSubdomain(extractedSubdomain);
      loadOrganization(extractedSubdomain);
    } else {
      // Main domain - no organization
      setSubdomain('');
      setOrganization(null);
    }
  }, []);

  const loadOrganization = async (subdomain) => {
    try {
      // Mock organization data
      const mockOrgs = {
        'demo': {
          id: 1,
          name: 'Demo University',
          subdomain: 'demo',
          plan: 'premium',
          settings: {
            branding: { logo: '', primaryColor: '#22c55e' },
            features: { analytics: true, customBranding: true, extendedStorage: true }
          }
        },
        'school1': {
          id: 2,
          name: 'ABC School',
          subdomain: 'school1',
          plan: 'free',
          settings: {
            branding: { logo: '', primaryColor: '#22c55e' },
            features: { analytics: false, customBranding: false, extendedStorage: false }
          }
        }
      };

      const org = mockOrgs[subdomain];
      if (org) {
        setOrganization(org);
        setPlan(org.plan);
      }
    } catch (error) {
      console.error('Failed to load organization:', error);
    }
  };

  const createOrganization = async (orgData) => {
    try {
      // Create subdomain
      const subdomain = orgData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      const newOrg = {
        id: Date.now(),
        name: orgData.name,
        subdomain,
        plan: 'free',
        settings: {
          branding: { logo: '', primaryColor: '#22c55e' },
          features: { analytics: false, customBranding: false, extendedStorage: false }
        }
      };

      setOrganization(newOrg);
      setPlan('free');
      
      // Redirect to subdomain
      window.location.href = `http://${subdomain}.localhost:3000`;
      
      return newOrg;
    } catch (error) {
      console.error('Failed to create organization:', error);
      throw error;
    }
  };

  const upgradePlan = async (newPlan) => {
    try {
      setPlan(newPlan);
      setOrganization(prev => ({
        ...prev,
        plan: newPlan,
        settings: {
          ...prev.settings,
          features: {
            analytics: newPlan !== 'free',
            customBranding: newPlan === 'premium',
            extendedStorage: newPlan !== 'free'
          }
        }
      }));
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      throw error;
    }
  };

  const hasFeature = (feature) => {
    return organization?.settings?.features?.[feature] || false;
  };

  const value = {
    organization,
    subdomain,
    plan,
    createOrganization,
    upgradePlan,
    hasFeature,
    isMultiTenant: !!subdomain
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};