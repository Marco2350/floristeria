import Image from "next/image";

type Props = {
  size?: number;
  background?: string;
  className?: string;
  rounded?: boolean;
};

/**
 * Static placeholder that stands in for product / bouquet imagery.
 * Used everywhere except the bouquet personalizer (which still needs the
 * interactive SVG flowers).
 */
export function LogoPlaceholder({
  size = 280,
  background,
  className,
  rounded = false,
}: Props) {
  const logoSize = Math.round(size * 0.62);
  return (
    <div
      className={className}
      style={{
        background: background ?? "var(--muted)",
        borderRadius: rounded ? size / 2 : undefined,
      }}
    >
      <div className="flex h-full w-full items-center justify-center p-4">
        <Image
          src="/lirios-logo.png"
          alt=""
          width={logoSize}
          height={logoSize}
          style={{ width: logoSize, height: "auto", maxWidth: "85%" }}
          className="select-none opacity-90"
          priority={false}
        />
      </div>
    </div>
  );
}
