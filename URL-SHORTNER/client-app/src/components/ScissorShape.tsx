import * as React from "react";

interface ScissorShapeProps {
  className?: string;
  size?: number;
  color?: string;
}

const ScissorShape: React.FC<ScissorShapeProps> = ({
  className = "",
  size = 200,
  color = "currentColor",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Scissor blades */}
      <path
        d="M60 60 L100 100 L60 140"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <path
        d="M140 60 L100 100 L140 140"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />

      {/* Scissor pivot */}
      <circle cx="100" cy="100" r="12" fill={color} opacity="0.8" />

      {/* Scissor handles */}
      <circle
        cx="60"
        cy="60"
        r="20"
        stroke={color}
        strokeWidth="6"
        fill="none"
        opacity="0.6"
      />
      <circle
        cx="60"
        cy="140"
        r="20"
        stroke={color}
        strokeWidth="6"
        fill="none"
        opacity="0.6"
      />
      <circle
        cx="140"
        cy="60"
        r="20"
        stroke={color}
        strokeWidth="6"
        fill="none"
        opacity="0.6"
      />
      <circle
        cx="140"
        cy="140"
        r="20"
        stroke={color}
        strokeWidth="6"
        fill="none"
        opacity="0.6"
      />

      {/* Decorative lines */}
      <path
        d="M40 40 L70 70"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M160 40 L130 70"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M40 160 L70 130"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M160 160 L130 130"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
};

export default ScissorShape;
