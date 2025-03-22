
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const AnimatedLink = ({
  href,
  children,
  className,
  activeClassName = "",
  isActive = false,
  onClick,
}: AnimatedLinkProps) => {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "relative group flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-300",
        "hover:bg-secondary",
        isActive ? activeClassName : "",
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-3">
        {children}
      </span>
      {isActive && (
        <span className="absolute inset-0 bg-secondary rounded-lg animate-scale-in" />
      )}
    </a>
  );
};
