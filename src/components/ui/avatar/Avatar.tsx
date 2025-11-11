import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { DEFAULT_AVATAR_SRC } from "@/hooks/useUserInfo";

interface AvatarProps {
  src?: string | null; // URL of the avatar image
  alt?: string; // Alt text for the avatar
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge"; // Avatar size
  status?: "online" | "offline" | "busy" | "none"; // Status indicator
  fallbackSrc?: string; // Fallback image when src is unavailable
  className?: string;
}

const sizeClasses = {
  xsmall: "h-6 w-6",
  small: "h-8 w-8",
  medium: "h-10 w-10",
  large: "h-12 w-12",
  xlarge: "h-14 w-14",
  xxlarge: "h-16 w-16",
};

const statusSizeClasses = {
  xsmall: "h-1.5 w-1.5",
  small: "h-2 w-2",
  medium: "h-2.5 w-2.5",
  large: "h-3 w-3",
  xlarge: "h-3.5 w-3.5",
  xxlarge: "h-4 w-4",
};

const statusColorClasses = {
  online: "bg-success-500",
  offline: "bg-error-400",
  busy: "bg-warning-500",
};

const sizeDimensions: Record<NonNullable<AvatarProps["size"]>, number> = {
  xsmall: 24,
  small: 32,
  medium: 40,
  large: 48,
  xlarge: 56,
  xxlarge: 64,
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User Avatar",
  size = "medium",
  status = "none",
  fallbackSrc = DEFAULT_AVATAR_SRC,
  className = "",
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const dimension = sizeDimensions[size] ?? sizeDimensions.medium;

  const resolvedSrc = useMemo(() => {
    if (hasError) {
      return fallbackSrc;
    }
    return src ?? fallbackSrc;
  }, [fallbackSrc, hasError, src]);

  const containerClasses = useMemo(
    () =>
      ["relative overflow-hidden rounded-full", sizeClasses[size], className]
        .filter(Boolean)
        .join(" "),
    [className, size]
  );

  const statusClasses = useMemo(
    () =>
      [
        "absolute bottom-0 right-0 rounded-full border-[1.5px] border-white dark:border-gray-900",
        statusSizeClasses[size],
        statusColorClasses[status] ?? "",
      ]
        .filter(Boolean)
        .join(" "),
    [size, status]
  );

  return (
    <div className={containerClasses}>
      {/* Avatar Image */}
      <Image
        width={dimension}
        height={dimension}
        src={resolvedSrc}
        alt={alt}
        className="h-full w-full rounded-full object-cover"
        onError={() => setHasError(true)}
      />

      {/* Status Indicator */}
      {status !== "none" && (
        <span className={statusClasses}></span>
      )}
    </div>
  );
};

export default Avatar;
