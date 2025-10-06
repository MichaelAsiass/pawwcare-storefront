"use client";

import { cn } from "@/lib/utils";
import { PawPrint } from "lucide-react";
import Link from "next/link";

type LogoVariant = "full" | "icon" | "text";
type LogoSize = "sm" | "md" | "lg" | "xl";

type LogoProps = {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  showText?: boolean;
  textClassName?: string;
  iconClassName?: string;
};

const sizeConfig = {
  sm: { icon: "h-4 w-4", text: "text-sm", spacing: "space-x-2" },
  md: { icon: "h-6 w-6", text: "text-base", spacing: "space-x-3" },
  lg: { icon: "h-8 w-8", text: "text-lg", spacing: "space-x-4" },
  xl: { icon: "h-12 w-12", text: "text-2xl", spacing: "space-x-6" },
} as const;

const getSizeClasses = (size: LogoSize) => sizeConfig[size];

export const Logo = ({
  variant = "full",
  size = "md",
  className,
  showText = true,
  textClassName,
  iconClassName,
}: LogoProps) => {
  const sizeClasses = getSizeClasses(size);

  const renderIcon = () => (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-primary text-primary-foreground cursor-pointer transition-all duration-200 hover:bg-[rgb(180,100,35)] hover:shadow-md",
        sizeClasses.icon,
        iconClassName
      )}
    >
      <PawPrint className="h-3/4 w-3/4" strokeWidth={1.5} />
    </div>
  );

  const renderText = () =>
    showText && (
      <div className={cn("flex flex-col", textClassName)}>
        <span className={cn("font-semibold", sizeClasses.text)}>PetGromee</span>
        <span className="text-xs text-muted-foreground">
          Pet Grooming & Daycare
        </span>
      </div>
    );

  const renderLogo = () => {
    const logoMap = {
      full: () => (
        <Link
          href="/"
          className={cn("flex items-center", sizeClasses.spacing, className)}
        >
          {renderIcon()}
          {renderText()}
        </Link>
      ),
      icon: () => <div className={cn(className)}>{renderIcon()}</div>,
      text: () => <div className={cn(className)}>{renderText()}</div>,
    } as const;

    return logoMap[variant]();
  };

  return renderLogo();
};

// Convenience components for common use cases
export const LogoIcon = (props: Omit<LogoProps, "variant">) => (
  <Logo {...props} variant="icon" />
);

export const LogoText = (props: Omit<LogoProps, "variant">) => (
  <Logo {...props} variant="text" />
);

export const LogoFull = (props: Omit<LogoProps, "variant">) => (
  <Logo {...props} variant="full" />
);
