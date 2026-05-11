import { useState } from 'react';
import { FileText, CheckCircle, Clock, Upload, X, Star, Download, Receipt } from 'lucide-react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Screen } from '../../App';
import { useMockData } from '../../utils/MockDataContext';
import { BillGenerator } from '../BillGenerator';
import { toast } from 'sonner';

interface HistoryScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
  initialTab?: 'purchases' | 'uploads';
}

export function HistoryScreen({ onNavigate, onBack, initialTab = 'purchases' }: HistoryScreenProps) {
  const [activeTab, setActiveTab] = useState<'purchases' | 'uploads'>(initialTab);
  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  const [showBill, setShowBill] = useState<string | null>(null);
  const mockData = useMockData();
  const currentUser = mockData.currentUser;
  
  // Get user's purchases
  const purchases = mockData.purchases
    .filter(p => p.userId === currentUser?.id)
    .map(p => {
      const resource = mockData.resources.find(r => r.id === p.resourceId);
      return {
        ...p,
        resource
      };
    })
    .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime());

  // Get user's uploads
  const uploads = mockData.resources
    .filter(r => r.uploadedBy === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const cartItemCount = mockData.getCartItems().length;
  const notificationCount = mockData.getNotifications().filter(n => !n.isRead).length;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onNavigate('profile');
    }
  };

  const handleDownloadResource = (resourceId: string, resourceTitle: string) => {
    // Simulate download
    toast.success(`Downloading "${resourceTitle}"...`);
    // In a real app, this would trigger actual file download
    setTimeout(() => {
      toast.success('Download complete!');
    }, 1500);
  };

  const handleViewBill = (purchaseId: string) => {
    setShowBill(purchaseId);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header 
        title="History" 
        onBack={handleBack}
      />
      
      <div className="flex-1 overflow-y-auto">
        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-4 pt-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('purchases')}
              className={`pb-3 px-2 border-b-2 transition-colors ${
                activeTab === 'purchases'
                  ? 'font-semibold'
                  : 'text-gray-600 border-transparent'
              }`}
              style={{
                borderColor: activeTab === 'purchases' ? '#E56E20' : undefined,
                color: activeTab === 'purchases' ? '#E56E20' : undefined
              }}
            >
              Purchase History
            </button>
            <button
              onClick={() => setActiveTab('uploads')}
              className={`pb-3 px-2 border-b-2 transition-colors ${
                activeTab === 'uploads'
                  ? 'font-semibold'
                  : 'text-gray-600 border-transparent'
              }`}
              style={{
                borderColor: activeTab === 'uploads' ? '#E56E20' : undefined,
                color: activeTab === 'uploads' ? '#E56E20' : undefined
              }}
            >
              My Uploads
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-4 pb-4">
          {activeTab === 'purchases' ? (
            <div className="space-y-3">
              {purchases.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#D4ECF7' }}>
                    <FileText size={24} color="#E56E20" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">No purchases yet</p>
                  <p className="text-xs text-gray-500">Start exploring resources to make your first purchase</p>
                </div>
              ) : (
                purchases.map((purchase) => (
                  <div 
                    key={purchase.id} 
                    className="bg-white rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4ECF7' }}>
                        <FileText size={20} color="#E56E20" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{purchase.resource?.title || 'Resource'}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
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
                        <div className="flex items-center gap-1.5 mb-3">
                          <CheckCircle size={14} color="#10B981" />
                          <span className="text-xs text-green-700 font-medium">Completed</span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownloadResource(purchase.resourceId, purchase.resource?.title || 'Resource')}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium text-white transition-colors"
                            style={{ backgroundColor: '#E56E20' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#C85E1A';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#E56E20';
                            }}
                          >
                            <Download size={16} />
                            Download
                          </button>
                          <button
                            onClick={() => handleViewBill(purchase.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium border-2 transition-colors"
                            style={{ borderColor: '#E56E20', color: '#E56E20' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#E56E20';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#E56E20';
                            }}
                          >
                            <Receipt size={16} />
                            View Bill
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {uploads.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#D4ECF7' }}>
                    <Upload size={24} color="#E56E20" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">No uploads yet</p>
                  <p className="text-xs text-gray-500">Share your resources to start earning</p>
                  <button
                    onClick={() => onNavigate('upload')}
                    className="mt-3 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ backgroundColor: '#E56E20' }}
                  >
                    Upload Resource
                  </button>
                </div>
              ) : (
                uploads.map((upload) => (
                  <div 
                    key={upload.id} 
                    onClick={() => setSelectedResource(upload)}
                    className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4ECF7' }}>
                        <Upload size={20} color="#E56E20" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{upload.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                          <span>{new Date(upload.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>
                            {upload.priceType === 'money' 
                              ? `৳${upload.price}` 
                              : upload.price === 0 
                                ? 'Free'
                                : `${upload.price} Points`}
                          </span>
                          <span>•</span>
                          <span>{upload.downloads} downloads</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {upload.status === 'approved' && (
                            <>
                              <CheckCircle size={14} color="#10B981" />
                              <span className="text-xs text-green-700 font-medium">Approved</span>
                            </>
                          )}
                          {upload.status === 'pending' && (
                            <>
                              <Clock size={14} color="#F59E0B" />
                              <span className="text-xs text-yellow-700 font-medium">Pending</span>
                            </>
                          )}
                          {upload.status === 'rejected' && (
                            <>
                              <FileText size={14} color="#EF4444" />
                              <span className="text-xs text-red-700 font-medium">Rejected</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
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
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-900">Purchase Receipt</h3>
              <button
                onClick={() => setShowBill(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} color="#666" />
              </button>
            </div>

            {/* Bill Content */}
            <div className="p-6">
              <BillGenerator purchaseId={showBill} />
            </div>
          </div>
        </div>
      )}

      {/* Resource Details Modal */}
      {selectedResource && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedResource(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-900">Resource Details</h3>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} color="#666" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-4">
                <div className="w-full h-32 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#D4ECF7' }}>
                  <FileText size={48} color="#E56E20" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedResource.title}</h2>
                <p className="text-sm text-gray-700 mb-4">{selectedResource.description}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedResource.category}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Department</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedResource.department || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Course</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedResource.course || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="text-sm font-semibold" style={{ color: '#E56E20' }}>
                    {selectedResource.priceType === 'money' 
                      ? `৳${selectedResource.price}` 
                      : selectedResource.price === 0 
                        ? 'Free' 
                        : `${selectedResource.price} Points`}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Downloads</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedResource.downloads}</span>
                </div>
                {selectedResource.rating > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < selectedResource.rating ? '#E56E20' : 'none'}
                          color={i < selectedResource.rating ? '#E56E20' : '#D1D5DB'}
                        />
                      ))}
                      <span className="text-sm font-semibold text-gray-900 ml-1">
                        {selectedResource.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Uploaded</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {new Date(selectedResource.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedResource(null)}
                className="w-full py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#E56E20' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}