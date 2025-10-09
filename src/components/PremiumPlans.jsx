import React, { useState } from 'react';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { useOrganization } from '../context/OrganizationContext';

const PremiumPlans = () => {
  const { plan, upgradePlan, organization } = useOrganization();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      icon: Star,
      features: [
        'Up to 100 students',
        'Basic attendance tracking',
        'Simple grade management',
        'Email support'
      ],
      limitations: [
        'No analytics dashboard',
        'No custom branding',
        'Limited storage (1GB)'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      icon: Zap,
      features: [
        'Up to 500 students',
        'Advanced analytics',
        'Parent portal access',
        'SMS notifications',
        'Priority support',
        '10GB storage'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 99,
      icon: Crown,
      features: [
        'Unlimited students',
        'Full analytics suite',
        'Custom branding',
        'API access',
        'White-label solution',
        'Unlimited storage',
        '24/7 phone support'
      ],
      popular: true
    }
  ];

  const handleUpgrade = async (planId) => {
    if (planId === plan) return;
    
    setLoading(true);
    try {
      if (planId !== 'free') {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      await upgradePlan(planId);
      alert(`Successfully ${planId === 'free' ? 'downgraded to' : 'upgraded to'} ${planId} plan!`);
    } catch (error) {
      alert('Failed to update plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">Choose Your Plan</h2>
        <p className="text-[#333333] dark:text-gray-300">
          Current Plan: <span className="font-semibold text-[#22c55e] capitalize">{plan}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((planOption) => {
          const Icon = planOption.icon;
          const isCurrentPlan = plan === planOption.id;
          
          return (
            <div
              key={planOption.id}
              className={`relative bg-white dark:bg-black border rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
                planOption.popular 
                  ? 'border-[#22c55e] ring-2 ring-[#22c55e]/20' 
                  : 'border-[#A5D6A7] hover:border-[#22c55e]'
              } ${isCurrentPlan ? 'ring-2 ring-[#22c55e]' : ''}`}
            >
              {planOption.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#22c55e] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <Icon className={`h-12 w-12 mx-auto mb-4 ${
                  planOption.popular ? 'text-[#22c55e]' : 'text-[#66BB6A]'
                }`} />
                <h3 className="text-xl font-bold text-black dark:text-white">{planOption.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-black dark:text-white">${planOption.price}</span>
                  <span className="text-[#333333] dark:text-gray-300">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {planOption.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-[#22c55e] mr-3 flex-shrink-0" />
                    <span className="text-sm text-black dark:text-white">{feature}</span>
                  </li>
                ))}
                {planOption.limitations?.map((limitation, index) => (
                  <li key={index} className="flex items-center opacity-60">
                    <span className="h-4 w-4 mr-3 flex-shrink-0 text-red-500">×</span>
                    <span className="text-sm text-black dark:text-white">{limitation}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(planOption.id)}
                disabled={loading || isCurrentPlan}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  isCurrentPlan
                    ? 'bg-[#22c55e]/20 text-[#22c55e] cursor-not-allowed'
                    : planOption.popular
                    ? 'bg-[#22c55e] hover:bg-[#16a34a] text-white'
                    : 'bg-white border border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white'
                }`}
              >
                {loading ? 'Processing...' : isCurrentPlan ? 'Current Plan' : `Choose ${planOption.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {organization && (
        <div className="bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Organization Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#333333] dark:text-gray-300">Organization: {organization.name}</p>
              <p className="text-sm text-[#333333] dark:text-gray-300">Subdomain: {organization.subdomain}.myapp.com</p>
            </div>
            <div>
              <p className="text-sm text-[#333333] dark:text-gray-300">Current Plan: {plan}</p>
              <p className="text-sm text-[#333333] dark:text-gray-300">Features: {Object.values(organization.settings?.features || {}).filter(Boolean).length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumPlans;