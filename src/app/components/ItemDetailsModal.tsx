import { X, FileText, Download, Star, User, Calendar, Award, ShoppingCart, Coins } from 'lucide-react';
import { useMockData, Resource, Feedback as FeedbackType } from '../utils/MockDataContext';
import { StarRating } from './StarRating';
import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';

interface ItemDetailsModalProps {
  resourceId: string;
  onClose: () => void;
  onAddToCart?: () => void;
}

export function ItemDetailsModal({ resourceId, onClose, onAddToCart }: ItemDetailsModalProps) {
  const mockData = useMockData();
  const currentUser = mockData.currentUser;
  const [resource, setResource] = useState<Resource | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [uploader, setUploader] = useState<any>(null);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    // Get resource details
    const res = mockData.resources.find(r => r.id === resourceId);
    setResource(res || null);

    if (res) {
      // Get uploader details
      const uploaderUser = mockData.users.find(u => u.id === res.uploadedBy);
      setUploader(uploaderUser);

      // Get feedbacks for this resource
      const resourceFeedbacks = mockData.feedbacks?.filter(
        f => f.type === 'item' && f.itemId === resourceId
      ) || [];
      setFeedbacks(resourceFeedbacks);

      // Check if user has already purchased
      const purchased = mockData.purchases?.some(
        p => p.resourceId === resourceId && p.userId === currentUser?.id
      ) || false;
      setHasPurchased(purchased);
    }
  }, [resourceId, mockData, currentUser]);

  if (!resource) {
    return null;
  }

  const handleAddToCart = () => {
    if (hasPurchased) {
      toast.error('You already own this resource');
      return;
    }

    const alreadyInCart = mockData.getCartItems().some(item => item.resourceId === resourceId);
    if (alreadyInCart) {
      toast.info('Item already in cart');
      return;
    }

    mockData.addToCart(resourceId);
    toast.success('Added to cart');
    if (onAddToCart) {
      onAddToCart();
    }
  };

  // Calculate average rating from feedbacks
  const averageRating = feedbacks.length > 0
    ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
    : resource.rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200" style={{ backgroundColor: '#F0D7C7' }}>
          <h2 className="text-2xl font-bold text-gray-900">Resource Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Resource Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-4 mb-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D4ECF7' }}>
                <FileText size={32} style={{ color: '#E56E20' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <StarRating rating={averageRating} size="sm" />
                    <span className="text-sm text-gray-600 ml-1">
                      {averageRating.toFixed(1)} ({feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Download size={16} />
                    <span>{resource.downloads} downloads</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {resource.priceType === 'money' ? (
                    <>
                      <span className="text-2xl font-bold" style={{ color: '#E56E20' }}>৳{resource.price}</span>
                      <span className="text-sm text-gray-600">BDT</span>
                    </>
                  ) : (
                    <>
                      <Coins size={20} style={{ color: '#E56E20' }} />
                      <span className="text-2xl font-bold" style={{ color: '#E56E20' }}>{resource.price}</span>
                      <span className="text-sm text-gray-600">Points</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{resource.description}</p>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <FileText size={16} className="text-gray-400" />
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-gray-900">{resource.category}</span>
              </div>
              {resource.department && (
                <div className="flex items-center gap-2 text-sm">
                  <Award size={16} className="text-gray-400" />
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium text-gray-900">{resource.department}</span>
                </div>
              )}
              {resource.course && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText size={16} className="text-gray-400" />
                  <span className="text-gray-600">Course:</span>
                  <span className="font-medium text-gray-900">{resource.course}</span>
                </div>
              )}
              {resource.semester && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600">Semester:</span>
                  <span className="font-medium text-gray-900">{resource.semester}</span>
                </div>
              )}
            </div>

            {/* Uploader Info */}
            {uploader && (
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F0D7C7' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4ECF7' }}>
                  <User size={20} style={{ color: '#E56E20' }} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Uploaded by</p>
                  <p className="font-medium text-gray-900">{uploader.name}</p>
                  <p className="text-xs text-gray-500">{uploader.university}</p>
                </div>
              </div>
            )}
          </div>

          {/* Feedbacks Section */}
          <div className="p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              Reviews & Ratings ({feedbacks.length})
            </h4>

            {feedbacks.length === 0 ? (
              <div className="text-center py-8">
                <Star size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No reviews yet</p>
                <p className="text-sm text-gray-400 mt-1">Be the first to review this resource</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbacks.map((feedback) => {
                  const feedbackUser = mockData.users.find(u => u.id === feedback.userId);
                  return (
                    <div key={feedback.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4ECF7' }}>
                            <User size={16} style={{ color: '#E56E20' }} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{feedbackUser?.name || 'Anonymous'}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <StarRating rating={feedback.rating} size="sm" />
                      </div>
                      <p className="text-gray-700 text-sm">{feedback.comment}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200" style={{ backgroundColor: '#F0D7C7' }}>
          <div className="flex gap-3">
            {hasPurchased ? (
              <div className="flex-1 py-3 px-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-green-700 font-medium">You own this resource</p>
              </div>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#E56E20' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#C85E1A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#E56E20';
                  }}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg font-medium border-2 transition-colors"
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
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}