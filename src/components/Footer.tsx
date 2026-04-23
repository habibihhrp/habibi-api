export function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-muted flex flex-col sm:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} Habibi API. Built with Next.js & deployed on Vercel.</p>
        <div className="flex gap-4">
          <a href="/docs" className="hover:text-accent">Documentation</a>
          <a href="https://github.com" className="hover:text-accent">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
