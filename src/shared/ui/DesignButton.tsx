import { ArrowIcon } from "@/shared/ui/ArrowIcon";

export function DesignButton({
  children,
  onClick,
  size = "md",
  variant = "outline",
  disabled = false,
  showArrow = true,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  onClick: () => void;
  size?: "md" | "xl";
  variant?: "outline" | "filled" | "ghost";
  disabled?: boolean;
  showArrow?: boolean;
  className?: string;
}>) {
  const isFilled = variant === "filled";
  const isGhost = variant === "ghost";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-black tracking-[-0.02em] transition-[background-color,border-color,color,opacity,transform] disabled:cursor-not-allowed disabled:opacity-60 ${
        isGhost
          ? "gap-2 rounded-lg px-0 py-2 text-brand-gold underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-gold-hover hover:decoration-brand-gold"
          : `gap-4 rounded-full border-2 border-brand-gold ${
              isFilled
                ? "bg-brand-gold text-foreground shadow-[0_18px_50px_rgba(193,174,255,0.28)] hover:-translate-y-0.5 hover:bg-brand-gold-hover"
                : "text-brand-gold hover:-translate-y-0.5 hover:bg-brand-gold hover:text-foreground"
            } ${size === "xl" ? "px-5 py-3.5 text-lg sm:px-7 sm:py-4 sm:text-2xl" : "px-5 py-3 text-base sm:px-6 lg:text-xl xl:text-2xl"} ${className}`
      }`}
    >
      {children}
      {showArrow && !isGhost ? <ArrowIcon /> : null}
    </button>
  );
}
