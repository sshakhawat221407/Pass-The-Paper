import React, { useState } from 'react';
import { User as UserType } from '../App';
import { Footer } from './Footer';
import { useMockData } from '../utils/MockDataContext';
import {
  User,
  Mail,
  Building,
  CreditCard,
  Shield,
  LogOut,
  CheckCircle,
  Clock,
  MessageSquare,
  Lock,
  Edit,
  Upload as UploadIcon,
  ShoppingBag,
  Wallet as WalletIcon,
  Award,
  Crown,
  ChevronRight,
  Star,
  Image as ImageIcon,
} from 'lucide-react';

type ProfileProps = {
  user: UserType;
  onLogout: () => void;
  onUserUpdate: (user: UserType) => void;
  onNavigateToHistory?: () => void;
  onNavigateToFeedback?: () => void;
  onNavigateToMembership?: () => void;
  onNavigateToUploads?: () => void;
};

export function Profile({ user, onLogout, onUserUpdate, onNavigateToHistory, onNavigateToFeedback, onNavigateToMembership, onNavigateToUploads }: ProfileProps) {
  const mockData = useMockData();
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showMembership, setShowMembership] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Edit profile states
  const [editName, setEditName] = useState(user.name);
  const [editUniversity, setEditUniversity] = useState(user.university);
  const [editStudentId, setEditStudentId] = useState(user.studentId || '');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>(user.profilePicture || '');
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string>(user.idCardImage || '');
  const [idCardUploading, setIdCardUploading] = useState(false);

  // Get counts for menu items
  const userUploads = mockData.resources.filter(r => r.uploadedBy === user.id);
  const userPurchases = mockData.getUserPurchases();
  const sellerRatingDetails = mockData.getSellerRatingDetails
    ? mockData.getSellerRatingDetails(user.id)
    : { rating: 0, total: 0 };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = () => {
    // Update user with new data including profile picture
    const updates: Partial<UserType> = {
      name: editName,
      university: editUniversity,
      studentId: editStudentId,
      isVerified: false, // Require re-verification after profile changes
      profilePicture: profilePicturePreview || user.profilePicture, // Save the profile picture
    };

    mockData.updateUser(user.id, updates);
    onUserUpdate({ ...user, ...updates });

    setMessage({ type: 'success', text: 'Profile updated! Awaiting admin verification.' });
    setTimeout(() => {
      setShowEditProfile(false);
      setMessage({ type: '', text: '' });
    }, 2000);
  };

  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdCardFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setIdCardPreview(base64);
        setIdCardUploading(true);
        mockData.uploadIdCard(user.id, base64);
        const updated = { ...user, idCardImage: base64, idCardStatus: 'pending' as const };
        onUserUpdate(updated);
        setTimeout(() => setIdCardUploading(false), 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) return;

    setMessage({ type: 'success', text: 'Thank you for your feedback!' });
    setFeedback('');
    setTimeout(() => {
      setShowFeedback(false);
      setMessage({ type: '', text: '' });
    }, 2000);
  };

  const handlePasswordReset = () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    // Update password in mock data
    mockData.updateUser(user.id, { password: newPassword });

    setMessage({ type: 'success', text: 'Password updated successfully!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setShowPasswordReset(false);
      setMessage({ type: '', text: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDF6F0' }}>
      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <h2 className="text-3xl font-bold mb-6">My Profile</h2>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden" 
                style={{ backgroundColor: '#E56E20' }}
              >
                {profilePicturePreview ? (
                  <img 
                    src={profilePicturePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2">
                  {user.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle size={16} />
                      Verified Student
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <Clock size={16} />
                      Verification Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowEditProfile(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Edit size={20} style={{ color: '#E56E20' }} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Building size={24} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">University</p>
                <p className="font-semibold">{user.university}</p>
              </div>
            </div>

            {user.studentId && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <CreditCard size={24} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Student ID</p>
                  <p className="font-semibold">{user.studentId}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail size={24} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FFF5F0' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E56E20' }}>
                <span className="text-white font-bold">💰</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Wallet Balance</p>
                <p className="font-bold text-xl" style={{ color: '#E56E20' }}>
                  ৳{user.walletBalance}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Seller Rating</p>
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={22}
                fill={i <= Math.round(sellerRatingDetails.rating) ? '#FCD34D' : 'none'}
                stroke={i <= Math.round(sellerRatingDetails.rating) ? '#FCD34D' : '#D1D5DB'} />
            ))}
            <span className="text-sm font-bold text-gray-700 ml-1">{sellerRatingDetails.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({sellerRatingDetails.total} reviews)</span>
          </div>
          {sellerRatingDetails.total === 0 && (
            <p className="text-xs text-gray-500 mt-2">Ratings appear here after buyers leave feedback on your resources.</p>
          )}
        </div>

        {/* ID Card Verification */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Student ID Verification</p>
            {user.idCardStatus === 'approved' && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <CheckCircle size={11} /> Verified
              </span>
            )}
            {user.idCardStatus === 'pending' && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Clock size={11} /> Pending Review
              </span>
            )}
            {user.idCardStatus === 'rejected' && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                ✕ Rejected — Re-upload
              </span>
            )}
          </div>

          {idCardPreview ? (
            <div className="relative inline-block">
              <img src={idCardPreview} alt="ID Card" className="h-28 rounded-xl border-2 border-gray-200 object-cover shadow-sm" />
              {user.idCardStatus !== 'approved' && (
                <label className="absolute bottom-2 right-2 bg-white rounded-lg p-1.5 shadow-md cursor-pointer hover:bg-gray-50">
                  <input type="file" accept="image/*" className="hidden" onChange={handleIdCardUpload} />
                  <Edit size={13} style={{ color: '#E56E20' }} />
                </label>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-orange-200 rounded-xl cursor-pointer hover:bg-orange-50 transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={handleIdCardUpload} />
              <span className="text-2xl mb-1">🪪</span>
              <span className="text-xs font-semibold text-gray-500">Upload your Student ID card</span>
              <span className="text-xs text-gray-400 mt-0.5">JPG, PNG (max 5MB)</span>
            </label>
          )}
          {!user.idCardImage && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2">
              ⚠️ Upload your student ID card to get verified. Unverified users cannot sell resources.
            </p>
          )}
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {/* My Uploads */}
          <button
            onClick={onNavigateToUploads}
            className="w-full bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4ECF7' }}>
              <UploadIcon size={24} style={{ color: '#E56E20' }} />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold">My Uploads</h4>
            </div>
            <span className="text-gray-500 font-semibold">{userUploads.length}</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          {/* Purchase History */}
          <button
            onClick={onNavigateToHistory}
            className="w-full bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
              <ShoppingBag size={24} className="text-orange-600" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold">Purchase History</h4>
            </div>
            <span className="text-gray-500 font-semibold">{userPurchases.length}</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          {/* Feedback */}
          <button
            onClick={() => {
              setShowFeedback(true);
              if (onNavigateToFeedback) onNavigateToFeedback();
            }}
            className="w-full bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <MessageSquare size={24} className="text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold">Feedback</h4>
              <p className="text-sm text-gray-500">View and manage your feedback</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          {/* Membership */}
          <button
            onClick={() => {
              setShowMembership(true);
              if (onNavigateToMembership) onNavigateToMembership();
            }}
            className="w-full bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
              <Crown size={24} style={{ color: '#E56E20' }} />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold">Membership</h4>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          {/* Privacy & Security */}
          <button
            onClick={() => setShowPasswordReset(true)}
            className="w-full bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Lock size={24} className="text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold">Privacy & Security</h4>
              <p className="text-sm text-gray-500">Change password and security settings</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <LogOut size={24} className="text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold text-red-600">Logout</h4>
              <p className="text-sm text-gray-500">Sign out of your account</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      <Footer />

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8">
            <h3 className="text-2xl font-bold mb-4">Send Feedback</h3>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {message.text}
              </div>
            )}

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or report issues..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowFeedback(false);
                  setFeedback('');
                  setMessage({ type: '', text: '' });
                }}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="flex-1 px-4 py-3 rounded-lg text-white font-semibold transition-colors"
                style={{ backgroundColor: '#E56E20' }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8">
            <h3 className="text-2xl font-bold mb-6">Change Password</h3>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordReset(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setMessage({ type: '', text: '' });
                }}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                className="flex-1 px-4 py-3 rounded-lg text-white font-semibold transition-colors"
                style={{ backgroundColor: '#E56E20' }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Edit Profile</h3>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {message.text}
              </div>
            )}

            <div className="space-y-6 mb-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 overflow-hidden" 
                  style={{ backgroundColor: '#E56E20' }}
                >
                  {profilePicturePreview ? (
                    <img 
                      src={profilePicturePreview} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    editName.charAt(0).toUpperCase()
                  )}
                </div>
                <input
                  id="profile-picture-input"
                  type="file"
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="profile-picture-input"
                  className="px-4 py-2 rounded-lg border-2 font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#E56E20', color: '#E56E20' }}
                >
                  Change Picture
                </label>
                <p className="text-xs text-gray-500 mt-2">Changing your profile requires admin verification</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                  required
                />
              </div>

              {/* University */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University *
                </label>
                <input
                  type="text"
                  value={editUniversity}
                  onChange={(e) => setEditUniversity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                  required
                />
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID *
                </label>
                <input
                  type="text"
                  value={editStudentId}
                  onChange={(e) => setEditStudentId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditProfile(false);
                  setEditName(user.name);
                  setEditUniversity(user.university);
                  setEditStudentId(user.studentId || '');
                  setProfilePicture(null);
                  setProfilePicturePreview(user.profilePicture || '');
                  setMessage({ type: '', text: '' });
                }}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditProfile}
                className="flex-1 px-4 py-3 rounded-lg text-white font-semibold transition-colors"
                style={{ backgroundColor: '#E56E20' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Membership Modal */}
      {showMembership && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b" style={{ backgroundColor: '#FDF6F0' }}>
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setShowMembership(false)}
                  className="p-1"
                >
                  ←
                </button>
                <h3 className="text-lg font-bold" style={{ color: '#E56E20' }}>Membership</h3>
                <div className="w-6"></div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upgrade to Member
                </h2>
                <p className="text-sm text-gray-600">
                  Get more benefits and save money
                </p>
              </div>
            </div>

            <div className="p-6">
              {/* Free Plan */}
              <div className="bg-white rounded-xl p-5 mb-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Free</h3>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">৳0</span>
                    <span className="text-sm text-gray-600">/month</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Browse resources</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Upload resources</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Basic reward points</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Standard support</span>
                  </div>
                </div>
              </div>

              {/* Member Plan */}
              <div className="bg-white rounded-xl p-5 mb-4 border-2 relative" style={{ borderColor: '#E56E20' }}>
                {/* Recommended Badge */}
                <div 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: '#E56E20' }}
                >
                  RECOMMENDED
                </div>

                <div className="flex items-center gap-2 mb-4 mt-2">
                  <Crown size={24} color="#E56E20" />
                  <h3 className="text-lg font-bold text-gray-900">Member</h3>
                  <div className="ml-auto text-right">
                    <span className="text-2xl font-bold" style={{ color: '#E56E20' }}>৳199</span>
                    <span className="text-sm text-gray-600">/month</span>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">All Free features</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">2x reward points on uploads</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">15% discount on all purchases</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Priority support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Exclusive resources access</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Monthly bonus points (500)</span>
                  </div>
                </div>

                <button
                  className="w-full py-3 rounded-lg text-white font-semibold transition-colors"
                  style={{ backgroundColor: '#E56E20' }}
                >
                  Upgrade to Member
                </button>
              </div>

              {/* Why Become a Member */}
              <div className="bg-gray-50 rounded-xl p-5 mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Why Become a Member?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Members get exclusive access to premium resources, earn double reward points on every upload, 
                  and enjoy priority support. Save 15% on all purchases and receive 500 bonus points every month!
                </p>
                <p className="text-xs text-gray-500 text-center">
                  Pass The Paper © 2024<br />
                  Academic Resource Marketplace for Verified Students
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
