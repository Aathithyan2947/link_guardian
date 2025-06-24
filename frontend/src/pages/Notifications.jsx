import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X,
  Settings,
  Filter,
  MoreHorizontal,
  Clock,
  Link as LinkIcon,
  BarChart3,
  Users,
  Shield
} from 'lucide-react';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'error',
      title: 'Link Health Alert',
      message: 'lg.co/support is returning 404 errors',
      timestamp: '2 minutes ago',
      read: false,
      category: 'health'
    },
    {
      id: 2,
      type: 'warning',
      title: 'SSL Certificate Expiring',
      message: '3 SSL certificates will expire within 30 days',
      timestamp: '1 hour ago',
      read: false,
      category: 'security'
    },
    {
      id: 3,
      type: 'success',
      title: 'Weekly Report Ready',
      message: 'Your weekly analytics report is now available',
      timestamp: '3 hours ago',
      read: true,
      category: 'analytics'
    },
    {
      id: 4,
      type: 'info',
      title: 'New Team Member Added',
      message: 'John Doe has been added to your team',
      timestamp: '1 day ago',
      read: true,
      category: 'team'
    },
    {
      id: 5,
      type: 'warning',
      title: 'High Click Volume',
      message: 'lg.co/pl2024 received 500% more clicks than usual',
      timestamp: '2 days ago',
      read: true,
      category: 'analytics'
    },
    {
      id: 6,
      type: 'error',
      title: 'Link Monitoring Failed',
      message: 'Unable to check health for 5 links due to network issues',
      timestamp: '3 days ago',
      read: true,
      category: 'health'
    },
    {
      id: 7,
      type: 'info',
      title: 'Monthly Usage Summary',
      message: 'You\'ve used 85% of your monthly link quota',
      timestamp: '1 week ago',
      read: true,
      category: 'billing'
    }
  ]);

  const filters = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'unread', name: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'health', name: 'Health', count: notifications.filter(n => n.category === 'health').length },
    { id: 'analytics', name: 'Analytics', count: notifications.filter(n => n.category === 'analytics').length },
    { id: 'security', name: 'Security', count: notifications.filter(n => n.category === 'security').length },
    { id: 'team', name: 'Team', count: notifications.filter(n => n.category === 'team').length }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'health':
        return <LinkIcon className="w-4 h-4" />;
      case 'analytics':
        return <BarChart3 className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'team':
        return <Users className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.category === filter;
  });

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Stay updated with your link performance and system alerts</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button 
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Mark all as read
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterOption.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {filterOption.name}
                {filterOption.count > 0 && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    filter === filterOption.id
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {filterOption.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl border border-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : "No notifications found for the selected filter."
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        <div className="flex items-center text-gray-500">
                          {getCategoryIcon(notification.category)}
                          <span className="ml-1 text-xs capitalize">{notification.category}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {notification.timestamp}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { name: 'Link health alerts', description: 'Get notified when links go down or have issues', enabled: true },
              { name: 'Weekly reports', description: 'Receive weekly performance summaries', enabled: true },
              { name: 'Team activity', description: 'Updates about team member actions', enabled: false },
              { name: 'Security alerts', description: 'Important security notifications', enabled: true },
              { name: 'Billing notifications', description: 'Payment and subscription updates', enabled: true }
            ].map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{setting.name}</div>
                  <div className="text-sm text-gray-600">{setting.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    defaultChecked={setting.enabled}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;