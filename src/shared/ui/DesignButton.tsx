import { ArrowIcon } from "@/shared/ui/ArrowIcon";

export function DesignButton({
  children,
  onClick,
  size = "md",
  variant = "outline",
}: Readonly<{
  children: React.ReactNode;
  onClick: () => void;
  size?: "md" | "xl";
  variant?: "outline" | "filled";
}>) {
  const isFilled = variant === "filled";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-4 rounded-full border-2 border-[#e8c880] font-bold tracking-[0.5px] transition ${
        isFilled
          ? "bg-[#e8c880] text-[#0f172a] hover:bg-[#ffecbf]"
          : "text-[#e8c880] hover:bg-[#e8c880] hover:text-[#0f172a]"
      } ${
        size === "xl"
          ? "px-5 py-3.5 text-lg sm:px-7 sm:py-4 sm:text-2xl lg:text-[26.7px]"
          : "px-5 py-3 text-base sm:px-6 lg:text-xl xl:text-2xl"
      }`}
    >
      {children}
      <ArrowIcon />
    </button>
  );
}
