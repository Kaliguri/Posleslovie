export function SectionKicker({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <p className="text-xs font-bold uppercase tracking-[2px] text-[#e8c880] sm:text-base sm:tracking-[3px] lg:text-lg xl:text-xl">
      {children}
    </p>
  );
}
