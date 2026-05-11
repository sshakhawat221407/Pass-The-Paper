import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { useMockData } from '../utils/MockDataContext';
import { Shield, Users, FileText, CheckCircle, XCircle, Clock, LogOut, Search, Ban, Trash2, AlertTriangle, UserX, UserCheck } from 'lucide-react';

type AdminDashboardProps = {
  user: User;
  onLogout: () => void;
};

type PendingUser = {
  id: string;
  email: string;
  name: string;
  university: string;
  studentId: string;
  isVerified: boolean;
  createdAt: string;
};

type PendingFile = {
  id: string;
  title: string;
  description: string;
  category: string;
  uploadedBy: string;
  uploaderName: string;
  status: 'pending' | 'approved' | 'rejected';
  fileUrl: string;
  createdAt: string;
};

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const mockData = useMockData();
  const [activeTab, setActiveTab] = useState<'users' | 'files' | 'manage'>('users');
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingFile, setViewingFile] = useState<PendingFile | null>(null);
  const [banningUserId, setBanningUserId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    fetchPendingData();
  }, [activeTab, mockData.users, mockData.resources]);

  const fetchPendingData = () => {
    setLoading(true);
    if (activeTab === 'users') {
      const users = mockData.getPendingUsers().map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        university: u.university,
        studentId: u.studentId || '',
        isVerified: u.isVerified,
        createdAt: new Date().toISOString(),
      }));
      setPendingUsers(users);
    } else {
      const files = mockData.getPendingFiles().map(f => ({
        id: f.id,
        title: f.title,
        description: f.description,
        category: f.category,
        uploadedBy: f.uploadedBy,
        uploaderName: f.uploaderName,
        status: f.status,
        fileUrl: f.fileUrl,
        createdAt: f.createdAt,
      }));
      setPendingFiles(files);
    }
    setLoading(false);
  };

  const handleVerifyUser = (userId: string, approve: boolean) => {
    mockData.verifyUser(userId, approve);
    setPendingUsers(pendingUsers.filter(u => u.id !== userId));
  };

  const handleApproveFile = (fileId: string, approve: boolean) => {
    mockData.approveFile(fileId, approve);
    setPendingFiles(pendingFiles.map(f => 
      f.id === fileId 
        ? { ...f, status: approve ? 'approved' : 'rejected' } 
        : f
    ));
  };

  const filteredUsers = pendingUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFiles = pendingFiles.filter(f =>
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.uploaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0D7C7' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E56E20' }}>
                <Shield size={20} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#E56E20' }}>
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500">Pass The Paper</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: '#E56E20' }}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-b-2 text-[#E56E20]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'users' ? { borderBottomColor: '#E56E20' } : {}}
            >
              <Users size={20} />
              User Verification
              {pendingUsers.filter(u => !u.isVerified).length > 0 && (
                <span className="ml-2 px-2 py-1 rounded-full text-xs text-white" style={{ backgroundColor: '#E56E20' }}>
                  {pendingUsers.filter(u => !u.isVerified).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'files'
                  ? 'border-b-2 text-[#E56E20]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'files' ? { borderBottomColor: '#E56E20' } : {}}
            >
              <FileText size={20} />
              File Approval
              {pendingFiles.filter(f => f.status === 'pending').length > 0 && (
                <span className="ml-2 px-2 py-1 rounded-full text-xs text-white" style={{ backgroundColor: '#E56E20' }}>
                  {pendingFiles.filter(f => f.status === 'pending').length}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={activeTab === 'users' ? 'Search users...' : 'Search files...'}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
              />
            </div>
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
            {activeTab === 'users' && (
              <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <Users size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No pending user verifications</p>
                  </div>
                ) : (
                  filteredUsers.map((pendingUser) => (
                    <div key={pendingUser.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users size={24} className="text-gray-500" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{pendingUser.name}</h3>
                              <p className="text-sm text-gray-500">{pendingUser.email}</p>
                            </div>
                            {!pendingUser.isVerified && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                                <Clock size={14} />
                                Pending
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">University:</span>
                              <p className="font-medium">{pendingUser.university}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Student ID:</span>
                              <p className="font-medium">{pendingUser.studentId}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Registered:</span>
                              <p className="font-medium">{new Date(pendingUser.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        {!pendingUser.isVerified && (
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleVerifyUser(pendingUser.id, true)}
                              className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                              style={{ backgroundColor: '#10B981' }}
                            >
                              <CheckCircle size={18} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerifyUser(pendingUser.id, false)}
                              className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                              style={{ backgroundColor: '#EF4444' }}
                            >
                              <XCircle size={18} />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'files' && (
              <div className="space-y-4">
                {filteredFiles.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No pending file approvals</p>
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
                            <div>
                              <h3 className="font-semibold text-lg">{file.title}</h3>
                              <p className="text-sm text-gray-500">Uploaded by {file.uploaderName}</p>
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
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Category:</span>
                              <p className="font-medium">{file.category}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Uploaded:</span>
                              <p className="font-medium">{new Date(file.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <a
                                href={file.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:underline"
                                style={{ color: '#E56E20' }}
                              >
                                View File →
                              </a>
                            </div>
                          </div>
                        </div>
                        {file.status === 'pending' && (
                          <div className="flex gap-2 ml-4">
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
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
