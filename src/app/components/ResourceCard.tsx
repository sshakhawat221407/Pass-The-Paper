import { FileText, Coins, Star } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  subject: string;
  semester: string;
  type: string;
  price?: number;
  points?: number;
  onClick?: () => void;
}

export function ResourceCard({ title, subject, semester, type, price, points, onClick }: ResourceCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#E56E20] transition-all duration-200 hover:shadow-2xl hover:scale-105 group"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: '#D4ECF7' }}>
          <FileText size={32} color="#E56E20" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span className="font-medium">{subject}</span>
            <span>•</span>
            <span>{semester}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#FFF5F0', color: '#E56E20' }}>
              {type}
            </span>
            <div className="flex items-center gap-2">
              {price !== undefined ? (
                <span className="text-xl font-bold" style={{ color: '#E56E20' }}>৳{price}</span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Coins size={20} color="#E56E20" />
                  <span className="text-xl font-bold" style={{ color: '#E56E20' }}>{points}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}