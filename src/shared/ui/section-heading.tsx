type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  tone?: "default" | "inverse";
};

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default",
}: SectionHeadingProps) => (
  <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
    <p
      className={`text-sm uppercase tracking-[0.3em] ${
        tone === "inverse" ? "text-stone-400" : "text-stone-500"
      }`}
    >
      {eyebrow}
    </p>
    <h2
      className={`mt-4 text-3xl font-semibold tracking-tight md:text-4xl ${
        tone === "inverse" ? "text-stone-50" : "text-stone-950"
      }`}
    >
      {title}
    </h2>
    <p
      className={`mt-4 text-base leading-7 ${
        tone === "inverse" ? "text-stone-300" : "text-stone-600"
      }`}
    >
      {description}
    </p>
  </div>
);
