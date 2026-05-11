import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Screen } from '../../App';
import { ArrowLeft } from 'lucide-react';

interface SignUpScreenProps {
  onNavigate: (screen: Screen) => void;
  onSignUp: () => void;
}

export function SignUpScreen({ onNavigate, onSignUp }: SignUpScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    // In a real app, validate and create account here
    // For demo, any input is accepted
    onSignUp();
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <div className="px-4 py-4">
        <button onClick={() => onNavigate('login')} className="p-2 hover:bg-white/50 rounded-lg transition-colors">
          <ArrowLeft size={24} color="#E56E20" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 px-6 overflow-y-auto pb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-700 mb-6">Join the academic community</p>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-3">Personal Information</p>
            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChange={setName}
              />

              <Input
                label="University Email"
                type="email"
                placeholder="your.email@university.edu"
                value={email}
                onChange={setEmail}
              />
              <p className="text-xs text-gray-600 -mt-2">Use your official university email</p>

              <Input
                label="Student ID"
                placeholder="Enter your student ID"
                value={studentId}
                onChange={setStudentId}
              />
              <p className="text-xs text-gray-600 -mt-2">Your unique university ID number</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-3">Create Password</p>
            <div className="space-y-4">
              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={setPassword}
              />
              <p className="text-xs text-gray-600 -mt-2">At least 8 characters</p>

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              <strong>Why verification?</strong> Verification keeps the platform safe and ensures only real university students can access resources.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button fullWidth onClick={handleSignUp}>
            Sign Up
          </Button>

          <p className="text-center text-sm text-gray-700">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} style={{ color: '#E56E20', fontWeight: 600 }}>
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}