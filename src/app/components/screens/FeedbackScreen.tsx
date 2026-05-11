import { useState } from 'react';
import { MessageSquare, Star, Edit2, Save, X, ChevronLeft } from 'lucide-react';
import { Button } from '../Button';
import { Footer } from '../Footer';
import { Screen } from '../../App';
import { useMockData } from '../../utils/MockDataContext';
import { toast } from 'sonner@2.0.3';

interface FeedbackScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
}

export function FeedbackScreen({ onNavigate, onBack }: FeedbackScreenProps) {
  const mockData = useMockData();
  const currentUser = mockData.currentUser;
  const feedbacks = mockData.getFeedbacks();
  const purchases = mockData.getUserPurchases();
  
  const [showSystemFeedback, setShowSystemFeedback] = useState(false);
  const [systemRating, setSystemRating] = useState(0);
  const [systemComment, setSystemComment] = useState('');
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  const cartItemCount = mockData.getCartItems().length;
  const notificationCount = mockData.getNotifications().filter(n => !n.isRead).length;

  const systemFeedback = feedbacks.find(f => f.type === 'system');
  
  // Only show feedbacks for purchased items
  const itemFeedbacks = feedbacks.filter(f => {
    if (f.type !== 'item' || !f.itemId) return false;
    // Check if the user has purchased this item
    return purchases.some(p => p.resourceId === f.itemId);
  });

  const handleSubmitSystemFeedback = () => {
    if (!currentUser) {
      toast.error('Please login');
      return;
    }

    if (!systemRating || !systemComment.trim()) {
      toast.error('Please provide rating and comment');
      return;
    }

    if (systemFeedback) {
      toast.error('You have already submitted system feedback');
      return;
    }

    mockData.addFeedback({
      userId: currentUser.id,
      type: 'system',
      rating: systemRating,
      comment: systemComment.trim(),
    });

    toast.success('System feedback submitted successfully');
    setShowSystemFeedback(false);
    setSystemRating(0);
    setSystemComment('');
  };

  const handleStartEdit = (feedback: any) => {
    setEditingFeedbackId(feedback.id);
    setEditRating(feedback.rating);
    setEditComment(feedback.comment);
  };

  const handleSaveEdit = (feedbackId: string) => {
    if (!editRating || !editComment.trim()) {
      toast.error('Please provide rating and comment');
      return;
    }

    // Update feedback
    const updatedFeedbacks = mockData.feedbacks?.map(f => 
      f.id === feedbackId 
        ? { ...f, rating: editRating, comment: editComment.trim(), updatedAt: new Date().toISOString() }
        : f
    );
    
    // Update in context
    if (updatedFeedbacks) {
      mockData.feedbacks = updatedFeedbacks;
    }

    toast.success('Feedback updated successfully');
    setEditingFeedbackId(null);
    setEditRating(0);
    setEditComment('');
  };

  const handleCancelEdit = () => {
    setEditingFeedbackId(null);
    setEditRating(0);
    setEditComment('');
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onNavigate('profile');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDF6F0' }}>
      {/* Page Title Row */}
      <div className="flex items-center gap-2 px-4 pt-5 pb-3">
        <button onClick={handleBack} className="p-2 rounded-lg hover:bg-white/60 transition-colors">
          <ChevronLeft size={22} color="#E56E20" />
        </button>
        <h2 className="text-2xl font-bold" style={{ color: '#E56E20' }}>Feedback</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* System Feedback Section */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">System Feedback</h3>
              <p className="text-xs text-gray-600">How's your experience with Pass The Paper?</p>
            </div>
            {!systemFeedback && (
              <button
                onClick={() => setShowSystemFeedback(!showSystemFeedback)}
                className="text-sm font-semibold"
                style={{ color: '#E56E20' }}
              >
                {showSystemFeedback ? 'Cancel' : 'Give Feedback'}
              </button>
            )}
          </div>

          {systemFeedback ? (
            editingFeedbackId === systemFeedback.id ? (
              // Edit Mode for System Feedback
              <div>
                <div className="mb-3">
                  <label className="text-sm text-gray-700 mb-2 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setEditRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={28}
                          fill={star <= editRating ? '#E56E20' : 'none'}
                          color={star <= editRating ? '#E56E20' : '#D1D5DB'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="text-sm text-gray-700 mb-2 block">Comment</label>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(systemFeedback.id)}
                    className="flex-1 px-3 py-2 rounded-lg text-white text-sm font-semibold"
                    style={{ backgroundColor: '#E56E20' }}
                  >
                    <Save size={16} className="inline mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold"
                  >
                    <X size={16} className="inline mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode for System Feedback
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#D4ECF7' }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        fill={star <= systemFeedback.rating ? '#E56E20' : 'none'}
                        color={star <= systemFeedback.rating ? '#E56E20' : '#D1D5DB'}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => handleStartEdit(systemFeedback)}
                    className="text-xs font-semibold flex items-center gap-1"
                    style={{ color: '#E56E20' }}
                  >
                    <Edit2 size={12} />
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-800">{systemFeedback.comment}</p>
                <p className="text-xs text-gray-600 mt-2">
                  {new Date(systemFeedback.createdAt).toLocaleDateString()}
                  {systemFeedback.updatedAt && ` • Edited ${new Date(systemFeedback.updatedAt).toLocaleDateString()}`}
                </p>
              </div>
            )
          ) : showSystemFeedback ? (
            <div>
              <div className="mb-3">
                <label className="text-sm text-gray-700 mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSystemRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        fill={star <= systemRating ? '#E56E20' : 'none'}
                        color={star <= systemRating ? '#E56E20' : '#D1D5DB'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="text-sm text-gray-700 mb-2 block">Comment</label>
                <textarea
                  placeholder="Tell us what you think..."
                  value={systemComment}
                  onChange={(e) => setSystemComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={4}
                />
              </div>
              <Button fullWidth onClick={handleSubmitSystemFeedback}>
                Submit Feedback
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-600 text-center py-2">
              You can submit system feedback once
            </p>
          )}
        </div>

        {/* Item Feedbacks Section */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-1">Item Feedbacks</h3>
          <p className="text-xs text-gray-600 mb-3">Feedback on resources you've purchased</p>

          {itemFeedbacks.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare size={32} color="#E56E20" className="mx-auto mb-2" />
              <p className="text-sm text-gray-600">No item feedback yet</p>
              <p className="text-xs text-gray-500 mt-1">Purchase resources and leave feedback</p>
            </div>
          ) : (
            <div className="space-y-3">
              {itemFeedbacks.map((feedback) => (
                <div key={feedback.id} className="p-3 rounded-lg border border-gray-200">
                  {editingFeedbackId === feedback.id ? (
                    // Edit Mode
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm">{feedback.itemTitle}</h4>
                      <div className="mb-3">
                        <label className="text-xs text-gray-700 mb-2 block">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setEditRating(star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                size={20}
                                fill={star <= editRating ? '#E56E20' : 'none'}
                                color={star <= editRating ? '#E56E20' : '#D1D5DB'}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-xs text-gray-700 mb-2 block">Comment</label>
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(feedback.id)}
                          className="flex-1 px-3 py-2 rounded-lg text-white text-sm font-semibold"
                          style={{ backgroundColor: '#E56E20' }}
                        >
                          <Save size={16} className="inline mr-1" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold"
                        >
                          <X size={16} className="inline mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">{feedback.itemTitle}</h4>
                        <button
                          onClick={() => handleStartEdit(feedback)}
                          className="text-xs font-semibold flex items-center gap-1"
                          style={{ color: '#E56E20' }}
                        >
                          <Edit2 size={12} />
                          Edit
                        </button>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            fill={star <= feedback.rating ? '#E56E20' : 'none'}
                            color={star <= feedback.rating ? '#E56E20' : '#D1D5DB'}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{feedback.comment}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                        {feedback.updatedAt && ` • Edited ${new Date(feedback.updatedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
