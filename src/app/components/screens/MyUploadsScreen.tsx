import { useState } from 'react';
import { FileText, CheckCircle, Clock, Upload, X, Star, ChevronLeft } from 'lucide-react';
import { Footer } from '../Footer';
import { Screen } from '../../App';
import { useMockData } from '../../utils/MockDataContext';

interface MyUploadsScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
}

export function MyUploadsScreen({ onNavigate, onBack }: MyUploadsScreenProps) {
  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  const mockData = useMockData();
  const currentUser = mockData.currentUser;

  const uploads = mockData.resources
    .filter((r: any) => r.uploadedBy === currentUser?.id)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleBack = () => {
    if (onBack) onBack();
    else onNavigate('profile');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDF6F0' }}>
      {/* Page Title Row */}
      <div className="flex items-center gap-2 px-4 pt-5 pb-3">
        <button onClick={handleBack} className="p-2 rounded-lg hover:bg-white/60 transition-colors">
          <ChevronLeft size={22} color="#E56E20" />
        </button>
        <h2 className="text-2xl font-bold" style={{ color: '#E56E20' }}>My Uploads</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {uploads.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: '#D4ECF7' }}
            >
              <Upload size={24} color="#E56E20" />
            </div>
            <p className="text-sm text-gray-600 mb-1">No uploads yet</p>
            <p className="text-xs text-gray-500">Share your resources to start earning</p>
            <button
              onClick={() => onNavigate('upload')}
              className="mt-4 px-5 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: '#E56E20' }}
            >
              Upload Resource
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl mx-auto">
            {uploads.map((upload: any) => (
              <div
                key={upload.id}
                onClick={() => setSelectedResource(upload)}
                className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#D4ECF7' }}
                  >
                    <Upload size={20} color="#E56E20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{upload.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-2">
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
                          <span className="text-xs text-yellow-700 font-medium">Pending Review</span>
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
            ))}
          </div>
        )}
      </div>

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
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-900">Resource Details</h3>
              <button onClick={() => setSelectedResource(null)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} color="#666" />
              </button>
            </div>
            <div className="p-4">
              <div
                className="w-full h-32 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: '#D4ECF7' }}
              >
                <FileText size={48} color="#E56E20" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedResource.title}</h2>
              <p className="text-sm text-gray-700 mb-4">{selectedResource.description}</p>

              <div className="space-y-3 mb-4">
                {[
                  ['Category', selectedResource.category],
                  ['Department', selectedResource.department || 'N/A'],
                  ['Course', selectedResource.course || 'N/A'],
                  ['Downloads', selectedResource.downloads],
                  [
                    'Price',
                    selectedResource.priceType === 'money'
                      ? `৳${selectedResource.price}`
                      : selectedResource.price === 0
                      ? 'Free'
                      : `${selectedResource.price} Points`,
                  ],
                  ['Uploaded', new Date(selectedResource.createdAt).toLocaleDateString()],
                ].map(([label, value]) => (
                  <div
                    key={label as string}
                    className="flex items-center justify-between py-2 border-b border-gray-100"
                  >
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">{value}</span>
                  </div>
                ))}

                {selectedResource.rating > 0 && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_: any, i: number) => (
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
