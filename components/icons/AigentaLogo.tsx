import React from 'react';

interface AigentaLogoProps {
  className?: string;
}

export const AigentaLogo: React.FC<AigentaLogoProps> = ({ className }) => {
  return (
    <img 
      src="/aigenta_logo.png" 
      alt="Aigenta Logo" 
      className={className} 
      style={{ filter: 'brightness(0) invert(1)' }} 
    />
  );
};
