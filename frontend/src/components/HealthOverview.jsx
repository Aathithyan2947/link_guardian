import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const HealthOverview = () => {
  const weeklyData = [
    { name: 'Mon', healthy: 142, warning: 8, error: 3 },
    { name: 'Tue', healthy: 138, warning: 12, error: 5 },
    { name: 'Wed', healthy: 145, warning: 6, error: 2 },
    { name: 'Thu', healthy: 141, warning: 9, error: 4 },
    { name: 'Fri', healthy: 148, warning: 5, error: 1 },
    { name: 'Sat', healthy: 144, warning: 7, error: 3 },
    { name: 'Sun', healthy: 146, warning: 6, error: 2 }
  ];

  const statusData = [
    { name: 'Healthy', value: 1198, color: '#10B981' },
    { name: 'Warning', value: 35, color: '#F59E0B' },
    { name: 'Error', value: 14, color: '#EF4444' }
  ];

  const issues = [
    {
      type: 'SSL Certificate Expiring',
      count: 3,
      severity: 'warning',
      description: 'SSL certificates will expire within 30 days'
    },
    {
      type: '404 Not Found',
      count: 8,
      severity: 'error',
      description: 'Links returning 404 status code'
    },
    {
      type: 'Slow Response Time',
      count: 12,
      severity: 'warning',
      description: 'Response time > 3 seconds'
    },
    {
      type: 'Redirect Chain',
      count: 6,
      severity: 'warning',
      description: 'Multiple redirects detected'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Health Overview</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">7 Days</button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">30 Days</button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">90 Days</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Trend */}
        <div className="lg:col-span-2">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Weekly Health Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="healthy" stackId="a" fill="#10B981" />
              <Bar dataKey="warning" stackId="a" fill="#F59E0B" />
              <Bar dataKey="error" stackId="a" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Status Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issues Summary */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">Recent Issues</h4>
        <div className="space-y-3">
          {issues.map((issue, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  issue.severity === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{issue.type}</div>
                  <div className="text-xs text-gray-500">{issue.description}</div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">{issue.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthOverview;