export default function Navigation() {
  return (
    <header className="bg-navy-900 text-paper-white shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="grid grid-cols-1">
          <img src="../../public/favicon.png" alt="Logo" className="w-40 h-15" />
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#services"
            className="text-sm font-medium text-paper-white/80 transition-colors hover:text-paper-white"
          >
            Services
          </a>
          <a
            href="#contact"
            className="bg-accent-gold rounded px-4 py-2 font-semibold text-navy-900 transition-colors hover:bg-yellow-500"
          >
            Client Portal
          </a>
        </div>
      </nav>
    </header>
  );
}
