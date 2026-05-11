import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { Footer } from './Footer';
import { useMockData } from '../utils/MockDataContext';
import {
  Wallet as WalletIcon, TrendingUp, ArrowUpRight, ArrowDownRight,
  Plus, Award, ArrowDown, X, Clock, CheckCircle2, XCircle, Zap, RefreshCw, Ban,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type WalletProps = { user: User };
const ACCENT = '#E56E20';
const MERCHANT_NUMBER = '01629668094';

const POINT_PACKAGES = [
  { points: 10,  bdt: 5  },
  { points: 30,  bdt: 15 },
  { points: 60,  bdt: 25 },
  { points: 120, bdt: 45 },
  { points: 250, bdt: 85 },
];

export function Wallet({ user }: WalletProps) {
  const mockData = useMockData();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'withdraw' | 'points' | null>(null);

  // Add BDT state
  const [addAmount, setAddAmount] = useState('');
  const [addMethod, setAddMethod] = useState<'Bkash' | 'Nagad'>('Bkash');
  const [addPhone, setAddPhone] = useState('');
  const [addTrxNumber, setAddTrxNumber] = useState('');
  const [addMsg, setAddMsg] = useState('');

  // Withdraw state
  const [wdAmount, setWdAmount] = useState('');
  const [wdMethod, setWdMethod] = useState<'Bkash' | 'Nagad'>('Bkash');
  const [wdNumber, setWdNumber] = useState('');
  const [wdMsg, setWdMsg] = useState('');

  // Points topup state
  const [selectedPkg, setSelectedPkg] = useState(POINT_PACKAGES[1]);

  useEffect(() => {
    const all = mockData.transactions.filter((t: any) => t.userId === user.id);
    setTransactions(all.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  }, [mockData.transactions, user.id]);

  const liveUser = mockData.users.find((u: any) => u.id === user.id) || user;

  const handleAddBdt = () => {
    const requestedAmount = parseFloat(addAmount);
    if (!requestedAmount || requestedAmount < 10) { setAddMsg('Minimum top-up is BDT 10'); return; }
    if (!addPhone || addPhone.length < 11) { setAddMsg('Enter the phone number you sent money from'); return; }
    if (!addTrxNumber.trim()) { setAddMsg('Enter the transaction number'); return; }
    mockData.addTransaction({
      userId: user.id,
      type: 'add',
      amount: requestedAmount,
      currency: 'BDT',
      description: `BDT top-up via ${addMethod}`,
      paymentMethod: addMethod,
      paymentPhone: addPhone,
      transactionNumber: addTrxNumber.trim(),
    });
    setModal(null); setAddAmount(''); setAddPhone(''); setAddTrxNumber(''); setAddMsg('');
    return;
  };

  const handleWithdraw = () => {
    const amt = parseFloat(wdAmount);
    if (!amt || amt < 50) { setWdMsg('Minimum withdrawal is ৳50'); return; }
    if (amt > liveUser.walletBalance) { setWdMsg('Insufficient balance'); return; }
    if (!wdNumber || wdNumber.length < 11) { setWdMsg('Enter a valid 11-digit mobile number'); return; }
    const withdrawal = mockData.addWithdrawal({ userId: user.id, amount: amt, method: wdMethod, accountNumber: wdNumber, status: 'pending' });
    mockData.addTransaction({ userId: user.id, type: 'withdrawal', amount: amt, currency: 'BDT',
      description: `Withdrawal to ${wdMethod} ${wdNumber}`, paymentMethod: wdMethod, relatedId: withdrawal.id });
    setModal(null); setWdAmount(''); setWdNumber(''); setWdMsg('');
  };

  const handleCancelWithdrawal = (withdrawalId: string) => {
    if (window.confirm('Cancel this withdrawal request? The amount will be refunded to your wallet.')) {
      mockData.cancelWithdrawal(withdrawalId);
    }
  };

  const handlePointsTopup = () => {
    if (liveUser.walletBalance < selectedPkg.bdt) { alert('Insufficient BDT balance'); return; }
    mockData.topupPoints(user.id, selectedPkg.points, selectedPkg.bdt);
    setModal(null);
  };

  const totalCredit = transactions.filter((t: any) => ['add','upload_reward'].includes(t.type) && t.status === 'approved').reduce((s: number, t: any) => s + t.amount, 0);
  const totalDebit  = transactions.filter((t: any) => ['purchase','withdrawal','membership'].includes(t.type) && t.status === 'approved').reduce((s: number, t: any) => s + t.amount, 0);
  const pendingBdt  = transactions.filter((t: any) => t.type === 'add' && t.status === 'pending').reduce((s: number, t: any) => s + t.amount, 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDF6F0' }}>
      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT }}>My Wallet</h2>

        {/* Balance cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* BDT */}
          <div className="rounded-2xl shadow-lg p-6 text-white" style={{ background: `linear-gradient(135deg, ${ACCENT}, #f7a35c)` }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/80 text-sm font-medium">BDT Balance</p>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <WalletIcon size={20} />
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">৳{liveUser.walletBalance?.toFixed(2) ?? '0.00'}</h3>
            {pendingBdt > 0 && (
              <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2.5 py-1.5 mb-3 text-xs font-semibold">
                <Clock size={13} /> ৳{pendingBdt.toFixed(2)} pending admin approval
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button onClick={() => setModal('add')}
                className="bg-white text-[#E56E20] py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-orange-50 transition-colors shadow-sm">
                <Plus size={15} /> Add BDT
              </button>
              <button onClick={() => setModal('withdraw')}
                className="bg-white/20 text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-white/30 transition-colors">
                <ArrowDown size={15} /> Withdraw
              </button>
            </div>
          </div>

          {/* Points */}
          <div className="rounded-2xl shadow-lg p-6 text-white" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/80 text-sm font-medium">Reward Points</p>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Award size={20} />
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">{liveUser.rewardPoints ?? 0} <span className="text-xl font-semibold text-white/70">pts</span></h3>
            <p className="text-white/70 text-xs mb-4">Use to purchase resources · Earn by selling</p>
            <button onClick={() => setModal('points')}
              className="w-full bg-white/20 text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-white/30 transition-colors">
              <Zap size={15} /> Top Up Points with BDT
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Credited', value: `৳${totalCredit}`, icon: TrendingUp, color: '#10B981', bg: '#ECFDF5' },
            { label: 'Total Spent', value: `৳${totalDebit}`, icon: ArrowDownRight, color: '#EF4444', bg: '#FEF2F2' },
            { label: 'Transactions', value: transactions.length, icon: WalletIcon, color: ACCENT, bg: '#FFF5F0' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Transaction history */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Transaction History</h3>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <RefreshCw size={24} className="animate-spin" style={{ color: ACCENT }} />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <WalletIcon size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((t: any) => {
                const isCredit = ['add', 'upload_reward', 'topup_points'].includes(t.type) && t.type !== 'topup_points';
                const isPointsTopup = t.type === 'topup_points';
                const isDebit = ['purchase', 'withdrawal', 'membership'].includes(t.type);
                const isWithdrawal = t.type === 'withdrawal';
                const pendingWithdrawal = isWithdrawal && t.status === 'pending'
                  ? mockData.withdrawals.find((w: any) => w.relatedId === t.id || w.id === t.relatedId)
                  : null;
                const cancelableWithdrawal = isWithdrawal && t.status === 'pending'
                  ? mockData.withdrawals.find((w: any) => w.id === t.relatedId && w.status === 'pending')
                  : null;
                return (
                  <div key={t.id} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isDebit ? 'bg-red-50' : isPointsTopup ? 'bg-purple-50' : 'bg-green-50'
                      }`}>
                        {isDebit ? <ArrowDownRight size={18} className="text-red-500" /> :
                         isPointsTopup ? <Zap size={18} className="text-purple-500" /> :
                         <ArrowUpRight size={18} className="text-green-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{t.description}</p>
                        <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2 flex-wrap justify-end">
                      <span className={`font-bold ${isDebit ? 'text-red-500' : isPointsTopup ? 'text-purple-600' : 'text-green-600'}`}>
                        {isDebit ? '-' : '+'}{t.currency === 'BDT' ? '৳' : ''}{t.amount}{t.currency === 'Points' ? ' pts' : ''}
                      </span>
                      {t.status === 'pending' && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><Clock size={10} />Pending</span>}
                      {t.status === 'approved' && <CheckCircle2 size={14} className="text-green-500" />}
                      {t.status === 'rejected' && <XCircle size={14} className="text-red-400" />}
                      {cancelableWithdrawal && (
                        <button
                          onClick={() => handleCancelWithdrawal(cancelableWithdrawal.id)}
                          className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 hover:bg-red-100 transition-colors"
                        >
                          <Ban size={10} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* ── Modals ── */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">

              {/* Add BDT */}
              {modal === 'add' && <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold">Add BDT to Wallet</h3>
                  <button onClick={() => { setModal(null); setAddAmount(''); setAddPhone(''); setAddTrxNumber(''); setAddMsg(''); }} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
                </div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Amount (BDT)</label>
                <input type="number" value={addAmount} onChange={e => { setAddAmount(e.target.value); setAddMsg(''); }} placeholder="e.g. 500" min="10"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E56E20] outline-none mb-4 text-sm" />
                <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 mb-4 text-sm text-pink-900">
                  Send money to <strong>{MERCHANT_NUMBER}</strong> using the Send Money option, then submit your sender phone number and transaction number here.
                </div>
                {addMsg && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 mb-3">{addMsg}</p>}
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Payment Method</label>
                <div className="space-y-2 mb-5">
                  {[{ id: 'Bkash', label: 'bKash', emoji: '📱', color: '#E2136E' },
                    { id: 'Nagad', label: 'Nagad', emoji: '💳', color: '#F26522' }].map(m => (
                    <button key={m.id} onClick={() => setAddMethod(m.id as any)}
                      className={`w-full p-3 rounded-xl border-2 text-sm font-semibold text-left flex items-center gap-3 transition-all ${addMethod === m.id ? 'border-[#E56E20] bg-orange-50' : 'border-gray-200'}`}>
                      <span className="text-xl">{m.emoji}</span> {m.label}
                    </button>
                  ))}
                </div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Sender Phone Number</label>
                <input type="tel" value={addPhone} onChange={e => { setAddPhone(e.target.value.replace(/\D/g, '')); setAddMsg(''); }}
                  placeholder="01XXXXXXXXX" maxLength={11}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E56E20] outline-none mb-4 text-sm" />
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Transaction Number</label>
                <input type="text" value={addTrxNumber} onChange={e => { setAddTrxNumber(e.target.value); setAddMsg(''); }}
                  placeholder="Enter bKash/Nagad TrxID"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E56E20] outline-none mb-4 text-sm" />
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-4 flex items-center gap-2">
                  <Clock size={13} /> Your balance will be credited after admin approval.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => { setModal(null); setAddAmount(''); setAddPhone(''); setAddTrxNumber(''); setAddMsg(''); }} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm hover:bg-gray-50">Cancel</button>
                  <button onClick={handleAddBdt} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm" style={{ background: `linear-gradient(135deg, ${ACCENT}, #f7a35c)` }}>Submit Request</button>
                </div>
              </>}

              {/* Withdraw */}
              {modal === 'withdraw' && <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold">Withdraw BDT</h3>
                  <button onClick={() => { setModal(null); setWdAmount(''); setWdNumber(''); setWdMsg(''); }} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-sm">
                  <p className="font-semibold text-gray-800">Available: <span style={{ color: ACCENT }}>৳{liveUser.walletBalance?.toFixed(2)}</span></p>
                </div>
                {wdMsg && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 mb-3">{wdMsg}</p>}
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Amount (min ৳50)</label>
                <input type="number" value={wdAmount} onChange={e => { setWdAmount(e.target.value); setWdMsg(''); }} placeholder="e.g. 200" min="50"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E56E20] outline-none mb-4 text-sm" />
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Method</label>
                <div className="flex gap-2 mb-4">
                  {[{ id: 'Bkash', emoji: '📱' }, { id: 'Nagad', emoji: '💳' }].map(m => (
                    <button key={m.id} onClick={() => setWdMethod(m.id as any)}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${wdMethod === m.id ? 'border-[#E56E20] bg-orange-50 text-[#E56E20]' : 'border-gray-200'}`}>
                      <span>{m.emoji}</span> {m.id}
                    </button>
                  ))}
                </div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">{wdMethod} Number</label>
                <input type="tel" value={wdNumber} onChange={e => { setWdNumber(e.target.value.replace(/\D/g, '')); setWdMsg(''); }}
                  placeholder="01XXXXXXXXX" maxLength={11}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E56E20] outline-none mb-5 text-sm" />
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-4 flex items-center gap-2">
                  <Clock size={13} /> Withdrawal is processed after admin approval (1-2 business days).
                </p>
                <div className="flex gap-3">
                  <button onClick={() => { setModal(null); setWdAmount(''); setWdNumber(''); setWdMsg(''); }} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm hover:bg-gray-50">Cancel</button>
                  <button onClick={handleWithdraw} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm" style={{ background: `linear-gradient(135deg, ${ACCENT}, #f7a35c)` }}>Request Withdrawal</button>
                </div>
              </>}

              {/* Points Topup */}
              {modal === 'points' && <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold">Top Up Reward Points</h3>
                  <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-4 text-sm flex items-center justify-between">
                  <span className="text-gray-600">Your BDT balance:</span>
                  <span className="font-bold" style={{ color: ACCENT }}>৳{liveUser.walletBalance?.toFixed(2)}</span>
                </div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Select Package</label>
                <div className="space-y-2 mb-5">
                  {POINT_PACKAGES.map(pkg => (
                    <button key={pkg.points} onClick={() => setSelectedPkg(pkg)}
                      className={`w-full p-3.5 rounded-xl border-2 flex items-center justify-between transition-all ${selectedPkg.points === pkg.points ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⚡</span>
                        <span className="font-bold text-gray-800">{pkg.points} Points</span>
                      </div>
                      <span className="font-bold" style={{ color: ACCENT }}>৳{pkg.bdt}</span>
                    </button>
                  ))}
                </div>
                {liveUser.walletBalance < selectedPkg.bdt && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 mb-3">Insufficient BDT balance. Please add funds first.</p>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm hover:bg-gray-50">Cancel</button>
                  <button onClick={handlePointsTopup} disabled={liveUser.walletBalance < selectedPkg.bdt}
                    className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' }}>
                    Buy {selectedPkg.points} pts for ৳{selectedPkg.bdt}
                  </button>
                </div>
              </>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
