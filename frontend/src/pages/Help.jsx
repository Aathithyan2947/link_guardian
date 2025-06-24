import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Search, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  FileText,
  Video,
  Users
} from 'lucide-react';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book },
    { id: 'getting-started', name: 'Getting Started', icon: HelpCircle },
    { id: 'link-management', name: 'Link Management', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: Video },
    { id: 'team', name: 'Team & Collaboration', icon: Users }
  ];

  const articles = [
    {
      id: 1,
      title: 'Getting Started with LinkGuardian',
      category: 'getting-started',
      description: 'Learn the basics of setting up your account and creating your first links',
      readTime: '5 min read',
      popular: true
    },
    {
      id: 2,
      title: 'How to Monitor Link Health',
      category: 'link-management',
      description: 'Understanding link monitoring, alerts, and health status indicators',
      readTime: '8 min read',
      popular: true
    },
    {
      id: 3,
      title: 'Setting Up Custom Domains',
      category: 'link-management',
      description: 'Configure your own domain for branded short links',
      readTime: '10 min read',
      popular: false
    },
    {
      id: 4,
      title: 'Understanding Analytics Dashboard',
      category: 'analytics',
      description: 'Deep dive into click tracking, geographic data, and performance metrics',
      readTime: '12 min read',
      popular: true
    },
    {
      id: 5,
      title: 'Team Collaboration Features',
      category: 'team',
      description: 'Managing team members, roles, and permissions',
      readTime: '7 min read',
      popular: false
    },
    {
      id: 6,
      title: 'API Integration Guide',
      category: 'getting-started',
      description: 'How to integrate LinkGuardian with your applications using our REST API',
      readTime: '15 min read',
      popular: true
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularArticles = articles.filter(article => article.popular);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          <p className="text-gray-600 mt-2">Find answers to your questions and learn how to get the most out of LinkGuardian</p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Get instant help from our support team</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              Start Chat <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Send us a detailed message</p>
            <button className="text-green-600 hover:text-green-700 font-medium flex items-center">
              Send Email <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Call us for urgent issues</p>
            <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
              Call Now <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <category.icon className={`mr-3 w-5 h-5 ${
                      selectedCategory === category.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Articles */}
          <div className="lg:col-span-3 space-y-6">
            {/* Popular Articles */}
            {selectedCategory === 'all' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularArticles.map((article) => (
                    <div key={article.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <h4 className="font-medium text-gray-900 mb-2">{article.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{article.description}</p>
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedCategory === 'all' ? 'All Articles' : categories.find(c => c.id === selectedCategory)?.name}
              </h3>
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{article.title}</h4>
                        {article.popular && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{article.description}</p>
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h3>
          <p className="text-gray-600 mb-6">Our support team is here to help you succeed</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Help;