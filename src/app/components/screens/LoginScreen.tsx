import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Screen } from '../../App';
import { Header } from '../Header';
import { GraduationCap } from 'lucide-react';

interface LoginScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogin: () => void;
}

export function LoginScreen({ onNavigate, onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // In a real app, validate credentials here
    // For demo, any input is accepted
    onLogin();
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header showLogo={true} onBack={() => onNavigate('splash')} />
      
      <div className="flex-1 px-6 pt-8">
        {/* Logo and Login Title */}
        <div className="flex flex-col items-center mb-8">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#E56E20' }}
          >
            <GraduationCap size={48} color="white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Login</h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-700 mb-8">Sign in to access your account</p>

        <div className="space-y-4">
          <Input
            label="University Email / Student ID"
            type="email"
            placeholder="your.email@university.edu"
            value={email}
            onChange={setEmail}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
          />

          <button 
            onClick={() => onNavigate('password-reset')}
            className="text-sm" 
            style={{ color: '#E56E20', fontWeight: 600 }}
          >
            Forgot password?
          </button>
        </div>

        <div className="mt-8 space-y-3">
          <Button fullWidth onClick={handleLogin}>
            Login
          </Button>
          
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-center text-blue-900">
              First time? You'll need to verify your student status after signing up.
            </p>
          </div>

          <p className="text-center text-sm text-gray-700">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('signup')} style={{ color: '#E56E20', fontWeight: 600 }}>
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}