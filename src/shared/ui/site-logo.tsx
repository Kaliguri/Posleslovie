import { siteConfig } from "@/shared/config/site";
import { assetPath } from "@/shared/lib/asset-path";

type SiteLogoProps = Readonly<{
  className?: string;
  variant?: "dark" | "light";
}>;

export function SiteLogo({ className = "" }: SiteLogoProps) {
  return (
    <img
      src={assetPath("/images/brand/logo2.png")}
      alt={siteConfig.name}
      width={256}
      height={40}
      className={`block aspect-[256/40] h-auto w-[min(18.375rem,calc(100vw-10rem))] max-h-[2.875rem] min-w-[9.5rem] lg:aspect-auto lg:h-10 lg:min-w-0 lg:w-auto ${className}`}
      decoding="async"
    />
  );
}
