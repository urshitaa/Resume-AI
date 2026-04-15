import { cn } from "@/lib/utils";

interface SkillTagProps {
  label: string;
  variant?: "matched" | "missing" | "neutral";
}

const SkillTag = ({ label, variant = "neutral" }: SkillTagProps) => {
  const styles = {
    matched: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    missing: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    neutral: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium", styles[variant])}>
      {variant === "matched" && "✓ "}
      {variant === "missing" && "✕ "}
      {label}
    </span>
  );
};

export default SkillTag;
