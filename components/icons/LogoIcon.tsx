
import React from 'react';
export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
    <path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 10" className="opacity-30" />
    <circle cx="12" cy="12" r="3" className="fill-current" />
  </svg>
);
