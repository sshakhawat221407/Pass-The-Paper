import React, { useState, useEffect } from 'react';
import { AlertTriangle, Ban, LogOut, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useMockData } from '../../utils/MockDataContext';
import { User } from '../../App';
import { toast } from 'sonner@2.0.3';

type BannedUserScreenProps = {
  user: User;
  onLogout: () => void;
};

export function BannedUserScreen({ user, onLogout }: BannedUserScreenProps) {
  const mockData = useMockData();
  const [appealReason, setAppealReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [appeals, setAppeals] = useState<any[]>([]);

  useEffect(() => {
    // Load existing appeals
    setAppeals(mockData.getAppeals());
  }, []);

  const handleSubmitAppeal = async () => {
    if (!appealReason.trim()) {
      toast.error('Please provide a reason for your appeal');
      return;
    }

    setSubmitting(true);
    try {
      mockData.addAppeal({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        reason: appealReason,
      });

      toast.success('Appeal submitted successfully. Admin will review it soon.');
      setAppealReason('');
      
      // Refresh appeals list
      setTimeout(() => {
        setAppeals(mockData.getAppeals());
      }, 100);
    } catch (error) {
      toast.error('Failed to submit appeal');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingAppeal = appeals.find(a => a.status === 'pending');
  const hasSubmittedAppeal = appeals.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F0D7C7' }}>
      <div className="max-w-2xl w-full">
        {/* Ban Notice Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Ban size={32} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Banned</h1>
              <p className="text-gray-600">
                Your account has been temporarily suspended by the administrator.
              </p>
            </div>
          </div>

          {/* Ban Information */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Ban Reason</h3>
                <p className="text-red-800">{user.banReason}</p>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <span className="text-gray-500 block mb-1">Account Name</span>
              <p className="font-medium text-gray-900">{user.name}</p>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Email</span>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">University</span>
              <p className="font-medium text-gray-900">{user.university}</p>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Student ID</span>
              <p className="font-medium text-gray-900">{user.studentId}</p>
            </div>
          </div>

          {/* Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> While your account is banned, you cannot access any features of Pass The Paper including browsing, uploading, purchasing, or using your wallet. You may submit an appeal below if you believe this ban was made in error.
            </p>
          </div>
        </div>

        {/* Appeal Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4ECF7' }}>
              <FileText size={24} style={{ color: '#E56E20' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Submit an Appeal</h2>
              <p className="text-sm text-gray-600">Explain why you believe this ban should be reviewed</p>
            </div>
          </div>

          {/* Previous Appeals */}
          {hasSubmittedAppeal && (
            <div className="mb-6 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Your Appeal History</h3>
              {appeals.map((appeal) => (
                <div 
                  key={appeal.id}
                  className={`border rounded-lg p-4 ${
                    appeal.status === 'pending' ? 'border-yellow-300 bg-yellow-50' :
                    appeal.status === 'approved' ? 'border-green-300 bg-green-50' :
                    'border-red-300 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      {new Date(appeal.createdAt).toLocaleString()}
                    </span>
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
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Your Appeal:</strong> {appeal.reason}
                  </p>
                  {appeal.adminResponse && (
                    <p className="text-sm text-gray-700">
                      <strong>Admin Response:</strong> {appeal.adminResponse}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Appeal Form */}
          {pendingAppeal ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Appeal Under Review</h3>
                  <p className="text-yellow-800 text-sm">
                    Your appeal is currently being reviewed by our administrators. You will be notified once a decision has been made.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <textarea
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                placeholder="Please explain why you believe this ban should be reviewed. Be specific and provide relevant details..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent mb-4"
                rows={6}
                disabled={submitting}
              />

              <button
                onClick={handleSubmitAppeal}
                disabled={submitting || !appealReason.trim()}
                className="w-full px-6 py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#E56E20' }}
              >
                {submitting ? 'Submitting...' : 'Submit Appeal'}
              </button>
            </>
          )}
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
