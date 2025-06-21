import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  MoreHorizontal,
  Crown,
  Shield,
  User,
  Edit,
  Trash2,
  Send,
  UserPlus,
  Settings
} from 'lucide-react';

const Team = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      role: 'owner',
      avatar: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinedAt: '2023-01-15',
      lastActive: '2 minutes ago',
      status: 'active'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      email: 'michael@company.com',
      role: 'admin',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinedAt: '2023-02-20',
      lastActive: '1 hour ago',
      status: 'active'
    },
    {
      id: 3,
      name: 'Emily Johnson',
      email: 'emily@company.com',
      role: 'member',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinedAt: '2023-03-10',
      lastActive: '3 hours ago',
      status: 'active'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david@company.com',
      role: 'member',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinedAt: '2023-04-05',
      lastActive: '2 days ago',
      status: 'active'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      email: 'lisa@company.com',
      role: 'member',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinedAt: '2023-05-12',
      lastActive: '1 week ago',
      status: 'inactive'
    }
  ];

  const pendingInvites = [
    {
      id: 1,
      email: 'john@company.com',
      role: 'member',
      invitedBy: 'Sarah Chen',
      invitedAt: '2024-01-20',
      status: 'pending'
    },
    {
      id: 2,
      email: 'alex@company.com',
      role: 'admin',
      invitedBy: 'Sarah Chen',
      invitedAt: '2024-01-18',
      status: 'pending'
    }
  ];

  const roles = [
    {
      id: 'owner',
      name: 'Owner',
      description: 'Full access to all features and settings',
      icon: Crown,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Can manage team members and most settings',
      icon: Shield,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'member',
      name: 'Member',
      description: 'Can create and manage links, view analytics',
      icon: User,
      color: 'text-blue-600 bg-blue-100'
    }
  ];

  const getRoleIcon = (role) => {
    const roleConfig = roles.find(r => r.id === role);
    if (!roleConfig) return null;
    
    const Icon = roleConfig.icon;
    return (
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${roleConfig.color}`}>
        <Icon className="w-3 h-3" />
      </div>
    );
  };

  const getRoleName = (role) => {
    return roles.find(r => r.id === role)?.name || role;
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvite = () => {
    // Handle invite logic here
    console.log('Inviting:', inviteEmail, 'as', inviteRole);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('member');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600">Manage your team members and their permissions</p>
          </div>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Invite Member
          </button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{teamMembers.length}</div>
                <div className="text-sm text-gray-600">Total Members</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{teamMembers.filter(m => m.status === 'active').length}</div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Mail className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{pendingInvites.length}</div>
                <div className="text-sm text-gray-600">Pending Invites</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{teamMembers.filter(m => m.role === 'admin' || m.role === 'owner').length}</div>
                <div className="text-sm text-gray-600">Admins</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{member.name}</h4>
                        {getRoleIcon(member.role)}
                      </div>
                      <p className="text-gray-600">{member.email}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Last active {member.lastActive}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                      {getRoleName(member.role)}
                    </span>
                    {member.role !== 'owner' && (
                      <div className="flex items-center space-x-1">
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
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Pending Invites</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {pendingInvites.map((invite) => (
                <div key={invite.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{invite.email}</h4>
                        <div className="text-sm text-gray-500">
                          Invited by {invite.invitedBy} on {new Date(invite.invitedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        {getRoleName(invite.role)}
                      </span>
                      <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-full">
                        Pending
                      </span>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Resend
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Role Permissions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role.color}`}>
                    <role.icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{role.name}</h4>
                </div>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Team Member</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Team;