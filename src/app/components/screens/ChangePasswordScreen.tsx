import { useState } from 'react';
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Screen } from '../../App';

interface ChangePasswordScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
}

export function ChangePasswordScreen({ onNavigate, onBack }: ChangePasswordScreenProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordRequirements = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(newPassword) },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(newPassword) }
  ];

  const isPasswordValid = passwordRequirements.every(req => req.met);
  const doPasswordsMatch = newPassword === confirmPassword && confirmPassword !== '';

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (!isPasswordValid) {
      alert('Password does not meet requirements');
      return;
    }

    if (!doPasswordsMatch) {
      alert('New passwords do not match');
      return;
    }

    // In a real app, verify current password and update
    setIsSuccess(true);
    
    // Reset form after 2 seconds and go back
    setTimeout(() => {
      if (onBack) {
        onBack();
      } else {
        onNavigate('settings');
      }
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
        <Header title="Password Reset" onBack={onBack} />
        
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={48} color="#10B981" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Changed!</h2>
            <p className="text-gray-700 mb-4">Your password has been successfully updated</p>
            <p className="text-sm text-gray-600">Redirecting...</p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Change Password" onBack={onBack} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex gap-3">
            <Lock size={20} color="#3B82F6" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Secure Password Change</p>
              <p className="text-xs text-blue-800">
                Choose a strong password to keep your account secure
              </p>
            </div>
          </div>
        </div>

        {/* Current Password */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showCurrentPassword ? (
                <EyeOff size={20} color="#9CA3AF" />
              ) : (
                <Eye size={20} color="#9CA3AF" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative mb-3">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showNewPassword ? (
                <EyeOff size={20} color="#9CA3AF" />
              ) : (
                <Eye size={20} color="#9CA3AF" />
              )}
            </button>
          </div>

          {/* Password Requirements */}
          {newPassword && (
            <div className="space-y-1">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    req.met ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {req.met && <span className="text-green-600 text-xs">✓</span>}
                  </div>
                  <span className={`text-xs ${req.met ? 'text-green-700' : 'text-gray-600'}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color="#9CA3AF" />
              ) : (
                <Eye size={20} color="#9CA3AF" />
              )}
            </button>
          </div>
          {confirmPassword && (
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                doPasswordsMatch ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {doPasswordsMatch && <span className="text-green-600 text-xs">✓</span>}
                {!doPasswordsMatch && <span className="text-red-600 text-xs">✗</span>}
              </div>
              <span className={`text-xs ${doPasswordsMatch ? 'text-green-700' : 'text-red-600'}`}>
                {doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          fullWidth 
          onClick={handleSubmit}
          disabled={!currentPassword || !isPasswordValid || !doPasswordsMatch}
        >
          Change Password
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center mt-4">
          <button 
            onClick={() => onNavigate('password-reset')}
            className="text-sm"
            style={{ color: '#E56E20', fontWeight: 600 }}
          >
            Forgot your current password?
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
