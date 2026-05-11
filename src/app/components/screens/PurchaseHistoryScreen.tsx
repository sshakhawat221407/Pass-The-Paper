import { useState } from 'react';
import { FileText, CheckCircle, Clock, X, Download, Receipt } from 'lucide-react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Screen } from '../../App';
import { useMockData } from '../../utils/MockDataContext';
import { BillGenerator } from '../BillGenerator';
import { toast } from 'sonner';

interface PurchaseHistoryScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
}

export function PurchaseHistoryScreen({ onNavigate, onBack }: PurchaseHistoryScreenProps) {
  const [showBill, setShowBill] = useState<string | null>(null);
  const mockData = useMockData();
  const currentUser = mockData.currentUser;

  const purchases = mockData.purchases
    .filter((p: any) => p.userId === currentUser?.id)
    .map((p: any) => {
      const resource = mockData.resources.find((r: any) => r.id === p.resourceId);
      return { ...p, resource };
    })
    .sort((a: any, b: any) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime());

  const handleBack = () => {
    if (onBack) onBack();
    else onNavigate('profile');
  };

  const handleDownload = (resourceTitle: string) => {
    toast.success(`Downloading "${resourceTitle}"...`);
    setTimeout(() => toast.success('Download complete!'), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Purchase History" onBack={handleBack} />

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {purchases.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: '#D4ECF7' }}
            >
              <FileText size={24} color="#E56E20" />
            </div>
            <p className="text-sm text-gray-600 mb-1">No purchases yet</p>
            <p className="text-xs text-gray-500">Start exploring resources to make your first purchase</p>
            <button
              onClick={() => onNavigate('browse')}
              className="mt-4 px-5 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: '#E56E20' }}
            >
              Browse Resources
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl mx-auto">
            {purchases.map((purchase: any) => (
              <div key={purchase.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#D4ECF7' }}
                  >
                    <FileText size={20} color="#E56E20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {purchase.resource?.title || 'Resource'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-2">
                      <span>{new Date(purchase.purchasedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>
                        {purchase.priceType === 'money'
                          ? `৳${purchase.price}`
                          : `${purchase.price} Points`}
                      </span>
                      {purchase.paymentMethod && (
                        <>
                          <span>•</span>
                          <span>{purchase.paymentMethod}</span>
                        </>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-1.5 mb-3">
                      {purchase.status === 'pending' ? (
                        <>
                          <Clock size={14} color="#F59E0B" />
                          <span className="text-xs text-yellow-700 font-medium">Pending Admin Approval</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} color="#10B981" />
                          <span className="text-xs text-green-700 font-medium">Completed</span>
                        </>
                      )}
                    </div>

                    {/* Action Buttons — only for completed purchases */}
                    {purchase.status !== 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(purchase.resource?.title || 'Resource')}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium text-white transition-colors"
                          style={{ backgroundColor: '#E56E20' }}
                        >
                          <Download size={16} />
                          Download
                        </button>
                        <button
                          onClick={() => setShowBill(purchase.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium border-2 transition-colors"
                          style={{ borderColor: '#E56E20', color: '#E56E20' }}
                        >
                          <Receipt size={16} />
                          View Bill
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bill Modal */}
      {showBill && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowBill(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-900">Purchase Receipt</h3>
              <button onClick={() => setShowBill(null)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} color="#666" />
              </button>
            </div>
            <div className="p-6">
              <BillGenerator purchaseId={showBill} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
