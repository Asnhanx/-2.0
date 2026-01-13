import React from 'react';

interface MascotProps {
  className?: string;
  expressionId?: number; // 0-29 for different expressions
}

export const Mascot: React.FC<MascotProps> = ({ className = "w-32 h-32", expressionId = 0 }) => {
  // Define 6 Eye Styles
  const renderEyes = (type: number) => {
    switch (type) {
      case 0: // Normal
        return (
          <g>
            <circle cx="70" cy="98" r="9" fill="#3E2723" />
            <circle cx="130" cy="98" r="9" fill="#3E2723" />
            <circle cx="73" cy="95" r="3.5" fill="white" />
            <circle cx="133" cy="95" r="3.5" fill="white" />
          </g>
        );
      case 1: // Happy Arches (Closed)
        return (
          <g fill="none" stroke="#3E2723" strokeWidth="4" strokeLinecap="round">
            <path d="M60 98 Q70 90 80 98" />
            <path d="M120 98 Q130 90 140 98" />
          </g>
        );
      case 2: // Winking
        return (
          <g>
            <circle cx="70" cy="98" r="9" fill="#3E2723" />
            <circle cx="73" cy="95" r="3.5" fill="white" />
            <path d="M120 98 Q130 90 140 98" fill="none" stroke="#3E2723" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 3: // Starry Eyes
        return (
          <g fill="#4FC3F7">
             <path transform="translate(70,98) scale(0.6)" d="M0 -15 L4 -4 L15 0 L4 4 L0 15 L-4 4 L-15 0 L-4 -4 Z" />
             <path transform="translate(130,98) scale(0.6)" d="M0 -15 L4 -4 L15 0 L4 4 L0 15 L-4 4 L-15 0 L-4 -4 Z" />
          </g>
        );
      case 4: // Crying / Teary
        return (
           <g>
             <circle cx="70" cy="98" r="9" fill="#3E2723" />
             <circle cx="130" cy="98" r="9" fill="#3E2723" />
             <path d="M70 110 Q75 120 70 130 Q65 120 70 110" fill="#4FC3F7" opacity="0.8" />
             <path d="M130 110 Q135 120 130 130 Q125 120 130 110" fill="#4FC3F7" opacity="0.8" />
           </g>
        );
      case 5: // Line Eyes (Unimpressed/Sleepy)
        return (
          <g stroke="#3E2723" strokeWidth="4" strokeLinecap="round">
             <line x1="62" y1="98" x2="78" y2="98" />
             <line x1="122" y1="98" x2="138" y2="98" />
          </g>
        );
      default: return null;
    }
  };

  // Define 5 Mouth Styles
  const renderMouth = (type: number) => {
    switch (type) {
      case 0: // Small Smile
        return <path d="M 90 135 Q 100 140 110 135" stroke="#5D4037" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
      case 1: // Big Open Smile
        return <path d="M 85 130 Q 100 150 115 130 Z" fill="#E57373" />;
      case 2: // Cat Mouth :3
        return <path d="M 88 135 Q 94 140 100 135 Q 106 140 112 135" stroke="#5D4037" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
      case 3: // O Mouth (Surprised)
        return <circle cx="100" cy="135" r="6" fill="#5D4037" />;
      case 4: // Neutral/Flat
        return <line x1="90" y1="135" x2="110" y2="135" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round" />;
      default: return null;
    }
  };

  // Map 0-29 to Eye/Mouth Combinations
  // 6 eye types * 5 mouth types = 30 combinations
  const safeIndex = Math.abs(expressionId) % 30;
  const eyeType = Math.floor(safeIndex / 5);
  const mouthType = safeIndex % 5;

  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="1" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="headGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFEE58" /> {/* Lighter Yellow */}
          <stop offset="100%" stopColor="#FDD835" /> {/* Darker Yellow */}
        </linearGradient>
      </defs>

      <g filter="url(#softShadow)">
        {/* Ears - Round and cute */}
        <circle cx="45" cy="85" r="16" fill="#FDD835" />
        <circle cx="155" cy="85" r="16" fill="#FDD835" />

        {/* Head Base - Round/Oval */}
        <ellipse cx="100" cy="110" rx="72" ry="62" fill="url(#headGradient)" />

        {/* Orange on Top (The Signature Item) */}
        <g transform="translate(100, 52)">
          {/* Fruit */}
          <circle cx="0" cy="0" r="16" fill="#FB8C00" />
          {/* Shine */}
          <circle cx="-5" cy="-5" r="4" fill="#FFE0B2" opacity="0.6" />
          {/* Stem/Leaves */}
          <path d="M0 -16 Q-8 -26 0 -30 Q8 -26 0 -16" fill="#7CB342" />
          <path d="M0 -16 Q4 -22 10 -18" fill="none" stroke="#558B2F" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Snout Area - Big warm oval */}
        <ellipse cx="100" cy="125" rx="58" ry="34" fill="#FFB74D" />

        {/* Eyes - Dynamic */}
        {renderEyes(eyeType)}

        {/* Rosy Cheeks */}
        <ellipse cx="45" cy="115" rx="10" ry="6" fill="#FF8A65" opacity="0.5" />
        <ellipse cx="155" cy="115" rx="10" ry="6" fill="#FF8A65" opacity="0.5" />

        {/* Nostrils REMOVED per user request */}

        {/* Mouth - Dynamic */}
        {renderMouth(mouthType)}

        {/* Cute Details - little shine on snout */}
        <ellipse cx="85" cy="115" rx="4" ry="2" fill="white" opacity="0.3" transform="rotate(-20 85 115)" />
      </g>
    </svg>
  );
};