import { useState } from 'react';
import { Lock, Mail, CheckCircle } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Footer } from '../Footer';
import { Screen } from '../../App';
import { Header } from '../Header';

interface PasswordResetScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function PasswordResetScreen({ onNavigate }: PasswordResetScreenProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Reset Password" onBack={() => onNavigate('login')} />
      
      <div className="flex-1 px-6 pt-12 overflow-y-auto pb-8">
        <div className="flex justify-center mb-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#E56E20' }}
          >
            {isSubmitted ? (
              <CheckCircle size={32} color="white" />
            ) : (
              <Lock size={32} color="white" />
            )}
          </div>
        </div>

        {!isSubmitted ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Reset Password</h1>
            <p className="text-gray-700 mb-8 text-center">
              Enter your university email to receive reset instructions
            </p>

            <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
              <Input
                label="University Email"
                type="email"
                placeholder="your.email@university.edu"
                value={email}
                onChange={setEmail}
              />
              <p className="text-xs text-gray-600 mt-2 px-1">
                We'll send a password reset link to this email
              </p>
            </div>

            <div className="space-y-3">
              <Button fullWidth onClick={handleSubmit}>
                Send Reset Link
              </Button>

              <button 
                onClick={() => onNavigate('login')}
                className="w-full text-center text-sm"
                style={{ color: '#E56E20', fontWeight: 600 }}
              >
                Back to Login
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Check Your Email</h1>
            <p className="text-gray-700 mb-8 text-center">
              We've sent password reset instructions to your email
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <Mail size={20} color="#10B981" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900 mb-1">Email Sent!</p>
                  <p className="text-xs text-green-800">
                    Check your inbox and spam folder for the reset link. 
                    The link will expire in 1 hour.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Didn't receive the email?</h3>
              <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email</li>
                <li>Wait a few minutes for delivery</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button fullWidth onClick={() => setIsSubmitted(false)} variant="outline">
                Resend Email
              </Button>

              <button 
                onClick={() => onNavigate('login')}
                className="w-full text-center text-sm"
                style={{ color: '#E56E20', fontWeight: 600 }}
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}