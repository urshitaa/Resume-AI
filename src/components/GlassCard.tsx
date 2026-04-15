import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard = ({ children, className, hover = false }: GlassCardProps) => (
  <div
    className={cn(
      "glass-card rounded-xl p-6",
      hover && "transition-all duration-300 hover:shadow-xl hover:scale-[1.01]",
      className
    )}
  >
    {children}
  </div>
);

export default GlassCard;
