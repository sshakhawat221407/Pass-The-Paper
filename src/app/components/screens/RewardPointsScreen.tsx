import { Coins, Gift, TrendingUp, Award } from 'lucide-react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Screen } from '../../App';

interface RewardPointsScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
}

export function RewardPointsScreen({ onNavigate, onBack }: RewardPointsScreenProps) {
  const activities = [
    { id: 1, title: 'Uploaded: CSE 101 Final Exam', points: 200, date: '2024-01-08', type: 'earned' },
    { id: 2, title: 'Redeemed: Physics Lab Reports', points: 200, date: '2024-01-07', type: 'spent' },
    { id: 3, title: 'Daily Login Bonus', points: 50, date: '2024-01-07', type: 'earned' },
    { id: 4, title: 'Uploaded: Data Structures Notes', points: 150, date: '2024-01-05', type: 'earned' },
    { id: 5, title: 'Membership Bonus', points: 500, date: '2024-01-01', type: 'earned' },
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onNavigate('wallet');
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Reward Points" onBack={handleBack} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Points Summary */}
        <div className="rounded-xl p-6 mb-4 border border-gray-200" style={{ backgroundColor: '#D4ECF7' }}>
          <div className="flex items-center gap-2 mb-2">
            <Coins size={24} color="#E56E20" />
            <p className="text-sm text-gray-600">Your Total Points</p>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">1,250</p>
          <p className="text-xs text-gray-600">= ৳1,250 value for resources</p>
        </div>

        {/* How to Earn */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} color="#E56E20" />
            <h3 className="font-semibold text-gray-900">How to Earn Points</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4ECF7' }}>
                <Gift size={16} color="#E56E20" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Upload Resources</p>
                <p className="text-xs text-gray-600">Earn 100-300 points per upload</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4ECF7' }}>
                <Award size={16} color="#E56E20" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Daily Login</p>
                <p className="text-xs text-gray-600">Earn 50 points every day</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4ECF7' }}>
                <Coins size={16} color="#E56E20" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Membership Benefits</p>
                <p className="text-xs text-gray-600">Get bonus points monthly</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Redeem */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Gift size={18} color="#E56E20" />
            <h3 className="font-semibold text-gray-900">How to Redeem</h3>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            Use your points to access premium resources without spending money.
          </p>
          <p className="text-xs text-gray-600">
            1 point = ৳1 value for resource purchases
          </p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between pb-3 border-b border-gray-100 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm mb-1">{activity.title}</p>
                  <p className="text-xs text-gray-600">{activity.date}</p>
                </div>
                <p 
                  className="font-semibold text-sm flex-shrink-0 ml-2"
                  style={{ color: activity.type === 'earned' ? '#10B981' : '#EF4444' }}
                >
                  {activity.type === 'earned' ? '+' : '-'}{activity.points}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}