import React, { useState, useEffect } from 'react';
import { Upload, Save, Eye, Palette, Image, Settings } from 'lucide-react';
import { updateInstituteBranding, getInstituteBranding } from '../utils/multiTenant';

const InstituteCustomization = ({ isOpen, onClose, instituteData }) => {
  const [customization, setCustomization] = useState({
    logo: null,
    banner: null,
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#10B981',
    instituteName: '',
    tagline: '',
    footerText: ''
  });
  const [uploading, setUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (instituteData && isOpen) {
      loadBrandingData();
    }
  }, [instituteData, isOpen]);

  const loadBrandingData = async () => {
    let branding = {};
    
    // Try to get branding from multi-tenant system
    if (instituteData.id) {
      branding = getInstituteBranding(instituteData.id) || {};
    }
    
    // Fallback: get from localStorage
    if (!branding.primaryColor) {
      const saved = localStorage.getItem(`branding_${instituteData.id || 'default'}`);
      if (saved) {
        branding = JSON.parse(saved);
      }
    }

    // Load images from localStorage
    const tenantId = instituteData.id || 'default';
    const logoData = localStorage.getItem(`logo_${tenantId}`);
    const bannerData = localStorage.getItem(`banner_${tenantId}`);
    
    if (logoData) branding.logo = logoData;
    if (bannerData) branding.banner = bannerData;
    
    setCustomization({
      logo: branding.logo || null,
      banner: branding.banner || null,
      primaryColor: branding.primaryColor || '#3B82F6',
      secondaryColor: branding.secondaryColor || '#1E40AF',
      accentColor: branding.accentColor || '#10B981',
      instituteName: instituteData.name || '',
      tagline: branding.tagline || 'Excellence in Education',
      footerText: branding.footerText || `© 2024 ${instituteData.name || 'Institute'}. All rights reserved.`
    });
  };

  const handleFileUpload = (type, file) => {
    if (file && (file.type.startsWith('image/') || file.type === 'image/svg+xml')) {
      setUploading(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const tenantId = instituteData?.id || 'default';
        
        // Store in localStorage
        localStorage.setItem(`${type}_${tenantId}`, dataUrl);
        
        setCustomization(prev => ({
          ...prev,
          [type]: dataUrl
        }));
        
        setUploading(false);
      };
      
      reader.onerror = () => {
        alert('Upload failed. Please try again.');
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (PNG, JPG, SVG)');
    }
  };

  const handleSave = async () => {
    if (!instituteData) return;
    
    setSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const brandingData = {
        logo: customization.logo,
        banner: customization.banner,
        primaryColor: customization.primaryColor,
        secondaryColor: customization.secondaryColor,
        accentColor: customization.accentColor,
        tagline: customization.tagline,
        footerText: customization.footerText
      };
      
      // Try to update branding in multi-tenant system
      let success = false;
      if (instituteData.id) {
        success = updateInstituteBranding(instituteData.id, brandingData);
      }
      
      // Fallback: save to localStorage for demo
      if (!success) {
        localStorage.setItem(`branding_${instituteData.id || 'default'}`, JSON.stringify(brandingData));
        success = true;
      }
      
      if (success) {
        alert(`Branding updated successfully!\n\nChanges applied to:\n• Logo and Banner\n• Color Theme\n• Typography\n\nRefresh the page to see changes.`);
        onClose();
      } else {
        throw new Error('Failed to update branding');
      }
    } catch (error) {
      alert('Failed to save branding. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const colorPresets = [
    { name: 'Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#10B981' },
    { name: 'Green', primary: '#10B981', secondary: '#059669', accent: '#3B82F6' },
    { name: 'Purple', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#F59E0B' },
    { name: 'Red', primary: '#EF4444', secondary: '#DC2626', accent: '#10B981' },
    { name: 'Orange', primary: '#F97316', secondary: '#EA580C', accent: '#3B82F6' }
  ];

  if (!isOpen) return null;
  
  // Debug info
  console.log('InstituteCustomization - instituteData:', instituteData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Institute Branding & Customization</h3>
            {instituteData && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {instituteData.name} (ID: {instituteData.id || 'N/A'})
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center text-sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
          </div>
        </div>

        <div className="p-6">
          {previewMode ? (
            /* Preview Mode */
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dashboard Preview</h4>
              
              {/* Preview Header */}
              <div 
                className="rounded-xl p-6 text-white"
                style={{ background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {customization.logo && (
                      <img src={customization.logo} alt="Logo" className="w-12 h-12 rounded-full bg-white p-1" />
                    )}
                    <div>
                      <h1 className="text-xl font-bold">{customization.instituteName}</h1>
                      <p className="text-sm opacity-90">{customization.tagline}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Banner */}
              {customization.banner && (
                <div className="rounded-xl overflow-hidden">
                  <img src={customization.banner} alt="Banner" className="w-full h-32 object-cover" />
                </div>
              )}

              {/* Preview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Student Dashboard', 'Faculty Dashboard', 'Parent Dashboard'].map((title, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2 mb-3">
                      {customization.logo && (
                        <img src={customization.logo} alt="Logo" className="w-6 h-6 rounded" />
                      )}
                      <h5 className="font-medium text-gray-900 dark:text-white">{title}</h5>
                    </div>
                    <div 
                      className="h-2 rounded-full mb-2"
                      style={{ backgroundColor: customization.accentColor }}
                    ></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Branded with institute colors and logo
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Logo & Banner Upload */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Visual Assets</h4>
                  
                  {/* Logo Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Institute Logo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      {customization.logo ? (
                        <div className="text-center">
                          <img src={customization.logo} alt="Logo" className="w-20 h-20 mx-auto mb-2 rounded-lg object-cover" />
                          <button
                            onClick={() => document.getElementById('logo-upload').click()}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Change Logo
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <button
                            onClick={() => document.getElementById('logo-upload').click()}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Upload Logo
                          </button>
                        </div>
                      )}
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('logo', e.target.files[0])}
                      />
                    </div>
                  </div>

                  {/* Banner Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Institute Banner
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      {customization.banner ? (
                        <div className="text-center">
                          <img src={customization.banner} alt="Banner" className="w-full h-24 mx-auto mb-2 rounded-lg object-cover" />
                          <button
                            onClick={() => document.getElementById('banner-upload').click()}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Change Banner
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <button
                            onClick={() => document.getElementById('banner-upload').click()}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Upload Banner
                          </button>
                        </div>
                      )}
                      <input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('banner', e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Customization */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Color Theme</h4>
                  
                  {/* Color Presets */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quick Presets
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => setCustomization(prev => ({
                            ...prev,
                            primaryColor: preset.primary,
                            secondaryColor: preset.secondary,
                            accentColor: preset.accent
                          }))}
                          className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-400 transition-colors"
                        >
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: preset.primary }}></div>
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: preset.secondary }}></div>
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: preset.accent }}></div>
                          </div>
                          <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">{preset.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={customization.primaryColor}
                          onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={customization.primaryColor}
                          onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={customization.secondaryColor}
                          onChange={(e) => setCustomization(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={customization.secondaryColor}
                          onChange={(e) => setCustomization(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Accent Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={customization.accentColor}
                          onChange={(e) => setCustomization(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={customization.accentColor}
                          onChange={(e) => setCustomization(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Customization */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Text Content</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Institute Tagline
                      </label>
                      <input
                        type="text"
                        value={customization.tagline}
                        onChange={(e) => setCustomization(prev => ({ ...prev, tagline: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Excellence in Education"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Footer Text
                      </label>
                      <textarea
                        value={customization.footerText}
                        onChange={(e) => setCustomization(prev => ({ ...prev, footerText: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        rows="2"
                        placeholder="Copyright notice or additional information"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={uploading || saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Branding
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteCustomization;