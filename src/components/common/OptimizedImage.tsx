import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  sizes?: string;
}

const ImageContainer = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
});

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'opacity 0.3s ease-in-out',
});

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  priority = false,
  sizes = '100vw',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    observerRef.current = observer;

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    // Fallback to original image if WebP fails
    if (imgRef.current && src.includes('webp')) {
      imgRef.current.src = src.replace('.webp', '.png');
    }
  };

  // Generate responsive srcSet for different screen sizes
  const generateSrcSet = (imageSrc: string) => {
    const baseUrl = imageSrc.split('?')[0];
    return `${baseUrl}?w=400 400w, ${baseUrl}?w=800 800w, ${baseUrl}?w=1200 1200w, ${baseUrl}?w=1600 1600w`;
  };

  return (
    <ImageContainer
      ref={imgRef}
      style={{ width, height, ...style }}
      className={className}
    >
      {!isLoaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
        />
      )}
      {isInView && (
        <StyledImage
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0,
          }}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
        />
      )}
    </ImageContainer>
  );
};

export default OptimizedImage; 