import React from 'react';

export const KitchenBarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_4312_16455_kitchen)">
      <path d="M7.5 36.25C7.5 37.6288 8.62125 38.75 10 38.75H30C31.3788 38.75 32.5 37.6288 32.5 36.25V33.75H7.5V36.25Z" fill="currentColor"/>
      <path d="M7.5 31.25H32.5V26.7738C36.275 25.2613 38.75 21.6438 38.75 17.5C38.75 12.485 35.02 8.28 30.1238 7.60375C28.2538 3.72 24.36 1.25 20 1.25C15.64 1.25 11.7463 3.72 9.87625 7.60375C4.98 8.28 1.25 12.485 1.25 17.5C1.25 21.6438 3.725 25.2613 7.5 26.7738V31.25Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_4312_16455_kitchen">
        <rect width="40" height="40" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);
