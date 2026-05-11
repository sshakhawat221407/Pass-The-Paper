import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { useMockData } from '../utils/MockDataContext';
import { Shield, Users, FileText, CheckCircle, XCircle, Clock, LogOut, Search, Ban, Trash2, AlertTriangle, UserX, UserCheck, Settings, MessageSquare, Wallet, ArrowDownRight, ArrowUpRight, CreditCard, Image, Crown, Filter, Eye, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type AdminDashboardProps = {
  user: User;
  onLogout: () => void;
};

export function AdminDashboardEnhanced({ user, onLogout }: AdminDashboardProps) {
  const mockData = useMockData();
  const [activeTab, setActiveTab] = useState<'users' | 'files' | 'manage' | 'appeals' | 'transactions' | 'logs'>('users');
  const [loading, setLoading] = useState(false);
  const allTransactions = mockData.getAllTransactions ? mockData.getAllTransactions() : mockData.transactions || [];
  const allWithdrawals = mockData.withdrawals || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [banningUserId, setBanningUserId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');
  const [verificationRemovalUserId, setVerificationRemovalUserId] = useState<string | null>(null);
  const [verificationRemovalReason, setVerificationRemovalReason] = useState('');
  const [reviewingAppealId, setReviewingAppealId] = useState<string | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [selectedUserForVerification, setSelectedUserForVerification] = useState<any | null>(null);

  // Filter states for manage tab
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const [filterBanned, setFilterBanned] = useState<'all' | 'banned' | 'active'>('all');
  const [filterMembership, setFilterMembership] = useState<'all' | 'free' | 'premium_monthly' | 'premium_yearly'>('all');
  const [filterLogType, setFilterLogType] = useState<'all' | 'user_action' | 'admin_action' | 'transaction' | 'verification' | 'system'>('all');

  const pendingUsers = mockData.getPendingUsers();
  // Users with pending ID card are shown in the User Verification tab too
  const usersWithPendingId = mockData.getAllUsers().filter(u => !u.isAdmin && u.idCardStatus === 'pending');
  const allUsers = mockData.getAllUsers().filter(u => !u.isAdmin);
  const allFiles = mockData.getPendingFiles();
  const allAppeals = mockData.getAllAppeals();
  const allLogs = mockData.getAllLogs ? mockData.getAllLogs() : [];

  const handleVerifyUser = (userId: string, approve: boolean) => {
    mockData.verifyUser(userId, approve);
    toast.success(approve ? 'User approved successfully' : 'User rejected');
  };

  const handleApproveFile = (fileId: string, approve: boolean) => {
    mockData.approveFile(fileId, approve);
    toast.success(approve ? 'File approved successfully' : 'File rejected');
  };

  const handleDeleteResource = (resourceId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      mockData.deleteResource(resourceId);
      toast.success('Resource deleted successfully');
    }
  };

  const handleBanUser = (userId: string) => {
    if (!banReason.trim()) {
      toast.error('Please provide a reason for banning');
      return;
    }
    mockData.banUser(userId, banReason);
    setBanningUserId(null);
    setBanReason('');
    toast.success('User banned successfully');
  };

  const handleUnbanUser = (userId: string) => {
    mockData.unbanUser(userId);
    toast.success('User unbanned successfully');
  };

  const handleRemoveVerification = (userId: string) => {
    if (!verificationRemovalReason) {
      toast.error('Please select a reason for removing verification');
      return;
    }

    mockData.removeUserVerification(userId, verificationRemovalReason);
    setVerificationRemovalUserId(null);
    setVerificationRemovalReason('');
    toast.success('User verification removed');
  };

  const handleReviewAppeal = (appealId: string, approve: boolean) => {
    if (!adminResponse.trim() && !approve) {
      toast.error('Please provide a response when rejecting an appeal');
      return;
    }
    mockData.reviewAppeal(appealId, approve, adminResponse || undefined);
    setReviewingAppealId(null);
    setAdminResponse('');
    toast.success(approve ? 'Appeal approved and user unbanned' : 'Appeal rejected');
  };

  const filteredPendingUsers = pendingUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Users tab now shows pending ID verifications + unverified users
  const verificationTabUsers = allUsers.filter(u => u.idCardImage || !u.isVerified);

  const filteredAllUsers = allUsers
    .filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.university.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVerified = filterVerified === 'all' || 
        (filterVerified === 'verified' && u.isVerified) ||
        (filterVerified === 'unverified' && !u.isVerified);
      const matchesBanned = filterBanned === 'all' ||
        (filterBanned === 'banned' && u.isBanned) ||
        (filterBanned === 'active' && !u.isBanned);
      const matchesMembership = filterMembership === 'all' || u.membershipType === filterMembership;
      return matchesSearch && matchesVerified && matchesBanned && matchesMembership;
    });

  const filteredFiles = allFiles.filter(f =>
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.uploaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAppeals = allAppeals.filter(a =>
    a.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogs = allLogs.filter((l: any) => {
    const matchesSearch = !searchTerm || 
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.targetUserName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterLogType === 'all' || l.type === filterLogType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF6F0' }}>
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #E56E20, #f7a35c, #E56E20)' }} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #E56E20, #f7a35c)' }}>
                <Shield size={20} color="white" />
              </div>
              <div>
                <h1 className="text-lg font-bold" style={{ color: '#E56E20' }}>
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-400">Pass The Paper · Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#E56E20' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #E56E20, #f7a35c)' }}
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Users', value: allUsers.length, icon: '👥', color: '#3B82F6' },
            { label: 'Pending Reviews', value: pendingUsers.length + allFiles.filter((f: any) => f.status === 'pending').length + allUsers.filter((u: any) => u.idCardStatus === 'pending').length, icon: '⏳', color: '#F59E0B' },
            { label: 'Pending Txns', value: allTransactions.filter((t: any) => t.status === 'pending' && (t.type === 'add' || t.type === 'membership')).length + allWithdrawals.filter((w: any) => w.status === 'pending').length, icon: '💰', color: '#10B981' },
            { label: 'Open Appeals', value: allAppeals.filter((a: any) => a.status === 'pending').length, icon: '📋', color: '#8B5CF6' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{stat.icon}</span>
                <span className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
              </div>
              <p className="text-xs font-medium text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex p-2 gap-1 border-b border-gray-100 overflow-x-auto">
            {[
              { id: 'users', label: 'Verification', icon: Users, badge: usersWithPendingId.length + pendingUsers.length },
              { id: 'files', label: 'Resources', icon: FileText, badge: allFiles.filter((f: any) => f.status === 'pending').length },
              { id: 'manage', label: 'User Mgmt', icon: Settings, badge: 0 },
              { id: 'transactions', label: 'Transactions', icon: Wallet, badge: allTransactions.filter((t: any) => t.status === 'pending' && (t.type === 'add' || t.type === 'membership')).length + allWithdrawals.filter((w: any) => w.status === 'pending').length },
              { id: 'appeals', label: 'Appeals', icon: MessageSquare, badge: allAppeals.filter((a: any) => a.status === 'pending').length },
              { id: 'logs', label: 'Logs', icon: Activity, badge: 0 },
            ].map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === id ? 'text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                }`}
                style={activeTab === id ? { background: 'linear-gradient(135deg, #E56E20, #f7a35c)' } : {}}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
                {badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeTab === id ? 'bg-white/30 text-white' : 'bg-orange-100 text-orange-600'}`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="p-6 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); }}
                placeholder={
                  activeTab === 'users' ? 'Search users for verification...' :
                  activeTab === 'files' ? 'Search resources...' :
                  activeTab === 'manage' ? 'Search all users...' :
                  activeTab === 'transactions' ? 'Search transactions...' :
                  activeTab === 'logs' ? 'Search logs...' :
                  'Search appeals...'
                }
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
              />
            </div>
            {/* Filter options for manage tab */}
            {activeTab === 'manage' && (
              <div className="flex flex-wrap gap-3 mt-3">
                <select value={filterVerified} onChange={e => setFilterVerified(e.target.value as any)}
                  className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E56E20] bg-white">
                  <option value="all">All Verification</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
                <select value={filterBanned} onChange={e => setFilterBanned(e.target.value as any)}
                  className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E56E20] bg-white">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="banned">Banned</option>
                </select>
                <select value={filterMembership} onChange={e => setFilterMembership(e.target.value as any)}
                  className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E56E20] bg-white">
                  <option value="all">All Plans</option>
                  <option value="free">Free</option>
                  <option value="premium_monthly">Premium Monthly</option>
                  <option value="premium_yearly">Premium Yearly</option>
                </select>
                <span className="text-xs text-gray-400 self-center">{filteredAllUsers.length} user{filteredAllUsers.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            {/* Filter for logs tab */}
            {activeTab === 'logs' && (
              <div className="flex flex-wrap gap-3 mt-3">
                {(['all', 'user_action', 'admin_action', 'transaction', 'verification', 'system'] as const).map(type => (
                  <button key={type} onClick={() => setFilterLogType(type)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${filterLogType === type ? 'text-white border-transparent' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    style={filterLogType === type ? { background: 'linear-gradient(135deg, #E56E20, #f7a35c)' } : {}}>
                    {type === 'all' ? 'All' : type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#E56E20' }}></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* User Verification Tab - shows all users with ID card submissions */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                {verificationTabUsers.filter(u =>
                  u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  u.university.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <Users size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No users pending verification</p>
                  </div>
                ) : (
                  verificationTabUsers
                    .filter(u =>
                      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      u.university.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((pendingUser: any) => (
                      <div key={pendingUser.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                        {/* Header row - clickable to expand */}
                        <div
                          className="flex items-start justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setSelectedUserForVerification(selectedUserForVerification?.id === pendingUser.id ? null : pendingUser)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {pendingUser.profilePicture
                                  ? <img src={pendingUser.profilePicture} alt="profile" className="w-full h-full object-cover" />
                                  : <Users size={24} className="text-gray-500" />}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{pendingUser.name}</h3>
                                <p className="text-sm text-gray-500">{pendingUser.email}</p>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                {pendingUser.idCardStatus === 'pending' && (
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 flex items-center gap-1">
                                    <Clock size={12} /> ID Pending
                                  </span>
                                )}
                                {pendingUser.isVerified
                                  ? <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle size={12} /> Verified</span>
                                  : <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock size={12} /> Unverified</span>
                                }
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div><span className="text-gray-500">University:</span><p className="font-medium">{pendingUser.university}</p></div>
                              <div><span className="text-gray-500">Student ID:</span><p className="font-medium">{pendingUser.studentId || 'N/A'}</p></div>
                              <div><span className="text-gray-500">ID Card Status:</span><p className="font-medium capitalize">{pendingUser.idCardStatus || 'none'}</p></div>
                            </div>
                          </div>
                          <div className="ml-4 text-gray-400">
                            {selectedUserForVerification?.id === pendingUser.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>

                        {/* Expanded section with ID card and actions */}
                        {selectedUserForVerification?.id === pendingUser.id && (
                          <div className="border-t border-gray-100 p-6 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* User details */}
                              <div>
                                <h4 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wide">User Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between"><span className="text-gray-500">Full Name:</span><span className="font-medium">{pendingUser.name}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Email:</span><span className="font-medium">{pendingUser.email}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">University:</span><span className="font-medium">{pendingUser.university}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Student ID:</span><span className="font-medium">{pendingUser.studentId || 'N/A'}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Membership:</span><span className="font-medium capitalize">{(pendingUser.membershipType || 'free').replace('_', ' ')}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Wallet:</span><span className="font-medium">৳{(pendingUser.walletBalance || 0).toFixed(2)}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Points:</span><span className="font-medium">{pendingUser.rewardPoints || 0}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Registered:</span><span className="font-medium">{pendingUser.createdAt ? new Date(pendingUser.createdAt).toLocaleDateString() : 'N/A'}</span></div>
                                </div>
                              </div>
                              {/* ID Card */}
                              <div>
                                <h4 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wide">ID Card</h4>
                                {pendingUser.idCardImage ? (
                                  <div>
                                    <img
                                      src={pendingUser.idCardImage}
                                      alt="Student ID Card"
                                      className="w-full max-h-48 object-contain rounded-xl border border-gray-200 bg-white shadow-sm mb-4"
                                    />
                                    {pendingUser.idCardStatus === 'pending' && (
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => { mockData.approveIdCard(pendingUser.id); setSelectedUserForVerification(null); toast.success('ID card approved — user is now verified!'); }}
                                          className="flex-1 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors hover:opacity-90"
                                          style={{ backgroundColor: '#10B981' }}
                                        >
                                          <CheckCircle size={18} /> Approve & Verify
                                        </button>
                                        <button
                                          onClick={() => { mockData.rejectIdCard(pendingUser.id); setSelectedUserForVerification(null); toast.success('ID card rejected'); }}
                                          className="flex-1 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors hover:opacity-90"
                                          style={{ backgroundColor: '#EF4444' }}
                                        >
                                          <XCircle size={18} /> Reject
                                        </button>
                                      </div>
                                    )}
                                    {pendingUser.idCardStatus !== 'pending' && (
                                      <div className={`text-center py-2 rounded-lg text-sm font-semibold ${pendingUser.idCardStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                        ID Card {pendingUser.idCardStatus}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
                                    <Image size={32} className="mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">No ID card submitted</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            )}

            {/* Resources Management Tab */}
            {activeTab === 'files' && (
              <div className="space-y-4">
                {filteredFiles.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No resources found</p>
                  </div>
                ) : (
                  filteredFiles.map((file) => (
                    <div key={file.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4ECF7' }}>
                              <FileText size={24} style={{ color: '#E56E20' }} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{file.title}</h3>
                              <p className="text-sm text-gray-500">Uploaded by {file.uploaderName} · {new Date(file.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                              file.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              file.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {file.status === 'pending' && <Clock size={14} />}
                              {file.status === 'approved' && <CheckCircle size={14} />}
                              {file.status === 'rejected' && <XCircle size={14} />}
                              {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{file.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                            <div><span className="text-gray-500 block">Category</span><p className="font-medium">{file.category}</p></div>
                            <div><span className="text-gray-500 block">Department</span><p className="font-medium">{file.department || 'N/A'}</p></div>
                            <div><span className="text-gray-500 block">Course</span><p className="font-medium">{file.course || 'N/A'}</p></div>
                            <div><span className="text-gray-500 block">Semester</span><p className="font-medium">{file.semester || 'N/A'}</p></div>
                            <div><span className="text-gray-500 block">Price</span><p className="font-medium">{file.price} {file.priceType === 'money' ? 'BDT' : 'Points'}</p></div>
                            <div><span className="text-gray-500 block">Downloads</span><p className="font-medium">{file.downloads}</p></div>
                            <div><span className="text-gray-500 block">Rating</span><p className="font-medium">{file.rating > 0 ? `${file.rating} ★` : 'No ratings'}</p></div>
                          </div>
                          {/* View File button */}
                          {file.fileUrl && file.fileUrl !== '#' ? (
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:opacity-90"
                              style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}
                            >
                              <Eye size={16} /> View File
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed">
                              <Eye size={16} /> File URL not available
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {file.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveFile(file.id, true)}
                                className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                                style={{ backgroundColor: '#10B981' }}
                              >
                                <CheckCircle size={18} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleApproveFile(file.id, false)}
                                className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                                style={{ backgroundColor: '#EF4444' }}
                              >
                                <XCircle size={18} />
                                Reject
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => handleDeleteResource(file.id, file.title)}
                            className="px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors hover:opacity-90"
                            style={{ backgroundColor: '#EF4444' }}
                          >
                            <Trash2 size={18} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'manage' && (
              <div className="space-y-4">
                {filteredAllUsers.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <Users size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No users found</p>
                  </div>
                ) : (
                  filteredAllUsers.map((managedUser) => (
                    <div key={managedUser.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              managedUser.isBanned ? 'bg-red-100' : 'bg-gray-200'
                            }`}>
                              {managedUser.isBanned ? (
                                <UserX size={24} className="text-red-600" />
                              ) : (
                                <Users size={24} className="text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{managedUser.name}</h3>
                              <p className="text-sm text-gray-500">{managedUser.email}</p>
                            </div>
                            <div className="flex gap-2">
                              {managedUser.isVerified ? (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                                  <CheckCircle size={14} />
                                  Verified
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                                  <Clock size={14} />
                                  Unverified
                                </span>
                              )}
                              {managedUser.isBanned && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                                  <Ban size={14} />
                                  Banned
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">University:</span>
                              <p className="font-medium">{managedUser.university}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Student ID:</span>
                              <p className="font-medium">{managedUser.studentId}</p>
                            </div>
                          </div>
                          {managedUser.isBanned && managedUser.banReason && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                              <p className="text-xs text-red-800">
                                <strong>Ban Reason:</strong> {managedUser.banReason}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {managedUser.isVerified && (
                            <button
                              onClick={() => setVerificationRemovalUserId(managedUser.id)}
                              className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                              style={{ backgroundColor: '#F59E0B' }}
                            >
                              <XCircle size={18} />
                              Remove Verification
                            </button>
                          )}
                          {managedUser.isBanned ? (
                            <button
                              onClick={() => handleUnbanUser(managedUser.id)}
                              className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                              style={{ backgroundColor: '#10B981' }}
                            >
                              <UserCheck size={18} />
                              Unban User
                            </button>
                          ) : (
                            <button
                              onClick={() => setBanningUserId(managedUser.id)}
                              className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                              style={{ backgroundColor: '#EF4444' }}
                            >
                              <Ban size={18} />
                              Ban User
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Appeals Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                {/* Pending BDT Top-ups */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <ArrowUpRight size={18} style={{ color: '#10B981' }} />
                    <h3 className="text-base font-bold text-gray-900">BDT Top-up Requests</h3>
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      {allTransactions.filter((t: any) => t.type === 'add' && t.status === 'pending').length} pending
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {allTransactions.filter((t: any) => t.type === 'add').length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">No top-up transactions</div>
                    ) : allTransactions.filter((t: any) => t.type === 'add').map((t: any) => {
                      const txUser = allUsers.find((u: any) => u.id === t.userId);
                      return (
                        <div key={t.id} className="flex items-center gap-4 px-5 py-4">
                          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                            <ArrowUpRight size={18} className="text-green-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{txUser?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-400">
                              {t.description} · {t.paymentPhone || 'No phone'} · TrxID: {t.transactionNumber || 'N/A'} · {new Date(t.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-base font-bold text-green-600 flex-shrink-0">৳{t.amount}</p>
                          {t.status === 'pending' ? (
                            <div className="flex gap-2 flex-shrink-0">
                              <button onClick={() => { mockData.approveTransaction && mockData.approveTransaction(t.id); }}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 transition-all hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                                <CheckCircle size={13} /> Approve
                              </button>
                              <button onClick={() => { mockData.rejectTransaction && mockData.rejectTransaction(t.id); }}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600 flex items-center gap-1">
                                <XCircle size={13} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${t.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {t.status}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Membership Requests */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Crown size={18} style={{ color: '#8B5CF6' }} />
                    <h3 className="text-base font-bold text-gray-900">Membership Requests</h3>
                    <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                      {allTransactions.filter((t: any) => t.type === 'membership' && t.status === 'pending').length} pending
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {allTransactions.filter((t: any) => t.type === 'membership').length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">No membership requests</div>
                    ) : allTransactions.filter((t: any) => t.type === 'membership').map((t: any) => {
                      const txUser = allUsers.find((u: any) => u.id === t.userId);
                      const planLabel = t.membershipPlan === 'premium_yearly' ? 'Premium Yearly' : 'Premium Monthly';
                      return (
                        <div key={t.id} className="flex items-center gap-4 px-5 py-4">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                            <Crown size={18} className="text-purple-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{txUser?.name || 'Unknown'} - {planLabel}</p>
                            <p className="text-xs text-gray-400">
                              {t.paymentMethod} · {t.paymentPhone || 'wallet'} · TrxID: {t.transactionNumber || 'N/A'} · {new Date(t.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-base font-bold text-purple-600 flex-shrink-0">BDT {t.amount}</p>
                          {t.status === 'pending' ? (
                            <div className="flex gap-2 flex-shrink-0">
                              <button onClick={() => { mockData.approveTransaction && mockData.approveTransaction(t.id); }}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 transition-all hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                                <CheckCircle size={13} /> Approve
                              </button>
                              <button onClick={() => { mockData.rejectTransaction && mockData.rejectTransaction(t.id); }}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600 flex items-center gap-1">
                                <XCircle size={13} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${t.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {t.status}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Withdrawal Requests */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <ArrowDownRight size={18} style={{ color: '#EF4444' }} />
                    <h3 className="text-base font-bold text-gray-900">Withdrawal Requests</h3>
                    <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                      {allWithdrawals.filter((w: any) => w.status === 'pending').length} pending
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {allWithdrawals.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">No withdrawal requests</div>
                    ) : allWithdrawals.map((w: any) => {
                      const wUser = allUsers.find((u: any) => u.id === w.userId);
                      return (
                        <div key={w.id} className="flex items-center gap-4 px-5 py-4">
                          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                            <CreditCard size={18} className="text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{wUser?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-400">{w.method} · {w.accountNumber} · {new Date(w.createdAt).toLocaleDateString()}</p>
                          </div>
                          <p className="text-base font-bold text-red-500 flex-shrink-0">৳{w.amount}</p>
                          {w.status === 'pending' ? (
                            <div className="flex gap-2 flex-shrink-0">
                              <button onClick={() => mockData.approveWithdrawal(w.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 transition-all hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                                <CheckCircle size={13} /> Approve
                              </button>
                              <button onClick={() => mockData.rejectWithdrawal(w.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600 flex items-center gap-1">
                                <XCircle size={13} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${w.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {w.status}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ID Card Verification moved to the ID Cards tab */}
                {false && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Image size={18} style={{ color: '#8B5CF6' }} />
                    <h3 className="text-base font-bold text-gray-900">ID Card Verifications</h3>
                    <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                      {allUsers.filter((u: any) => u.idCardStatus === 'pending').length} pending
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {allUsers.filter((u: any) => u.idCardImage).length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">No ID card submissions</div>
                    ) : allUsers.filter((u: any) => u.idCardImage).map((u: any) => (
                      <div key={u.id} className="flex items-start gap-4 px-5 py-4">
                        <img src={u.idCardImage} alt="ID Card" className="w-20 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email} · {u.studentId}</p>
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold ${
                            u.idCardStatus === 'approved' ? 'bg-green-100 text-green-700' :
                            u.idCardStatus === 'rejected' ? 'bg-red-100 text-red-600' :
                            'bg-amber-100 text-amber-700'}`}>
                            {u.idCardStatus}
                          </span>
                        </div>
                        {u.idCardStatus === 'pending' && (
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => mockData.approveIdCard(u.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1"
                              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                              <CheckCircle size={13} /> Approve
                            </button>
                            <button onClick={() => mockData.rejectIdCard(u.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-500 flex items-center gap-1">
                              <XCircle size={13} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                )}
              </div>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <Activity size={18} style={{ color: '#E56E20' }} />
                  <h3 className="text-base font-bold text-gray-900">System Logs</h3>
                  <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
                    {filteredLogs.length} entries
                  </span>
                </div>
                <div className="divide-y divide-gray-50">
                  {filteredLogs.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Activity size={40} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No logs yet</p>
                    </div>
                  ) : (
                    filteredLogs.map((log: any) => {
                      const typeColors: Record<string, string> = {
                        user_action: 'bg-blue-100 text-blue-700',
                        admin_action: 'bg-orange-100 text-orange-700',
                        transaction: 'bg-green-100 text-green-700',
                        verification: 'bg-purple-100 text-purple-700',
                        system: 'bg-gray-100 text-gray-600',
                      };
                      return (
                        <div key={log.id} className="flex items-start gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                          <div className="flex-shrink-0 mt-0.5">
                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${typeColors[log.type] || 'bg-gray-100 text-gray-600'}`}>
                              {log.type.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800">{log.action.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{log.description}</p>
                            {(log.userName || log.targetUserName) && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {log.userName && <span>By: <strong>{log.userName}</strong></span>}
                                {log.userName && log.targetUserName && ' → '}
                                {log.targetUserName && <span>Target: <strong>{log.targetUserName}</strong></span>}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            <p className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'appeals' && (
              <div className="space-y-4">
                {filteredAppeals.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No appeals found</p>
                  </div>
                ) : (
                  filteredAppeals.map((appeal) => (
                    <div key={appeal.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users size={24} className="text-gray-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{appeal.userName}</h3>
                              <p className="text-sm text-gray-500">{appeal.userEmail}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                              appeal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              appeal.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appeal.status === 'pending' && <Clock size={14} />}
                              {appeal.status === 'approved' && <CheckCircle size={14} />}
                              {appeal.status === 'rejected' && <XCircle size={14} />}
                              {appeal.status.charAt(0).toUpperCase() + appeal.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3"><strong>Reason:</strong> {appeal.reason}</p>
                          {appeal.adminResponse && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                              <p className="text-xs text-blue-800">
                                <strong>Admin Response:</strong> {appeal.adminResponse}
                              </p>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Status:</span>
                              <p className="font-medium">{appeal.status.charAt(0).toUpperCase() + appeal.status.slice(1)}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Submitted:</span>
                              <p className="font-medium">{new Date(appeal.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {appeal.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => setReviewingAppealId(appeal.id)}
                                className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                                style={{ backgroundColor: '#E56E20' }}
                              >
                                <MessageSquare size={18} />
                                Respond
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Ban User Modal */}
      {banningUserId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setBanningUserId(null);
            setBanReason('');
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} color="#EF4444" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Ban User</h3>
                <p className="text-sm text-gray-500">Provide a reason for banning this user</p>
              </div>
            </div>

            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Enter ban reason..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-sm resize-none"
              rows={4}
            />

            <div className="flex gap-2">
              <button
                onClick={() => handleBanUser(banningUserId)}
                className="flex-1 px-4 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#EF4444' }}
              >
                Ban User
              </button>
              <button
                onClick={() => {
                  setBanningUserId(null);
                  setBanReason('');
                }}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Verification Modal */}
      {verificationRemovalUserId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setVerificationRemovalUserId(null);
            setVerificationRemovalReason('');
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle size={24} color="#F59E0B" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Remove Verification</h3>
                <p className="text-sm text-gray-500">Select why this user must verify again</p>
              </div>
            </div>

            <select
              value={verificationRemovalReason}
              onChange={(e) => setVerificationRemovalReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-sm bg-white"
            >
              <option value="">Select a reason</option>
              <option value="ID card information does not match the profile">ID card information does not match the profile</option>
              <option value="Submitted ID card is expired or unclear">Submitted ID card is expired or unclear</option>
              <option value="Student information needs re-checking">Student information needs re-checking</option>
              <option value="Policy violation requires fresh verification">Policy violation requires fresh verification</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => handleRemoveVerification(verificationRemovalUserId)}
                className="flex-1 px-4 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#F59E0B' }}
              >
                Remove
              </button>
              <button
                onClick={() => {
                  setVerificationRemovalUserId(null);
                  setVerificationRemovalReason('');
                }}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Respond to Appeal Modal */}
      {reviewingAppealId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setReviewingAppealId(null);
            setAdminResponse('');
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} color="#EF4444" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Respond to Appeal</h3>
                <p className="text-sm text-gray-500">Provide a response to this appeal</p>
              </div>
            </div>

            <textarea
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder="Enter response..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-sm resize-none"
              rows={4}
            />

            <div className="flex gap-2">
              <button
                onClick={() => handleReviewAppeal(reviewingAppealId, true)}
                className="flex-1 px-4 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#E56E20' }}
              >
                Approve
              </button>
              <button
                onClick={() => handleReviewAppeal(reviewingAppealId, false)}
                className="flex-1 px-4 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#EF4444' }}
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setReviewingAppealId(null);
                  setAdminResponse('');
                }}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
