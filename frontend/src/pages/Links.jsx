import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AddLinkModal from '../components/AddLinkModal';
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Copy, 
  Edit, 
  Trash2,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react';

const Links = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [links, setLinks] = useState([
    {
      id: 1,
      originalUrl: 'https://example.com/product-launch-2024',
      shortUrl: 'lg.co/pl2024',
      title: 'Product Launch 2024',
      status: 'healthy',
      clicks: 1247,
      createdAt: '2024-01-15',
      lastChecked: '2 min ago',
      tags: ['marketing', 'product']
    },
    {
      id: 2,
      originalUrl: 'https://blog.company.com/new-features-announcement',
      shortUrl: 'lg.co/ann24',
      title: 'New Features Announcement',
      status: 'warning',
      clicks: 892,
      createdAt: '2024-01-12',
      lastChecked: '5 min ago',
      tags: ['blog', 'features']
    },
    {
      id: 3,
      originalUrl: 'https://docs.company.com/api-integration-guide',
      shortUrl: 'lg.co/api-docs',
      title: 'API Integration Guide',
      status: 'healthy',
      clicks: 634,
      createdAt: '2024-01-10',
      lastChecked: '1 min ago',
      tags: ['documentation', 'api']
    },
    {
      id: 4,
      originalUrl: 'https://support.company.com/help-center',
      shortUrl: 'lg.co/support',
      title: 'Help Center',
      status: 'error',
      clicks: 445,
      createdAt: '2024-01-08',
      lastChecked: '3 min ago',
      tags: ['support']
    },
    {
      id: 5,
      originalUrl: 'https://newsletter.company.com/signup-form',
      shortUrl: 'lg.co/newsletter',
      title: 'Newsletter Signup',
      status: 'healthy',
      clicks: 278,
      createdAt: '2024-01-05',
      lastChecked: '4 min ago',
      tags: ['newsletter', 'marketing']
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      healthy: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[status]}`}>
        {status}
      </span>
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  const handleSaveLink = async (linkData) => {
    // Add the new link to the list
    const newLink = {
      ...linkData,
      id: links.length + 1,
      lastChecked: 'Just now'
    };
    setLinks(prev => [newLink, ...prev]);
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.shortUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || link.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Links</h1>
            <p className="text-gray-600">Manage and monitor all your smart links</p>
          </div>
          <button 
            onClick={() => setShowAddLinkModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Link
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search links..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="healthy">Healthy</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Links Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Checked
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-blue-600">{link.shortUrl}</span>
                          <button 
                            onClick={() => copyToClipboard(link.shortUrl)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-600 truncate max-w-md" title={link.originalUrl}>
                          {link.originalUrl}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {link.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(link.status)}
                        {getStatusBadge(link.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {link.clicks.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{link.lastChecked}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredLinks.length}</span> of{' '}
              <span className="font-medium">{links.length}</span> links
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                2
              </button>
              <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                3
              </button>
              <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>

        <AddLinkModal
          isOpen={showAddLinkModal}
          onClose={() => setShowAddLinkModal(false)}
          onSave={handleSaveLink}
        />
      </div>
    </DashboardLayout>
  );
};

export default Links;