export function GoldRule({ centered = false }: Readonly<{ centered?: boolean }>) {
  return (
    <div
      aria-hidden="true"
      className={`mt-4 flex w-full max-w-[700px] items-center sm:mt-6 ${centered ? "mx-auto" : ""}`}
    >
      <span className="h-2 w-2 shrink-0 rotate-45 bg-[#e8c880]" />
      <span className="h-px flex-1 bg-[#e8c880]" />
      <span className="h-2 w-2 shrink-0 rotate-45 bg-[#e8c880]" />
    </div>
  );
}
