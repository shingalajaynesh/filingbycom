export default function VirtualSpace() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-[#F7F1E8] shadow-[0_24px_80px_rgba(10,25,47,0.12)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(37,99,235,0.10),_transparent_32%)]" />

        <div className="relative grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
            <span className="inline-flex rounded-full border border-navy-900/10 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-navy-900">
              Virtual Space
            </span>

            <h2 className="mt-5 max-w-xl text-3xl font-bold leading-tight text-navy-900 sm:text-4xl lg:text-5xl">
              A premium virtual space that gives your business a real presence.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-charcoal-500 sm:text-base">
              We provide a virtual workspace experience designed for modern
              companies that want a trusted address, a polished image, and a
              flexible way to operate without renting a physical office.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-black/5">
                <p className="text-sm font-semibold text-navy-900">
                  Trusted address
                </p>
                <p className="mt-1 text-sm text-charcoal-500">
                  Present your brand with confidence.
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-black/5">
                <p className="text-sm font-semibold text-navy-900">
                  Remote-friendly
                </p>
                <p className="mt-1 text-sm text-charcoal-500">
                  Work from anywhere with structure.
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-black/5">
                <p className="text-sm font-semibold text-navy-900">
                  Cost smart
                </p>
                <p className="mt-1 text-sm text-charcoal-500">
                  Save on office overheads.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-navy-900 px-4 py-2 text-sm font-medium text-paper-white">
                Business presence
              </span>
              <span className="rounded-full bg-accent-gold px-4 py-2 text-sm font-medium text-navy-900">
                Premium support
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-charcoal-700 ring-1 ring-black/5">
                Flexible growth
              </span>
            </div>
          </div>

          <div className="border-t border-black/5 bg-white/80 px-6 py-10 sm:px-8 sm:py-12 lg:border-l lg:border-t-0 lg:px-10 lg:py-14">
            <div className="flex h-full flex-col">
              <div className="space-y-4">
              <div className="rounded-3xl bg-navy-900 p-5 text-paper-white">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-gold">
                  What you get
                </p>
                <p className="mt-3 text-base leading-7 text-paper-white/85">
                  A refined virtual office solution that helps your company look
                  established, stay reachable, and operate smoothly.
                </p>
              </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-paper-gray p-5">
                    <p className="text-sm font-semibold text-accent-blue">
                      Brand credibility
                    </p>
                    <p className="mt-2 text-sm leading-6 text-charcoal-500">
                      Make a stronger first impression with a professional setup.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-paper-gray p-5">
                    <p className="text-sm font-semibold text-accent-blue">
                      Practical convenience
                    </p>
                    <p className="mt-2 text-sm leading-6 text-charcoal-500">
                      Keep your workflow simple and your operations flexible.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-paper-gray p-5 sm:col-span-2">
                    <p className="text-sm font-semibold text-accent-blue">
                      Best for
                    </p>
                    <p className="mt-2 text-sm leading-6 text-charcoal-500">
                      Startups, consultants, service firms, and growing teams who
                      want a professional presence without the overhead of a
                      physical office.
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="#contact"
                className="mt-auto inline-flex w-full items-center justify-center rounded-2xl bg-navy-900 px-5 py-3.5 text-base font-semibold text-paper-white transition hover:bg-navy-800"
              >
                Enquire Now
              </a>
            </div>
            </div>
          </div>
        </div>
    </section>
  )
}