import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Screen } from '../../App';
import { Shield, Mail, Upload } from 'lucide-react';
import { Header } from '../Header';

interface VerificationScreenProps {
  onNavigate: (screen: Screen) => void;
  onVerificationComplete: () => void;
}

export function VerificationScreen({ onNavigate, onVerificationComplete }: VerificationScreenProps) {
  const [otp, setOtp] = useState('');
  const [method, setMethod] = useState<'email' | 'id'>('email');

  const handleContinue = () => {
    // In a real app, verify OTP or ID upload here
    // For demo, any action completes verification
    onVerificationComplete();
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Verification" onBack={() => onNavigate('signup')} />
      
      <div className="flex-1 px-6 pt-12 overflow-y-auto pb-8">
        <div className="flex justify-center mb-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#E56E20' }}
          >
            <Shield size={32} color="white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Student Verification</h1>
        <p className="text-gray-700 mb-8 text-center">Verify your student status to continue</p>

        <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Why Verification?</h3>
          <p className="text-sm text-gray-700 mb-3">
            Pass The Paper is an exclusive platform for verified university students. 
            This ensures trust, authenticity, and a safe academic community.
          </p>
          <div className="bg-green-50 rounded-lg p-2">
            <p className="text-xs text-green-800">✓ Keeps scammers out • Builds trust • Safe trading</p>
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-700 mb-2 px-1">Choose Verification Method</p>
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMethod('email')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              method === 'email' ? 'bg-white' : 'bg-transparent'
            }`}
            style={{
              borderColor: method === 'email' ? '#E56E20' : '#D1D5DB'
            }}
          >
            <Mail size={24} color={method === 'email' ? '#E56E20' : '#999999'} className="mx-auto mb-2" strokeWidth={method === 'email' ? 2.5 : 2} />
            <p className="text-sm font-medium text-gray-900">Email OTP</p>
          </button>

          <button
            onClick={() => setMethod('id')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              method === 'id' ? 'bg-white' : 'bg-transparent'
            }`}
            style={{
              borderColor: method === 'id' ? '#E56E20' : '#D1D5DB'
            }}
          >
            <Upload size={24} color={method === 'id' ? '#E56E20' : '#999999'} className="mx-auto mb-2" strokeWidth={method === 'id' ? 2.5 : 2} />
            <p className="text-sm font-medium text-gray-900">Student ID</p>
          </button>
        </div>

        {method === 'email' ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-900">
                ✓ OTP sent to your university email. Check your inbox.
              </p>
            </div>
            <Input
              label="Enter OTP"
              placeholder="6-digit code"
              value={otp}
              onChange={setOtp}
            />
            <p className="text-xs text-gray-600 px-1">Didn't receive? Check spam or resend in 60s</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
              style={{ borderColor: '#E56E20' }}
            >
              <Upload size={32} color="#E56E20" className="mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900 mb-1">Upload Student ID</p>
              <p className="text-xs text-gray-600">JPG, PNG (Max 5MB)</p>
            </div>
            <p className="text-xs text-gray-600 px-1">Your ID will be verified within 24 hours</p>
          </div>
        )}

        <div className="mt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-sm font-medium text-gray-700">Verification Pending</span>
          </div>
          <p className="text-xs text-center text-gray-600 mb-4">You can browse while we verify your account</p>
          <Button fullWidth onClick={handleContinue}>
            Continue to App
          </Button>
        </div>
      </div>
    </div>
  );
}