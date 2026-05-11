import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Screen, NavigationContext } from '../../App';

interface ProcessingPaymentScreenProps {
  onNavigate: (screen: Screen, tab?: any, context?: NavigationContext) => void;
  navigationContext?: NavigationContext;
}

export function ProcessingPaymentScreen({ onNavigate, navigationContext }: ProcessingPaymentScreenProps) {
  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      // 80% success rate for demo
      const success = Math.random() > 0.2;
      if (success) {
        onNavigate('payment-success', undefined, navigationContext);
      } else {
        onNavigate('payment-failure', undefined, navigationContext);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [onNavigate, navigationContext]);

  return (
    <div className="h-full flex flex-col items-center justify-center" style={{ backgroundColor: '#F0D7C7' }}>
      <div className="px-6 text-center">
        {/* Loading Animation */}
        <div 
          className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ backgroundColor: '#D4ECF7' }}
        >
          <Loader2 
            size={48} 
            color="#E56E20" 
            className="animate-spin"
            strokeWidth={2.5}
          />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Processing Payment
        </h2>
        <p className="text-gray-700 mb-8">
          Please wait while we securely process your transaction
        </p>

        {/* Progress Indicator */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200 max-w-xs mx-auto">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
              <span className="text-sm text-gray-700">Verifying payment details</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#E56E20' }}></div>
              <span className="text-sm text-gray-700">Processing transaction</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <span className="text-sm text-gray-500">Updating balance</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-600">
          This may take a few moments. Please do not close this screen.
        </p>
      </div>
    </div>
  );
}