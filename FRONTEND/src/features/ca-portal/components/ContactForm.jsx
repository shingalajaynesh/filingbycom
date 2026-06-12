export default function ContactForm() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="card-base overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-slate-700 px-6 py-10 text-white sm:px-8 sm:py-12 lg:px-10 lg:py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Contact Us
            </p>
            <h2 className="mt-4 max-w-md text-3xl font-bold leading-tight sm:text-4xl heading-primary" >
              Let’s start the conversation.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
              Share your name, phone number, and state. We’ll use that to
              connect you with the right support quickly and clearly.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-sm font-semibold text-cyan-300">
                  Fast response
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  We aim to respond with the next step as soon as possible.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-sm font-semibold text-cyan-300">
                  Clear follow-up
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Your details help us reach out with relevant guidance.
                </p>
              </div>
            </div>
          </div>

          <form className="flex h-full flex-col gap-5 bg-[#F8FAFC] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  defaultValue=""
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15"
                >
                  <option value="" disabled>
                    Select your state
                  </option>
                  <option value="gujarat">Gujarat</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="rajasthan">Rajasthan</option>
                  <option value="delhi">Delhi</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-auto rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm leading-6 text-slate-600">
              We’ll review your details and follow up with the most suitable
              information for your location and needs.
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-600 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/25"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
