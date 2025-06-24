import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Billing = () => {
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: ['Up to 10 links', 'Basic analytics', 'Email notifications', '24/7 monitoring'],
      current: user?.plan === 'free'
    },
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 9,
      yearlyPrice: 90,
      features: ['Up to 100 links', 'Basic analytics', 'Email notifications', '24/7 monitoring', 'API access'],
      current: user?.plan === 'starter'
    },
    {
      id: 'pro',
      name: 'Professional',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: ['Up to 1,000 links', 'Advanced analytics', 'Team collaboration', 'Custom domains', 'White-label dashboard', 'Priority support'],
      current: user?.plan === 'pro',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: ['Unlimited links', 'Enterprise analytics', 'Multi-tenant architecture', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee'],
      current: user?.plan === 'enterprise'
    }
  ];

  const invoices = [
    {
      id: 'INV-2024-001',
      date: '2024-01-01',
      amount: 29.00,
      status: 'paid',
      plan: 'Professional',
      period: 'Jan 2024'
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-01',
      amount: 29.00,
      status: 'paid',
      plan: 'Professional',
      period: 'Dec 2023'
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-01',
      amount: 29.00,
      status: 'paid',
      plan: 'Professional',
      period: 'Nov 2023'
    },
    {
      id: 'INV-2023-010',
      date: '2023-10-01',
      amount: 29.00,
      status: 'paid',
      plan: 'Professional',
      period: 'Oct 2023'
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: 2,
      type: 'card',
      brand: 'Mastercard',
      last4: '5555',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ];

  const currentPlan = plans.find(plan => plan.current);
  const currentPrice = billingPeriod === 'monthly' ? currentPlan?.monthlyPrice : currentPlan?.yearlyPrice;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription, billing information, and payment methods</p>
        </div>

        {/* Current Plan */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
              Active
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{currentPlan?.name} Plan</h4>
                  <p className="text-gray-600">
                    ${currentPrice}/{billingPeriod === 'monthly' ? 'month' : 'year'} • 
                    Next billing: February 1, 2024
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">1,247</div>
                  <div className="text-sm text-gray-600">Links monitored</div>
                  <div className="text-xs text-green-600 mt-1">of 1,000 limit</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">5</div>
                  <div className="text-sm text-gray-600">Team members</div>
                  <div className="text-xs text-green-600 mt-1">of 10 limit</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Upgrade Plan
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Change Plan
              </button>
              <button className="text-red-600 hover:text-red-700 text-sm">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Available Plans</h3>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingPeriod === 'yearly' && (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Save 17%
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-6 rounded-xl border-2 ${
                  plan.current
                    ? 'border-blue-500 bg-blue-50'
                    : plan.popular
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Current Plan
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h4>
                  <div className="text-3xl font-bold text-gray-900">
                    ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </div>
                  <div className="text-gray-600">
                    /{billingPeriod === 'monthly' ? 'month' : 'year'}
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                    plan.current
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <Plus className="w-4 h-4 mr-1" />
                Add Method
              </button>
            </div>
            
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-600">
                        {method.brand.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        •••• •••• •••• {method.last4}
                      </div>
                      <div className="text-sm text-gray-600">
                        Expires {method.expiryMonth}/{method.expiryYear}
                        {method.isDefault && (
                          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{invoice.id}</div>
                    <div className="text-sm text-gray-600">
                      {invoice.plan} • {invoice.period}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        ${invoice.amount.toFixed(2)}
                      </div>
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Paid
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Billing;