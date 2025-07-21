"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <Link
        href="/"
        className="text-accent inline-block text-2xl font-bold hover:text-foreground transition"
      >
        AniCentral
      </Link>

      <div className="flex items-center gap-4">
        {/* Other nav links, e.g. search */}
        <Link href="/search" className="hover:text-accent transition">
          {/* Simple search icon (SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}
