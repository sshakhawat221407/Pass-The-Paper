import { useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { Button } from '../Button';
import { Screen } from '../../App';

interface SplashScreenProps {
  onNavigate: (screen: Screen) => void;
  isAuthenticated: boolean;
}

export function SplashScreen({ onNavigate, isAuthenticated }: SplashScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8" style={{ backgroundColor: '#F0D7C7' }}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: '#E56E20' }}
        >
          <GraduationCap size={48} color="white" strokeWidth={2} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
          Pass The Paper
        </h1>
        
        <p className="text-center text-gray-700 mb-8 max-w-xs">
          Your trusted academic resource marketplace for verified university students
        </p>
        
        <div className="bg-white/80 rounded-lg p-3 mb-4">
          <p className="text-xs text-center text-gray-700 leading-relaxed">
            ✓ Verified students only<br />
            ✓ Safe & trusted academic sharing
          </p>
        </div>

        {/* Loading indicator removed */}
      </div>

      {/* Manual navigation option */}
      <div className="w-full pb-12">
        <Button fullWidth onClick={() => onNavigate('login')}>
          Get Started
        </Button>
      </div>
    </div>
  );
}