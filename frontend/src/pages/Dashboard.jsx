import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  BarChart3, 
  Link as LinkIcon, 
  AlertTriangle, 
  TrendingUp,
  Globe,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import RecentLinks from '../components/RecentLinks';
import HealthOverview from '../components/HealthOverview';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Links',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: LinkIcon,
      color: 'blue'
    },
    {
      title: 'Healthy Links',
      value: '1,198',
      change: '+5%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Issues Detected',
      value: '49',
      change: '+8%',
      trend: 'up',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Total Clicks',
      value: '24.7K',
      change: '+23%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Monitor your link performance and health status</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Health Overview */}
          <div className="xl:col-span-2">
            <HealthOverview />
          </div>
          
          {/* Recent Links */}
          <div>
            <RecentLinks />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <LinkIcon className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium">Add New Link</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium">View Analytics</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Globe className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">Run Health Check</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;