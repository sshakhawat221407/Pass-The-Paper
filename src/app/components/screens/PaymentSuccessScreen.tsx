import { CheckCircle, Download, Home, TrendingUp, Wallet as WalletIcon, Award } from 'lucide-react';
import { Button } from '../Button';
import { Footer } from '../Footer';
import { Screen, NavigationContext } from '../../App';

interface PaymentSuccessScreenProps {
  onNavigate: (screen: Screen, tab?: any, context?: NavigationContext) => void;
  navigationContext?: NavigationContext;
}

export function PaymentSuccessScreen({ onNavigate, navigationContext }: PaymentSuccessScreenProps) {
  const transactionType = navigationContext?.checkoutType || 'wallet-topup';
  
  const transactionData = {
    type: transactionType,
    amount: navigationContext?.amount || 500,
    transactionId: 'TXN' + Date.now().toString().slice(-8),
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    method: navigationContext?.paymentMethod === 'bkash' ? 'Bkash' : navigationContext?.paymentMethod === 'nagad' ? 'Nagad' : 'Card Payment',
    previousBalance: 450,
    newBalance: transactionType === 'wallet-topup' ? 450 + (navigationContext?.amount || 500) : 450,
    pointsEarned: transactionType === 'resource-purchase' ? 50 : 0,
    currentPoints: 1300,
  };

  const balanceChange = transactionData.newBalance - transactionData.previousBalance;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <div className="flex-1 overflow-y-auto px-4 pt-12 pb-4">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce"
            style={{ backgroundColor: '#10B981', animation: 'bounce 0.6s ease-in-out' }}
          >
            <CheckCircle size={48} color="white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-700">
            {transactionType === 'wallet-topup' 
              ? '৳' + transactionData.amount + ' has been successfully added to your wallet'
              : 'Payment completed. Your purchase is now available'}
          </p>
        </div>

        {/* Amount Card */}
        <div className="rounded-xl p-6 mb-4 text-center border border-green-200" style={{ backgroundColor: '#D1FAE5' }}>
          <p className="text-sm text-gray-600 mb-2">
            {transactionType === 'wallet-topup' ? 'Amount Added' : 'Amount Paid'}
          </p>
          <p className="text-4xl font-bold mb-2" style={{ color: '#10B981' }}>
            ৳{transactionData.amount}
          </p>
          <div className="flex items-center justify-center gap-2">
            <TrendingUp size={16} color="#10B981" />
            <span className="text-xs font-semibold text-green-700">Transaction Complete</span>
          </div>
        </div>

        {/* Balance Update - Highlighted */}
        <div className="bg-white rounded-xl p-5 mb-4 border-2 shadow-lg" style={{ borderColor: '#E56E20' }}>
          <div className="flex items-center gap-2 mb-3">
            <WalletIcon size={20} color="#E56E20" />
            <h3 className="text-sm font-semibold text-gray-900">Wallet Balance Updated</h3>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-left">
              <p className="text-xs text-gray-600 mb-1">Previous Balance</p>
              <p className="text-lg font-semibold text-gray-500 line-through">
                ৳{transactionData.previousBalance}
              </p>
            </div>
            
            <div className="flex items-center justify-center px-4">
              <div className="text-2xl font-bold" style={{ color: '#E56E20' }}>→</div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-1">New Balance</p>
              <p className="text-2xl font-bold" style={{ color: '#E56E20' }}>
                ৳{transactionData.newBalance}
              </p>
            </div>
          </div>

          <div className="rounded-lg p-3" style={{ backgroundColor: '#FEF3C7' }}>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-semibold" style={{ color: '#92400E' }}>
                {balanceChange > 0 ? '+' : ''}৳{Math.abs(balanceChange)} {balanceChange > 0 ? 'Added' : 'Deducted'}
              </span>
            </div>
          </div>
        </div>

        {/* Reward Points (if earned) */}
        {transactionData.pointsEarned > 0 && (
          <div className="rounded-xl p-4 mb-4 border border-gray-200" style={{ backgroundColor: '#D4ECF7' }}>
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} color="#E56E20" />
              <h3 className="text-sm font-semibold text-gray-900">Reward Points Earned!</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Points Earned</span>
              <span className="text-xl font-bold" style={{ color: '#E56E20' }}>
                +{transactionData.pointsEarned} points
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Total Points</span>
                <span className="text-sm font-semibold text-gray-900">
                  {transactionData.currentPoints} points
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Details */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Transaction Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono font-semibold text-gray-900 text-xs">{transactionData.transactionId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date & Time</span>
              <span className="text-gray-900 text-xs">{transactionData.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="text-gray-900">{transactionData.method}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
                <span className="text-green-600 font-semibold">Success</span>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Download */}
        <button className="w-full bg-white rounded-xl p-4 mb-4 border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <Download size={18} color="#E56E20" />
          <span className="font-semibold text-gray-900">Download Receipt</span>
        </button>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button fullWidth onClick={() => onNavigate('wallet')}>
            <WalletIcon size={18} className="inline mr-2" />
            View Wallet
          </Button>
          {transactionType !== 'wallet-topup' && (
            <Button fullWidth variant="outline" onClick={() => onNavigate('home')}>
              <Home size={18} className="inline mr-2" />
              Back to Home
            </Button>
          )}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
          <p className="text-xs text-green-900 text-center">
            ✓ Receipt sent to your university email • Balance updated instantly
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}