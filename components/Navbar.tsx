import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-[#16FF6E]/40 bg-black/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-[#16FF6E] drop-shadow-[0_0_12px_#16FF6E]"
        >
          Partnering
        </Link>
        <nav className="flex items-center gap-4 text-sm text-white">
          <Link
            href="/categories"
            className="hover:text-[#16FF6E] transition-colors"
          >
            Categories
          </Link>
        </nav>
      </div>
    </header>
  );
}


