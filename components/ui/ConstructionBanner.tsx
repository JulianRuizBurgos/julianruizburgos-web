"use client";

import { usePathname } from "next/navigation";

const CONSTRUCTION_PATHS = ["/it", "/ecology"];

export default function ConstructionBanner() {
  const pathname = usePathname();
  const show = CONSTRUCTION_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center pointer-events-none mb-[108px]">
      <div className="pointer-events-auto mb-2 rounded-full bg-yellow-300/90 backdrop-blur-sm px-4 py-1.5 text-xs text-stone-900 tracking-wide shadow-lg">
        This section is under construction — some content is placeholder material.
      </div>
    </div>
  );
}
