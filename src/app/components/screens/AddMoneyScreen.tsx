import { useState } from 'react';
import { CreditCard, Smartphone } from 'lucide-react';
import { Header } from '../Header';
import { Button } from '../Button';
import { Input } from '../Input';
import { Footer } from '../Footer';
import { Screen, NavigationContext } from '../../App';

interface AddMoneyScreenProps {
  onNavigate: (screen: Screen, tab?: any, context?: NavigationContext) => void;
  onBack?: () => void;
  navigationContext?: NavigationContext;
}

export function AddMoneyScreen({ onNavigate, onBack, navigationContext }: AddMoneyScreenProps) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'card' | null>(null);

  const quickAmounts = [100, 200, 500, 1000];

  const handleContinue = () => {
    const context: NavigationContext = {
      fromScreen: 'add-money',
      checkoutType: 'wallet-topup',
      paymentMethod: selectedMethod || 'card',
      amount: parseInt(amount)
    };

    if (selectedMethod === 'card') {
      onNavigate('card-payment', undefined, context);
    } else {
      // For Bkash and Nagad, go directly to checkout
      onNavigate('checkout', undefined, context);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onNavigate('wallet');
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Add Money" onBack={handleBack} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Current Balance */}
        <div className="rounded-xl p-4 mb-4 border border-gray-200" style={{ backgroundColor: '#D4ECF7' }}>
          <p className="text-xs text-gray-600 mb-1">Current Balance</p>
          <p className="text-2xl font-bold text-gray-900">৳450</p>
        </div>

        {/* Amount Input */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Enter Amount</h3>
          <Input
            placeholder="Enter amount (৳)"
            value={amount}
            onChange={setAmount}
          />
          <p className="text-xs text-gray-600 mt-2 px-1">Minimum: ৳50 • Maximum: ৳10,000</p>

          {/* Quick Amount Selection */}
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Quick Select</p>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="py-2 rounded-lg border-2 border-gray-200 text-sm font-medium text-gray-900 hover:border-orange-300 transition-colors"
                >
                  ৳{quickAmount}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Payment Method</h3>
          <div className="space-y-3">
            {/* Bkash */}
            <button
              onClick={() => setSelectedMethod('bkash')}
              className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                selectedMethod === 'bkash' ? 'bg-white' : 'bg-gray-50'
              }`}
              style={{
                borderColor: selectedMethod === 'bkash' ? '#E56E20' : '#E5E7EB'
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#D4ECF7' }}
              >
                <Smartphone size={24} color="#E56E20" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">Bkash</p>
                <p className="text-xs text-gray-600">Mobile banking payment</p>
              </div>
              <div 
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'bkash' ? 'border-orange-500' : 'border-gray-300'
                }`}
              >
                {selectedMethod === 'bkash' && (
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E56E20' }} />
                )}
              </div>
            </button>

            {/* Nagad */}
            <button
              onClick={() => setSelectedMethod('nagad')}
              className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                selectedMethod === 'nagad' ? 'bg-white' : 'bg-gray-50'
              }`}
              style={{
                borderColor: selectedMethod === 'nagad' ? '#E56E20' : '#E5E7EB'
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#D4ECF7' }}
              >
                <Smartphone size={24} color="#E56E20" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">Nagad</p>
                <p className="text-xs text-gray-600">Mobile banking payment</p>
              </div>
              <div 
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'nagad' ? 'border-orange-500' : 'border-gray-300'
                }`}
              >
                {selectedMethod === 'nagad' && (
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E56E20' }} />
                )}
              </div>
            </button>

            {/* Card Payment */}
            <button
              onClick={() => setSelectedMethod('card')}
              className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                selectedMethod === 'card' ? 'bg-white' : 'bg-gray-50'
              }`}
              style={{
                borderColor: selectedMethod === 'card' ? '#E56E20' : '#E5E7EB'
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#D4ECF7' }}
              >
                <CreditCard size={24} color="#E56E20" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">Card Payment</p>
                <p className="text-xs text-gray-600">Credit / Debit card</p>
              </div>
              <div 
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'card' ? 'border-orange-500' : 'border-gray-300'
                }`}
              >
                {selectedMethod === 'card' && (
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E56E20' }} />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-green-900">
            🔒 <strong>Secure Payment:</strong> All transactions are encrypted and protected. Your payment information is never stored.
          </p>
        </div>

        {/* Continue Button */}
        <Button 
          fullWidth 
          onClick={handleContinue}
          disabled={!amount || !selectedMethod || parseInt(amount) < 50}
        >
          Continue to Checkout
        </Button>
        {(!amount || !selectedMethod) && (
          <p className="text-xs text-center text-gray-600 mt-2">
            Enter amount and select payment method to continue
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}