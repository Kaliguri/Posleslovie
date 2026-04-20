import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

const styles: Record<NonNullable<ButtonLinkProps["variant"]>, string> = {
  primary:
    "bg-stone-950 text-stone-50 shadow-lg shadow-stone-950/10 hover:bg-stone-800",
  secondary:
    "border border-stone-300 bg-white text-stone-950 hover:border-stone-950 hover:bg-stone-50",
  ghost: "text-stone-950 hover:text-stone-700",
};

export const ButtonLink = ({
  href,
  children,
  variant = "primary",
}: ButtonLinkProps) => (
  <Link
    href={href}
    className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition ${styles[variant]}`}
  >
    {children}
  </Link>
);
