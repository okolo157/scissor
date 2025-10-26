import * as React from "react";

const AnimatedScissor: React.FC<{ size?: number; color?: string }> = ({
  size = 200,
  color = "currentColor",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          .blade {
            transform-origin: 100px 100px;
            transition: transform 0.3s ease;
          }
          svg:hover .left { transform: rotate(-12deg); }
          svg:hover .right { transform: rotate(12deg); }
        `}
      </style>

      <circle
        cx="70"
        cy="140"
        r="25"
        stroke={color}
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx="130"
        cy="140"
        r="25"
        stroke={color}
        strokeWidth="10"
        fill="none"
      />
      <circle cx="100" cy="100" r="8" fill={color} />

      <path
        className="blade left"
        d="M100 100 L45 45"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="blade right"
        d="M100 100 L155 45"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AnimatedScissor;
