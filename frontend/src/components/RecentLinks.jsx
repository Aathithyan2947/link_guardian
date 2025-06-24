import React from 'react';
import { ExternalLink, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const RecentLinks = () => {
  const links = [
    {
      id: 1,
      url: 'https://example.com/product-launch',
      shortUrl: 'lg.co/pl2024',
      status: 'healthy',
      clicks: 1247,
      lastChecked: '2 min ago'
    },
    {
      id: 2,
      url: 'https://blog.company.com/announcement',
      shortUrl: 'lg.co/ann24',
      status: 'warning',
      clicks: 892,
      lastChecked: '5 min ago'
    },
    {
      id: 3,
      url: 'https://docs.company.com/api-guide',
      shortUrl: 'lg.co/api-docs',
      status: 'healthy',
      clicks: 634,
      lastChecked: '1 min ago'
    },
    {
      id: 4,
      url: 'https://support.company.com/help',
      shortUrl: 'lg.co/support',
      status: 'error',
      clicks: 445,
      lastChecked: '3 min ago'
    },
    {
      id: 5,
      url: 'https://newsletter.company.com/signup',
      shortUrl: 'lg.co/newsletter',
      status: 'healthy',
      clicks: 278,
      lastChecked: '4 min ago'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Links</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {links.map((link) => (
          <div key={link.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {getStatusIcon(link.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-blue-600 truncate">
                    {link.shortUrl}
                  </span>
                  <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                </div>
                <p className="text-xs text-gray-500 truncate">{link.url}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 ml-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{link.clicks.toLocaleString()}</div>
                <div className="text-xs text-gray-500">clicks</div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(link.status)} capitalize`}>
                {link.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentLinks;