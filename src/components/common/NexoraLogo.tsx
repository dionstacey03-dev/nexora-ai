import React from 'react';

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', tagline: 'text-[9px]' },
    md: { icon: 36, text: 'text-lg', tagline: 'text-[10px]' },
    lg: { icon: 44, text: 'text-xl', tagline: 'text-xs' },
    xl: { icon: 56, text: 'text-2xl', tagline: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Custom NEXORA Hexagonal Crystalline Prism Mark */}
      <div 
        className="relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-violet-600 to-indigo-500 p-[1.5px] shadow-lg shadow-violet-500/20 group cursor-pointer transition-transform duration-200 hover:scale-105"
        style={{ width: currentSize.icon + 8, height: currentSize.icon + 8 }}
      >
        <div className="w-full h-full rounded-[14px] bg-[#090d16] dark:bg-[#070b12] flex items-center justify-center overflow-hidden relative">
          {/* Subtle glowing background in mark */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-violet-500/20 to-transparent pointer-events-none" />
          
          <svg
            width={currentSize.icon}
            height={currentSize.icon}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 transition-transform duration-300 group-hover:rotate-6"
          >
            <defs>
              <linearGradient id="logoNexoraGrad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="logoCoreGrad" x1="18" y1="18" x2="46" y2="46" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Outer Faceted Nexus Hexagon */}
            <path
              d="M32 6L56 19.5V44.5L32 58L8 44.5V19.5L32 6Z"
              stroke="url(#logoNexoraGrad)"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Inner Neural Convergence Struts */}
            <path
              d="M32 6L32 32M56 19.5L32 32M56 44.5L32 32M32 58L32 32M8 44.5L32 32M8 19.5L32 32"
              stroke="url(#logoNexoraGrad)"
              strokeWidth="1.5"
              strokeOpacity="0.45"
              strokeLinejoin="round"
            />

            {/* Central Intelligence Core */}
            <polygon points="32,21 43,32 32,43 21,32" fill="url(#logoCoreGrad)" />
            <circle cx="32" cy="32" r="3.5" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* Wordmark and Tagline */}
      {showWordmark && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${currentSize.text} leading-none font-sans`}>
              NEXORA
            </span>
            <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-xs">
              AI
            </span>
          </div>

          {showTagline ? (
            <span className={`text-slate-500 dark:text-slate-400 font-medium ${currentSize.tagline} tracking-tight mt-1 truncate`}>
              Ideas Into Intelligence. Intelligence Into Reality.
            </span>
          ) : (
            <span className={`text-slate-400 dark:text-slate-500 font-medium ${currentSize.tagline} tracking-wider mt-0.5 uppercase`}>
              Software Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
};
