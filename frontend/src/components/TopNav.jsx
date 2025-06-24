import React, { useState } from 'react';
import { Bell, Search, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AddLinkModal from './AddLinkModal';

const TopNav = () => {
  const { user } = useAuth();
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);

  const handleSaveLink = async (linkData) => {
    // Handle saving the link data
    console.log('Saving link:', linkData);
    // Here you would typically make an API call to save the link
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search links..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowAddLinkModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </button>
            
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.plan} Plan</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AddLinkModal
        isOpen={showAddLinkModal}
        onClose={() => setShowAddLinkModal(false)}
        onSave={handleSaveLink}
      />
    </>
  );
};

export default TopNav;