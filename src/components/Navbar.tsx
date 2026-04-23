import Link from "next/link";
import { getSession } from "@/lib/auth";

export async function Navbar() {
  const session = await getSession();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg bg-bg/70 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-bold text-white">
            H
          </div>
          <span className="font-bold text-lg">Habibi<span className="text-accent">API</span></span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3 text-sm">
          <Link href="/docs" className="px-3 py-2 hover:text-accent transition-colors">Docs</Link>
          <Link href="/playground" className="px-3 py-2 hover:text-accent transition-colors">Playground</Link>
          {session ? (
            <Link href="/dashboard" className="btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="px-3 py-2 hover:text-accent transition-colors">Login</Link>
              <Link href="/register" className="btn-primary">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
