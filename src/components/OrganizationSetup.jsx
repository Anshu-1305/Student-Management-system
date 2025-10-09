import React, { useState } from 'react';
import { Building, Globe, User, Mail, Phone } from 'lucide-react';
import { useOrganization } from '../context/OrganizationContext';

const OrganizationSetup = () => {
  const { createOrganization } = useOrganization();
  const [formData, setFormData] = useState({
    name: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    type: 'school'
  });
  const [loading, setLoading] = useState(false);
  const [previewSubdomain, setPreviewSubdomain] = useState('');

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({ ...formData, name });
    
    // Generate subdomain preview
    const subdomain = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    setPreviewSubdomain(subdomain);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createOrganization(formData);
    } catch (error) {
      alert('Failed to create organization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Building className="h-16 w-16 text-[#22c55e] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-black mb-2">Create Your Organization</h1>
          <p className="text-[#333333]">Set up your educational institution in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Organization Name *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#22c55e]" />
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                className="w-full pl-10 pr-3 py-2 border border-[#A5D6A7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
                placeholder="Enter organization name"
                required
              />
            </div>
            {previewSubdomain && (
              <div className="mt-2 flex items-center text-sm text-[#22c55e]">
                <Globe className="h-4 w-4 mr-1" />
                Your URL: {previewSubdomain}.myapp.com
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Organization Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-[#A5D6A7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            >
              <option value="school">School</option>
              <option value="college">College</option>
              <option value="university">University</option>
              <option value="institute">Institute</option>
            </select>
          </div>

          <div className="border-t border-[#A5D6A7] pt-6">
            <h3 className="text-lg font-semibold text-black mb-4">Admin Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Admin Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#22c55e]" />
                  <input
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-[#A5D6A7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                    placeholder="Enter admin name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Admin Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#22c55e]" />
                  <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-[#A5D6A7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                    placeholder="Enter admin email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Admin Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#22c55e]" />
                  <input
                    type="tel"
                    value={formData.adminPhone}
                    onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-[#A5D6A7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                    placeholder="Enter admin phone"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.name || !formData.adminName || !formData.adminEmail}
            className="w-full bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-[#A5D6A7] disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Creating Organization...' : 'Create Organization'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#333333]">
          <p>By creating an organization, you agree to our Terms of Service</p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSetup;