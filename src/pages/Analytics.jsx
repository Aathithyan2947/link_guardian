import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Smartphone, 
  Calendar,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const clickData = [
    { date: '2024-01-15', clicks: 1200, visitors: 850 },
    { date: '2024-01-16', clicks: 1350, visitors: 920 },
    { date: '2024-01-17', clicks: 1100, visitors: 780 },
    { date: '2024-01-18', clicks: 1800, visitors: 1200 },
    { date: '2024-01-19', clicks: 1650, visitors: 1100 },
    { date: '2024-01-20', clicks: 2100, visitors: 1400 },
    { date: '2024-01-21', clicks: 1900, visitors: 1250 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3B82F6' },
    { name: 'Mobile', value: 40, color: '#8B5CF6' },
    { name: 'Tablet', value: 15, color: '#10B981' }
  ];

  const countryData = [
    { country: 'United States', clicks: 4500, percentage: 32 },
    { country: 'United Kingdom', clicks: 2800, percentage: 20 },
    { country: 'Germany', clicks: 2100, percentage: 15 },
    { country: 'Canada', clicks: 1800, percentage: 13 },
    { country: 'France', clicks: 1400, percentage: 10 },
    { country: 'Others', clicks: 1400, percentage: 10 }
  ];

  const topLinks = [
    { url: 'lg.co/pl2024', clicks: 1247, title: 'Product Launch 2024' },
    { url: 'lg.co/ann24', clicks: 892, title: 'New Features Announcement' },
    { url: 'lg.co/api-docs', clicks: 634, title: 'API Integration Guide' },
    { url: 'lg.co/support', clicks: 445, title: 'Help Center' },
    { url: 'lg.co/newsletter', clicks: 278, title: 'Newsletter Signup' }
  ];

  const stats = [
    {
      title: 'Total Clicks',
      value: '24.7K',
      change: '+23%',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Unique Visitors',
      value: '18.2K',
      change: '+18%',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Countries',
      value: '47',
      change: '+5%',
      icon: Globe,
      color: 'green'
    },
    {
      title: 'Avg. CTR',
      value: '3.8%',
      change: '+12%',
      icon: BarChart3,
      color: 'orange'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Detailed insights into your link performance</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} vs last period</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${
                  stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  stat.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  stat.color === 'green' ? 'from-green-500 to-green-600' :
                  'from-orange-500 to-orange-600'
                } rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Click Trends */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Click Trends</h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Clicks</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Visitors</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clickData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis />
                <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="visitors" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {deviceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Top Performing Links */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Links</h3>
            <div className="space-y-4">
              {topLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-600">{link.url}</div>
                    <div className="text-xs text-gray-500">{link.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{link.clicks.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">clicks</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h3>
            <div className="space-y-4">
              {countryData.map((country, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-900 font-medium">{country.country}</span>
                    <span className="text-gray-600">{country.clicks.toLocaleString()} ({country.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${country.percentage}%` }}
                    ></div>
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

export default Analytics;