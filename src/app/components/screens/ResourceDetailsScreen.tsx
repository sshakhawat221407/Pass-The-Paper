import { FileText, User, MessageSquare, ShoppingCart } from 'lucide-react';
import { Header } from '../Header';
import { Button } from '../Button';
import { VerifiedBadge } from '../VerifiedBadge';
import { StarRating } from '../StarRating';
import { Footer } from '../Footer';
import { Screen } from '../../App';

interface ResourceDetailsScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function ResourceDetailsScreen({ onNavigate }: ResourceDetailsScreenProps) {
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Resource Details" onBack={() => onNavigate('browse')} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Resource Info */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">CSE 101 Final Exam 2023</h2>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="font-medium">Computer Science</span>
            <span>•</span>
            <span>Fall 2023</span>
            <span>•</span>
            <span>Previous Year Question</span>
          </div>

          {/* Preview */}
          <div className="rounded-lg p-8 mb-4 flex items-center justify-center" style={{ backgroundColor: '#D4ECF7' }}>
            <FileText size={48} color="#E56E20" />
          </div>

          <p className="text-sm text-gray-700 mb-4">
            Complete final exam question paper for CSE 101 from Fall 2023. Includes all sections with detailed problems and mark distribution. Perfect for exam preparation.
          </p>

          {/* Seller Info */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2">Uploaded by</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <User size={20} color="#666666" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">Anonymous User</span>
                  <VerifiedBadge />
                </div>
                <StarRating rating={4} size={14} />
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 mt-3">
              <p className="text-xs text-green-800">✓ Verified student seller • Safe transaction guaranteed</p>
            </div>
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm text-gray-700">Price</span>
            <span className="text-xl font-bold" style={{ color: '#E56E20' }}>150 points</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-3">
            <Button fullWidth onClick={() => onNavigate('cart')} variant="outline">
              <ShoppingCart size={18} className="inline mr-2" />
              Add to Cart
            </Button>
            <Button fullWidth onClick={() => onNavigate('checkout')}>
              Buy Now
            </Button>
          </div>
          <p className="text-xs text-center text-gray-600 mt-2">
            Instant access after successful payment
          </p>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={18} color="#E56E20" />
            <h3 className="font-semibold text-gray-900">Anonymous Feedback</h3>
          </div>

          <div className="space-y-3">
            <div className="border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={5} size={14} />
                <span className="text-xs text-gray-600">2 days ago</span>
              </div>
              <p className="text-sm text-gray-700">
                Excellent resource! Very helpful for exam preparation. All questions were clearly scanned.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={4} size={14} />
                <span className="text-xs text-gray-600">1 week ago</span>
              </div>
              <p className="text-sm text-gray-700">
                Good quality paper. Would recommend to others preparing for finals.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={5} size={14} />
                <span className="text-xs text-gray-600">2 weeks ago</span>
              </div>
              <p className="text-sm text-gray-700">
                Perfect! Exactly what I needed for my studies.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}