import { XCircle, RefreshCw, Home, HelpCircle, Wallet as WalletIcon } from 'lucide-react';
import { Button } from '../Button';
import { Footer } from '../Footer';
import { Screen } from '../../App';

interface PaymentFailureScreenProps {
  onNavigate: (screen: Screen) => void;
  transactionType?: 'wallet-topup' | 'resource-purchase' | 'cart-checkout';
}

export function PaymentFailureScreen({ onNavigate, transactionType = 'wallet-topup' }: PaymentFailureScreenProps) {
  const failureData = {
    type: transactionType,
    amount: 500,
    transactionId: 'TXN' + Date.now().toString().slice(-8),
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    method: 'Card Payment',
    reason: 'Payment declined by bank',
    currentBalance: 450,
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <div className="flex-1 overflow-y-auto px-4 pt-12 pb-4">
        {/* Failure Icon */}
        <div className="text-center mb-6">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#EF4444' }}
          >
            <XCircle size={48} color="white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-700">
            Payment could not be completed. Please try again or use a different payment method
          </p>
        </div>

        {/* Failed Amount */}
        <div className="rounded-xl p-6 mb-4 text-center border border-red-200" style={{ backgroundColor: '#FEE2E2' }}>
          <p className="text-sm text-gray-600 mb-2">Attempted Amount</p>
          <p className="text-4xl font-bold text-red-600">
            ৳{failureData.amount}
          </p>
          <p className="text-xs text-red-700 mt-2 font-medium">Transaction not completed</p>
        </div>

        {/* Balance Unchanged - Important Info */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <WalletIcon size={20} color="#2563EB" />
            <h3 className="text-sm font-semibold text-blue-900">Your Balance is Safe</h3>
          </div>
          <p className="text-sm text-blue-800 mb-3">
            No money was deducted from your account. Your wallet balance remains unchanged.
          </p>
          <div className="rounded-lg p-3" style={{ backgroundColor: '#DBEAFE' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-900">Current Balance</span>
              <span className="text-xl font-bold text-blue-900">৳{failureData.currentBalance}</span>
            </div>
          </div>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">What Happened?</h3>
          <div className="bg-red-50 rounded-lg p-3 mb-3 border border-red-200">
            <p className="text-sm text-red-900 font-medium">
              {failureData.reason}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-gray-900 text-xs">{failureData.transactionId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date & Time</span>
              <span className="text-gray-900 text-xs">{failureData.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="text-gray-900">{failureData.method}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-600"></div>
                <span className="text-red-600 font-semibold">Failed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Common Reasons */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Common Reasons for Failure</h3>
          <ul className="text-xs text-gray-700 space-y-2">
            <li className="flex gap-2">
              <span className="text-red-500">•</span>
              <span>Insufficient balance in your payment account</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500">•</span>
              <span>Incorrect card details or expired card</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500">•</span>
              <span>Bank declined the transaction for security reasons</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500">•</span>
              <span>Network connection issue during payment</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500">•</span>
              <span>Payment gateway timeout or technical error</span>
            </li>
          </ul>
        </div>

        {/* Suggestions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <h3 className="text-xs font-semibold text-yellow-900 mb-2">What to do next:</h3>
          <ul className="text-xs text-yellow-800 space-y-1">
            <li>• Check your payment account balance</li>
            <li>• Verify your card details are correct</li>
            <li>• Try a different payment method</li>
            <li>• Contact your bank if issue persists</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button fullWidth onClick={() => onNavigate('checkout')}>
            <RefreshCw size={18} className="inline mr-2" />
            Try Again
          </Button>
          <Button fullWidth variant="outline" onClick={() => onNavigate('add-money')}>
            Change Payment Method
          </Button>
          <Button fullWidth variant="outline" onClick={() => onNavigate('wallet')}>
            <Home size={18} className="inline mr-2" />
            Back to Wallet
          </Button>
          <button 
            className="w-full bg-white rounded-xl p-3 border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <HelpCircle size={18} color="#E56E20" />
            <span className="font-semibold text-gray-900 text-sm">Contact Support</span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}