import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

const DEFAULT_BRAND_LOGO = '/logo.png';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  inverted?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  inverted = false,
  onClick,
}) => {
  const { companySettings } = useStore();
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-[130px] sm:w-[150px] h-auto object-contain',
    md: 'w-[155px] sm:w-[190px] md:w-[220px] lg:w-[290px] xl:w-[315px] h-auto max-h-[90px] lg:max-h-[115px] object-contain',
    lg: 'w-[220px] sm:w-[260px] lg:w-[320px] xl:w-[360px] h-auto object-contain',
    xl: 'w-[280px] sm:w-[340px] lg:w-[420px] xl:w-[480px] h-auto object-contain',
  };

  const logoSource = companySettings.logo_url && companySettings.logo_url.trim().length > 0
    ? companySettings.logo_url
    : DEFAULT_BRAND_LOGO;

  useEffect(() => {
    setImgError(false);
  }, [logoSource]);

  return (
    <div
      id="store-brand-logo"
      onClick={onClick}
      className={`group inline-flex items-center select-none transition-all duration-200 ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      } ${className}`}
      role={onClick ? 'button' : 'banner'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {!imgError ? (
        <div
          className={`relative flex items-center justify-center transition-transform duration-200 ${
            inverted ? 'bg-white/95 rounded-xl px-3 py-1.5 shadow-xs' : ''
          }`}
        >
          <img
            src={logoSource}
            alt={companySettings.business_name || 'Sunshine Babies Essentials'}
            onError={() => setImgError(true)}
            className={`transition-transform duration-200 group-hover:scale-[1.01] ${sizeClasses[size]}`}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        /* Fallback Typography in case of image load delay */
        <div className="flex flex-col justify-center">
          <span
            className={`font-serif font-black tracking-tight leading-tight ${
              inverted ? 'text-white' : 'text-slate-900'
            } ${size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'}`}
          >
            {companySettings.business_name || 'Sunshine Babies Essentials'}
          </span>
          {showTagline && (
            <span
              className={`text-[11px] font-medium leading-tight ${
                inverted ? 'text-amber-300' : 'text-amber-700'
              }`}
            >
              {companySettings.tagline || "Your baby's comfort is our biggest priority."}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
