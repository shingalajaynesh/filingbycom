import { Link } from "react-router-dom";

export function PortalPageShell({ badge, title, description, breadcrumbs = [], aside, children }) {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {breadcrumbs.length > 0 && (
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <div key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                  {crumb.to && !isLast ? (
                    <Link to={crumb.to} className="transition hover:text-[#1A56DB]">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "font-bold text-slate-800" : ""}>{crumb.label}</span>
                  )}
                  {!isLast && <span>/</span>}
                </div>
              );
            })}
          </nav>
        )}

        <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
          <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,_rgba(26,86,219,0.16),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_36%)]" />
          <span className="relative inline-flex rounded-full border border-[#1A56DB]/10 bg-[#1A56DB]/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-[#1A56DB]">
            {badge}
          </span>
          <div className="relative mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
            </div>
            {aside ? <div className="w-full max-w-xs shrink-0">{aside}</div> : null}
          </div>
        </section>

        <div className="mt-8 space-y-6">{children}</div>
      </div>
    </main>
  );
}

export function PortalCard({ title, eyebrow, description, className = "", children }) {
  return (
    <section className={`rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-8 ${className}`}>
      {eyebrow ? <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#1A56DB]">{eyebrow}</p> : null}
      {title ? <h2 className="mt-2 text-2xl font-black text-slate-950">{title}</h2> : null}
      {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      <div className={title || eyebrow || description ? "mt-6" : ""}>{children}</div>
    </section>
  );
}

export function PortalCTA({ title, description, primary, secondary }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#1A56DB]/10 bg-slate-950 p-8 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#1A56DB]/30 blur-3xl" />
      <div className="absolute bottom-0 left-10 h-28 w-28 rounded-full bg-sky-400/20 blur-3xl" />
      <p className="relative text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">Assisted Compliance</p>
      <h2 className="relative mt-3 text-2xl font-black">{title}</h2>
      <p className="relative mt-3 max-w-2xl text-sm leading-6 text-slate-300">{description}</p>
      <div className="relative mt-6 flex flex-wrap gap-3">
        {primary}
        {secondary}
      </div>
    </section>
  );
}
