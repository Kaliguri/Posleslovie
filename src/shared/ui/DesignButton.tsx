import { ArrowIcon } from "@/shared/ui/ArrowIcon";

export function DesignButton({
  children,
  onClick,
  size = "md",
  variant = "outline",
  disabled = false,
  showArrow = true,
}: Readonly<{
  children: React.ReactNode;
  onClick: () => void;
  size?: "md" | "xl";
  variant?: "outline" | "filled" | "ghost";
  disabled?: boolean;
  showArrow?: boolean;
}>) {
  const isFilled = variant === "filled";
  const isGhost = variant === "ghost";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-bold tracking-[0.5px] transition disabled:cursor-not-allowed disabled:opacity-60 ${
        isGhost
          ? "gap-2 rounded-lg px-0 py-2 text-brand-gold underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-gold-muted hover:decoration-brand-gold"
          : `gap-4 rounded-full border-2 border-brand-gold ${
              isFilled
                ? "bg-brand-gold text-foreground hover:bg-brand-gold-hover"
                : "text-brand-gold hover:bg-brand-gold hover:text-foreground"
            } ${size === "xl" ? "px-5 py-3.5 text-lg sm:px-7 sm:py-4 sm:text-2xl" : "px-5 py-3 text-base sm:px-6 lg:text-xl xl:text-2xl"}`
      }`}
    >
      {children}
      {showArrow && !isGhost ? <ArrowIcon /> : null}
    </button>
  );
}
