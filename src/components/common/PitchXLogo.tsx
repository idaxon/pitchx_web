import React from 'react';

interface PitchXLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PitchXLogo: React.FC<PitchXLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  // Generous, prominent, crisp sizing
  const heightClass =
    size === 'sm' ? 'h-8' : size === 'lg' ? 'h-13' : 'h-10 sm:h-11';

  return (
    <div className={`flex items-center group select-none cursor-pointer ${className}`}>
      <div className="relative flex items-center py-0.5">
        {/* Official PitchX Logo (pxlogogo.png) */}
        <img
          src="/pxlogogo.png"
          alt="pitchx"
          className={`${heightClass} w-auto object-contain mix-blend-multiply transition-all duration-200 ease-out group-hover:opacity-90 group-hover:scale-[1.02]`}
          loading="eager"
        />
      </div>
    </div>
  );
};
