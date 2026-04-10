"use client";

import Image from "next/image";

export function CompanyLogo({ src, company, size = 36 }: { src: string; company: string; size?: number }) {
  return (
    <div
      className="rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={company}
        width={size - 8}
        height={size - 8}
        className="object-contain"
        unoptimized
      />
    </div>
  );
}
