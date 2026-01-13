import React from 'react';

interface AnniversaryBannerProps {
  dateString?: string;
  title?: string;
  onClick: () => void;
}

export const AnniversaryBanner: React.FC<AnniversaryBannerProps> = ({ dateString, title = "我们相识", onClick }) => {
  const getDays = () => {
    if (!dateString) return null;
    const start = new Date(dateString);
    const now = new Date();
    // Reset time for accurate day calc
    start.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    
    const diff = now.getTime() - start.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days >= 0 ? days : 0; // Don't show negative if future date set as start
  };

  const days = getDays();

  return (
    <div 
      onClick={onClick}
      className="mx-4 mt-4 mb-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-3xl p-6 text-white shadow-lg shadow-pink-200/50 relative overflow-hidden cursor-pointer group transition-transform active:scale-[0.98]"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/20 rounded-full blur-xl -ml-10 -mb-10"></div>
      <i className="fas fa-heart absolute top-4 right-4 text-white/20 text-4xl transform rotate-12 group-hover:scale-110 transition-transform"></i>

      <div className="relative z-10 flex flex-col items-start">
        <div className="flex items-center gap-2 mb-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
          <i className="fas fa-calendar-alt text-xs"></i>
          <span className="text-xs font-medium">{title} 已经</span>
        </div>
        
        <div className="flex items-baseline gap-2 mt-1">
          {days !== null ? (
            <>
              <span className="text-6xl font-black tracking-tight drop-shadow-sm">{days}</span>
              <span className="text-xl font-bold opacity-90">天</span>
            </>
          ) : (
            <div className="flex items-center gap-2 py-2">
              <span className="text-xl font-bold">点击设置纪念日</span>
              <i className="fas fa-arrow-right animate-pulse"></i>
            </div>
          )}
        </div>
        
        {dateString && (
           <p className="text-xs opacity-75 mt-1 font-medium">Starting from {dateString}</p>
        )}
      </div>
    </div>
  );
};