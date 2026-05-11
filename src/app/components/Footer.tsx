import { useState } from 'react';
import { Phone, Mail, Facebook, Instagram, X, BookOpen } from 'lucide-react';

export function Footer() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <>
      <footer className="border-t border-gray-200 bg-white py-3 px-4 mt-auto">
        <div className="max-w-[1800px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Copyright */}
          <p className="text-xs text-gray-500 font-medium">
            © 2025 <span style={{ color: '#E56E20' }} className="font-semibold">Pass The Paper</span> · Academic Resource Marketplace
          </p>

          {/* Right: Links */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowFollowModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:bg-orange-50"
              style={{ color: '#E56E20' }}
            >
              Follow Us
            </button>
            <span className="text-gray-300">·</span>
            <button
              onClick={() => setShowContactModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:bg-orange-50"
              style={{ color: '#E56E20' }}
            >
              Contact
            </button>
            <span className="text-gray-300">·</span>
            <button
              onClick={() => setShowRulesModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:bg-orange-50"
              style={{ color: '#E56E20' }}
            >
              Rules
            </button>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF0E8' }}>
                  <Mail size={16} style={{ color: '#E56E20' }} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Contact Us</h2>
              </div>
              <button onClick={() => setShowContactModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                <Mail size={18} style={{ color: '#E56E20' }} />
                <span className="text-sm text-gray-700">support@passthepaper.com</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                <Phone size={18} style={{ color: '#E56E20' }} />
                <span className="text-sm text-gray-700">+880 1XXX-XXXXXX</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follow Modal */}
      {showFollowModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF0E8' }}>
                  <BookOpen size={16} style={{ color: '#E56E20' }} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Follow Us</h2>
              </div>
              <button onClick={() => setShowFollowModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <a href="https://facebook.com/passthepaper" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-colors">
                <Facebook size={18} style={{ color: '#E56E20' }} />
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </a>
              <a href="https://instagram.com/passthepaper" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-colors">
                <Instagram size={18} style={{ color: '#E56E20' }} />
                <span className="text-sm font-medium text-gray-700">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Rules & Regulations</h2>
              <button onClick={() => setShowRulesModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 text-sm text-gray-700">
              {[
                { title: '1. Eligibility', points: ['All users must be verified university students with a valid .edu email.', 'Users must provide accurate student ID during registration.'] },
                { title: '2. Content Guidelines', points: ['Uploaded resources must be academically relevant.', 'All content must comply with copyright laws.', 'Plagiarized or fraudulent content is strictly prohibited.'] },
                { title: '3. Upload Approval', points: ['All resources require admin approval before publishing.', 'Admins may reject content violating guidelines.', 'Users will be notified of approval/rejection.'] },
                { title: '4. Transactions & Wallet', points: ['All transactions are final once completed.', 'Withdrawals may take 3-5 business days.', 'Minimum withdrawal amount is 100 points.'] },
                { title: '5. Prohibited Activities', points: ['Selling copyrighted material without permission.', 'Creating multiple accounts for fraudulent purposes.', 'Harassment or inappropriate behavior towards other users.'] },
              ].map((section) => (
                <div key={section.title}>
                  <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
                  {section.points.map((p, i) => <p key={i} className="text-gray-600 mb-1">• {p}</p>)}
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 mt-2">
                <p className="text-xs text-gray-400">Last Updated: January 24, 2026 · support@passthepaper.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
