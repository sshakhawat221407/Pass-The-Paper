import { AlertCircle, CreditCard, Smartphone } from 'lucide-react';
import { Header } from '../Header';
import { Button } from '../Button';
import { Footer } from '../Footer';
import { Screen } from '../../App';

interface PaymentConfirmationScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function PaymentConfirmationScreen({ onNavigate }: PaymentConfirmationScreenProps) {
  // Mock data - would come from previous screen in real app
  const paymentData = {
    amount: 500,
    method: 'card', // 'bkash', 'nagad', or 'card'
    methodDisplay: 'Card Payment',
    cardLast4: '3456',
    currentBalance: 450,
    newBalance: 950
  };

  const handleConfirmPayment = () => {
    // Navigate to processing screen instead of directly to success/failure
    onNavigate('processing-payment');
  };

  const getPaymentIcon = () => {
    if (paymentData.method === 'card') {
      return <CreditCard size={24} color="#E56E20" />;
    }
    return <Smartphone size={24} color="#E56E20" />;
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Confirm Payment" onBack={() => onNavigate('add-money')} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Warning Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex gap-2">
          <AlertCircle size={18} color="#F59E0B" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-900">
            Please review your payment details carefully before confirming. This action cannot be undone.
          </p>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Amount to Add</span>
              <span className="text-lg font-bold text-gray-900">৳{paymentData.amount}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Processing Fee</span>
              <span className="text-sm font-semibold text-green-600">FREE</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-900">Total Amount</span>
              <span className="text-xl font-bold" style={{ color: '#E56E20' }}>
                ৳{paymentData.amount}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Method</h3>
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#D4ECF7' }}>
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'white' }}
            >
              {getPaymentIcon()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">{paymentData.methodDisplay}</p>
              {paymentData.method === 'card' && (
                <p className="text-xs text-gray-600">Card ending in {paymentData.cardLast4}</p>
              )}
            </div>
          </div>
        </div>

        {/* Balance Preview */}
        <div className="rounded-xl p-4 mb-4 border border-gray-200" style={{ backgroundColor: '#D4ECF7' }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Balance After Payment</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Current Balance</p>
              <p className="text-lg font-semibold text-gray-900">৳{paymentData.currentBalance}</p>
            </div>
            <div className="text-2xl text-gray-400 font-bold">→</div>
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-1">New Balance</p>
              <p className="text-lg font-bold" style={{ color: '#E56E20' }}>
                ৳{paymentData.newBalance}
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <label className="flex items-start gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1"
              defaultChecked
            />
            <span className="text-xs text-gray-700">
              I agree to the <span style={{ color: '#E56E20', fontWeight: 600 }}>Terms & Conditions</span> and confirm that the payment details are correct.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button fullWidth onClick={handleConfirmPayment}>
            Pay Now - ৳{paymentData.amount}
          </Button>
          <Button fullWidth variant="outline" onClick={() => onNavigate('add-money')}>
            Cancel
          </Button>
        </div>

        <p className="text-xs text-center text-gray-600 mt-3">
          Secure payment processed with bank-level encryption
        </p>
      </div>

      <Footer />
    </div>
  );
}