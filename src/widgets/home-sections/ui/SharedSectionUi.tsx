import { SectionKicker } from "@/shared/ui/SectionKicker";

export function SectionHeading({
  kicker,
  title,
  centered = false,
  light = false,
  typewriter = false,
}: Readonly<{
  kicker?: string;
  title: string;
  centered?: boolean;
  light?: boolean;
  typewriter?: boolean;
}>) {
  return (
    <div data-reveal-child className={`${centered ? "mx-auto text-center" : ""} max-w-[780px]`}>
      {kicker ? <SectionKicker>{kicker}</SectionKicker> : null}
      <h2
        data-typewriter={typewriter ? true : undefined}
        className={`text-h2 font-extrabold ${light ? "text-white" : "text-foreground"}`}
      >
        {title}
      </h2>
    </div>
  );
}

export function IconImage({ src, light = false }: Readonly<{ src: string; light?: boolean }>) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto h-14 w-14 bg-contain bg-center bg-no-repeat sm:h-16 sm:w-16 ${light ? "brightness-0 invert" : ""}`}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}

export function ZoomImage({
  image,
  label,
  className,
  zoom = true,
}: Readonly<{ image: string; label: string; className: string; zoom?: boolean }>) {
  return (
    <div
      aria-label={label || undefined}
      role={label ? "img" : undefined}
      className={`overflow-hidden bg-[#f8f8f8] ${zoom ? "zoom-frame" : ""} ${className}`}
    >
      <div
        className={`h-full w-full bg-cover bg-center ${zoom ? "zoom-media" : ""}`}
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
}
