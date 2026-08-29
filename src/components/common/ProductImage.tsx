import React, { useState, useEffect } from 'react';
import { Package, ImageOff } from 'lucide-react';
import { getProductPlaceholderSvg } from '../../lib/placeholders';

interface ProductImageProps {
  src?: string;
  alt: string;
  categoryId?: string;
  viewAngle?: 'main' | 'front' | 'side' | 'back' | 'detail';
  className?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
  title?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  categoryId = 'cat-baby-essentials',
  viewAngle = 'main',
  className = 'w-full h-full object-cover',
  aspectRatio = 'square',
  onClick,
  loading = 'lazy',
  title,
}) => {
  const [hasError, setHasError] = useState(false);
  const [svgError, setSvgError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
    setSvgError(false);
  }, [src]);

  // If both actual src and svg fallback fail, show sleek unavailable UI
  if (svgError || (!src && hasError)) {
    return (
      <div
        onClick={onClick}
        className={`${className} bg-slate-100 flex flex-col items-center justify-center p-4 text-center select-none text-slate-400`}
      >
        <ImageOff className="w-8 h-8 mb-1.5 text-slate-300 stroke-[1.5]" />
        <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
          Product image unavailable
        </span>
        <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-[90%]">
          {alt}
        </span>
      </div>
    );
  }

  // Primary image source vs fallback SVG
  const imageToRender = !src || hasError ? getProductPlaceholderSvg(alt, categoryId, viewAngle) : src;

  return (
    <img
      src={imageToRender}
      alt={alt}
      title={title || alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onClick={onClick}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        } else {
          setSvgError(true);
        }
      }}
      className={`${className} transition-all duration-300`}
    />
  );
};

