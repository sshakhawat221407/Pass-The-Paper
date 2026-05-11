import { useState } from 'react';
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownRight, CreditCard, Smartphone, Download } from 'lucide-react';
import { Header } from '../Header';
import { Button } from '../Button';
import { Footer } from '../Footer';
import { Screen } from '../../App';
import { useMockData } from '../../utils/MockDataContext';
import { toast } from 'sonner@2.0.3';

interface WalletScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function WalletScreen({ onNavigate }: WalletScreenProps) {
  const mockData = useMockData();
  const currentUser = mockData.currentUser;
  const transactions = mockData.transactions.filter(t => t.userId === currentUser?.id);
  
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'Bkash' | 'Nagad' | 'Bank Transfer'>('Bkash');
  const [accountNumber, setAccountNumber] = useState('');

  const cartItemCount = mockData.getCartItems().length;
  const notificationCount = mockData.getNotifications().filter(n => !n.isRead).length;

  const handleWithdraw = () => {
    if (!currentUser) {
      toast.error('Please login');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > currentUser.walletBalance) {
      toast.error('Insufficient balance');
      return;
    }

    if (!accountNumber.trim()) {
      toast.error('Please enter account number');
      return;
    }

    // Create withdrawal request
    mockData.addWithdrawal({
      userId: currentUser.id,
      amount,
      method: withdrawMethod,
      accountNumber: accountNumber.trim(),
      status: 'pending',
    });

    // Deduct from wallet
    mockData.updateUser(currentUser.id, {
      walletBalance: currentUser.walletBalance - amount,
    });

    // Add transaction
    mockData.addTransaction({
      userId: currentUser.id,
      type: 'withdrawal',
      amount,
      currency: 'BDT',
      description: `Withdrawal to ${withdrawMethod}`,
      paymentMethod: withdrawMethod,
    });

    toast.success('Withdrawal request submitted successfully');
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setAccountNumber('');
  };

  const getPaymentIcon = (method?: string) => {
    if (method === 'Card') {
      return <CreditCard size={18} color="#E56E20" />;
    } else if (method === 'Bkash' || method === 'Nagad') {
      return <Smartphone size={18} color="#E56E20" />;
    } else if (method === 'Wallet') {
      return <WalletIcon size={18} color="#E56E20" />;
    } else if (method === 'Bank Transfer') {
      return <Download size={18} color="#E56E20" />;
    }
    return <ArrowDownRight size={18} color="#10B981" />;
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header 
        title="My Wallet" 
        showNotifications 
        showCart 
        onNavigate={onNavigate}
        cartItemCount={cartItemCount}
        notificationCount={notificationCount}
        onCartClick={() => onNavigate('cart')}
        onNotificationsClick={() => onNavigate('notifications')}
      />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* BDT Balance */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <WalletIcon size={18} color="#E56E20" />
              <p className="text-xs text-gray-600">BDT Balance</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">৳{currentUser?.walletBalance || 0}</p>
            <p className="text-xs text-gray-600">Available to spend</p>
          </div>

          {/* Points Balance */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight size={18} color="#10B981" />
              <p className="text-xs text-gray-600">Points</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{currentUser?.rewardPoints || 0}</p>
            <p className="text-xs text-gray-600">From your uploads</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button fullWidth onClick={() => onNavigate('add-money')}>
            <Plus size={18} className="inline mr-2" />
            Add Money
          </Button>
          <Button 
            fullWidth 
            variant="outline"
            onClick={() => setShowWithdrawModal(true)}
          >
            <Download size={18} className="inline mr-2" />
            Withdraw
          </Button>
        </div>
        
        <p className="text-xs text-center text-gray-600 mb-4">
          Add BDT via Bkash, Nagad, or Card • Earn Points from uploads
        </p>

        {/* Transaction History */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-1">Transaction History</h3>
          <p className="text-xs text-gray-600 mb-3">Your recent wallet activity</p>

          {/* Transactions List */}
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600">No transactions yet</p>
              </div>
            ) : (
              transactions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((transaction) => {
                  const isCredit = transaction.type === 'add' || transaction.type === 'upload_reward';
                  const isDebit = transaction.type === 'purchase' || transaction.type === 'withdrawal';
                  
                  return (
                    <div key={transaction.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ 
                          backgroundColor: isCredit ? '#D4ECF7' : '#FEE2E2'
                        }}
                      >
                        {isCredit ? (
                          <ArrowDownRight size={18} color="#10B981" />
                        ) : (
                          <ArrowUpRight size={18} color="#EF4444" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                          {transaction.paymentMethod && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                {getPaymentIcon(transaction.paymentMethod)}
                                {transaction.paymentMethod}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p 
                          className={`font-semibold text-sm ${
                            isCredit ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {isCredit ? '+' : '-'}{transaction.currency === 'BDT' ? '৳' : ''}{transaction.amount}{transaction.currency === 'Points' ? ' Points' : ''}
                        </p>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="font-bold text-gray-900 mb-4">Withdraw Money</h3>
            
            <div className="mb-4">
              <label className="text-sm text-gray-700 mb-2 block">Amount (BDT)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-600 mt-1">
                Available: ৳{currentUser?.walletBalance || 0}
              </p>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-700 mb-2 block">Withdrawal Method</label>
              <div className="grid grid-cols-3 gap-2">
                {['Bkash', 'Nagad', 'Bank Transfer'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setWithdrawMethod(method as any)}
                    className={`p-2 rounded-lg border-2 transition-all text-xs ${
                      withdrawMethod === method ? 'bg-white' : 'bg-transparent'
                    }`}
                    style={{
                      borderColor: withdrawMethod === method ? '#E56E20' : '#D1D5DB'
                    }}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-700 mb-2 block">
                {withdrawMethod === 'Bank Transfer' ? 'Account Number' : 'Mobile Number'}
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={withdrawMethod === 'Bank Transfer' ? 'Enter account number' : 'Enter mobile number'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex gap-3">
              <Button fullWidth onClick={handleWithdraw}>
                Confirm Withdrawal
              </Button>
              <Button 
                fullWidth 
                variant="outline" 
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
                  setAccountNumber('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}