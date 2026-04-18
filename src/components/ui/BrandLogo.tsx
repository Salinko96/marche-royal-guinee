import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  /** invert pour fond sombre */
  invert?: boolean;
}

const sizes = {
  sm: { width: 90,  height: 45,  className: 'h-9 w-auto'  },
  md: { width: 120, height: 60,  className: 'h-12 w-auto' },
  lg: { width: 160, height: 80,  className: 'h-16 w-auto' },
};

export function BrandLogo({ size = 'md', href = '/', className = '', invert = false }: BrandLogoProps) {
  const s = sizes[size];

  const img = (
    <Image
      src="/logo-royal.png"
      alt="Royal Marché de Guinée"
      width={s.width}
      height={s.height}
      className={`${s.className} object-contain ${invert ? 'brightness-0 invert' : ''} ${className}`}
      priority
    />
  );

  if (href) {
    return <Link href={href}>{img}</Link>;
  }
  return img;
}
