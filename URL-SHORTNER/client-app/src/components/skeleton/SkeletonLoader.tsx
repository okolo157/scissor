import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
  count = 1,
}) => {
  const baseClasses = "animate-pulse bg-gray-300 dark:bg-gray-700";

  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const style: React.CSSProperties = {
    width: width || "100%",
    height: height || (variant === "text" ? "1rem" : "100%"),
  };

  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
          />
        ))}
      </>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export const FormSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Skeleton variant="rectangular" height="48px" className="flex-grow" />
        <Skeleton
          variant="rectangular"
          height="48px"
          width="120px"
          className="sm:w-auto w-full"
        />
      </div>
    </div>
  );
};

export const LinkCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width="48px" height="48px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height="20px" width="60%" />
          <Skeleton variant="text" height="16px" width="40%" />
        </div>
      </div>
    </div>
  );
};

export const LinkGroupSkeleton: React.FC = () => {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6">
      <div className="text-center space-y-4">
        <Skeleton
          variant="circular"
          width="96px"
          height="96px"
          className="mx-auto"
        />
        <Skeleton
          variant="text"
          height="32px"
          width="200px"
          className="mx-auto"
        />
        <Skeleton
          variant="text"
          height="20px"
          width="300px"
          className="mx-auto"
        />
      </div>

      <div className="flex items-center justify-center gap-4">
        <Skeleton variant="text" height="20px" width="80px" />
        <Skeleton variant="circular" width="4px" height="4px" />
        <Skeleton variant="text" height="20px" width="80px" />
      </div>

      <div className="space-y-3 pt-6 border-t border-gray-200">
        <Skeleton variant="rectangular" height="60px" />
        <Skeleton variant="rectangular" height="60px" />
        <Skeleton variant="rectangular" height="60px" />
      </div>
    </div>
  );
};

export const ModalFormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton variant="text" height="14px" width="100px" />
        <Skeleton variant="rectangular" height="48px" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" height="14px" width="80px" />
        <Skeleton variant="rectangular" height="96px" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" height="14px" width="120px" />
        <Skeleton variant="rectangular" height="48px" />
      </div>
      <div className="space-y-3">
        <Skeleton variant="text" height="20px" width="60px" />
        <Skeleton variant="rectangular" height="60px" />
        <Skeleton variant="rectangular" height="60px" />
      </div>
    </div>
  );
};

export default Skeleton;
