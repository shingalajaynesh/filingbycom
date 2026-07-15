import { useState } from "react";
import { Link } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import { m } from "framer-motion";
import SEO from "../../../shared/components/SEO.jsx";
import { trackEvent } from "../../../shared/utils/gtm";


// Removed the unused `onAuthenticated` prop, as useSyncUser now handles routing
export default function Login() {
  const { isLoaded, signIn, setActive } = useSignIn();

  // 1. Consolidated form state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [step, setStep] = useState("email");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // 2. Extracted inline Google sign-in logic into a clean handler
  const handleGoogleSignIn = async () => {
    if (!isLoaded || !signIn) {
      return setError("Authentication is still loading. Please try again.");
    }

    setIsGoogleLoading(true);
    setError("");

    const lastPortal = sessionStorage.getItem("last_portal");
    const target = lastPortal === "virtual-space" ? "/virtual-office/dashboard" : "/dashboard";

    try {
      trackEvent("login_start", { method: "google" });
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}${target}`,
      });
    } catch (oauthError) {
      setError(oauthError.message || "Google login failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const handleContinue = () => {
    if (!formData.email.trim()) return setError("Enter your email to continue.");
    setError("");
    trackEvent("login_start", { method: "email" });
    setStep("password");
  };

  const handleSignIn = async () => {
    if (!formData.password.trim()) return setError("Enter your password to sign in.");
    if (!isLoaded || !signIn || !setActive) return setError("Authentication is loading.");

    setError("");
    setIsSubmitting(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: formData.email.trim(),
        password: formData.password,
      });

      if (signInAttempt.status === "complete" && signInAttempt.createdSessionId) {
        // useSyncUser hook will detect this session creation and handle routing
        trackEvent("login_success", { method: "email" });
        await setActive({ session: signInAttempt.createdSessionId });
        return;
      }
 
      const passwordAttempt = await signInAttempt.attemptFirstFactor({
        strategy: "password",
        password: formData.password,
      });
 
      if (passwordAttempt.status === "complete" && passwordAttempt.createdSessionId) {
        // useSyncUser hook will detect this session creation and handle routing
        trackEvent("login_success", { method: "email" });
        await setActive({ session: passwordAttempt.createdSessionId });
        return;
      }

      throw new Error("Unable to sign in with the provided credentials.");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Unified form submit handler
  const handleSubmit = (event) => {
    event.preventDefault();
    if (step === "email") handleContinue();
    else handleSignIn();
  };

  return (
    <m.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,31,60,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.16),transparent_35%),linear-gradient(135deg,#e9eef8_0%,#f7f8fb_45%,#dde7f8_100%)] px-4 py-5 sm:px-6 lg:px-8"
    >
      <SEO title="Log In | FilingBy.com" noindex={true} />
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[2.25rem] border border-white/60 bg-white/60 shadow-[0_40px_120px_rgba(15,23,42,0.16)] backdrop-blur-2xl lg:grid-cols-2">
        <m.section
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex items-center justify-center bg-[#f7f8fb] px-6 py-10 sm:px-10 lg:px-14"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.16),transparent_30%)]" />
          <div className="relative z-10 w-full max-w-md">
            <div className="mb-4 flex justify-center lg:hidden">
              <img src="/logo.jpeg" alt="Company logo" className="h-16 w-auto object-contain" />
            </div>

            <div className="mb-6 flex items-center justify-between sm:mb-8">
              <span className="rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 sm:inline-flex">
                Client Login
              </span>
              <span className="rounded-full bg-slate-900 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-slate-900/10 sm:px-4 sm:text-xs">
                Step {step === "email" ? "1" : "2"}
              </span>
            </div>

            <div className="rounded-4xl border border-slate-300/80 bg-[#eef1f5]/90 p-5 shadow-[20px_30px_15px_rgba(15,23,42,0.3)] sm:p-8">
              <div className="mb-5 sm:mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-sm">Sign in</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Welcome back</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 sm:hidden">Use your email to continue.</p>
              </div>

              <div className="sm:block">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isSubmitting}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.655 32.659 29.281 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.988 6.053 29.838 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z" />
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.988 6.053 29.838 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                    <path fill="#4CAF50" d="M24 44c5.632 0 10.715-2.148 14.577-5.639l-6.726-5.697C29.823 34.27 27.108 35.2 24 35.2c-5.257 0-9.615-3.291-11.293-7.945l-6.52 5.026C9.495 39.192 16.028 44 24 44z" />
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.014 2.861-2.951 5.162-5.452 6.664l.002-.001 6.726 5.697C35.1 39.384 44 33.658 44 24c0-1.341-.138-2.651-.389-3.917z" />
                  </svg>
                  {isGoogleLoading ? "Redirecting to Google..." : "Continue with Google"}
                </button>

                <div className="my-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700" htmlFor="email">Email address</label>
                    {/* 4. Added a helpful "Edit" button if they mistype their email */}
                    {step === "password" && (
                      <button type="button" onClick={() => setStep("email")} className="text-xs font-semibold text-blue-500 hover:text-blue-700">
                        Edit
                      </button>
                    )}
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={step === "password"} // Prevent accidental email changes during password step
                    placeholder="name@example.com"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent-blue focus:bg-white disabled:bg-slate-100 disabled:text-slate-500"
                    autoComplete="email"
                  />
                </div>

                {step === "password" && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent-blue focus:bg-white"
                      autoComplete="current-password"
                    />
                  </div>
                )}

                <div id="clerk-captcha" className="my-2" />

                {error && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
                )}

                <div className="flex items-center justify-between gap-3 pt-1 sm:pt-1">
                  <Link to="/register" className="text-sm font-semibold text-slate-500 transition hover:text-slate-700 sm:inline-flex">
                    Don&apos;t have an account? <span className="text-blue-500 ml-1">Register</span>
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto rounded-2xl bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-navy-900/20 transition hover:-translate-y-0.5 hover:bg-navy-800 sm:px-6 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Signing in..." : step === "email" ? "Continue" : "Sign in"}
                  </button>
                </div>
              </form>

              <p className="mt-6 hidden text-xs leading-6 text-slate-500 sm:block">
                By continuing you agree to the secure client portal experience.
              </p>
            </div>
          </div>
        </m.section>

        {/* Static Visual Layout */}
        <m.section
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative hidden overflow-hidden bg-navy-900 px-6 py-10 text-white sm:px-10 lg:flex lg:px-14"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.35),transparent_28%),radial-gradient(circle_at_80%_75%,rgba(212,175,55,0.22),transparent_26%),linear-gradient(160deg,rgba(255,255,255,0.05),transparent_35%)]" />
          <div className="absolute -right-8 top-1/3 h-40 w-40 rounded-full border border-white/10 bg-white/5" />
          <div className="relative z-10 flex h-full w-full flex-col justify-between">
            <div className="flex flex-1 items-center justify-center py-10">
              <div className="rounded-[2.25rem] border border-white/10 bg-white/10 p-6 shadow-[0_35px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm">
                <div className="rounded-[1.75rem] bg-white p-5">
                  <img src="/logo.jpeg" alt="Company logo" className="h-56 w-56 rounded-[1.25rem] object-contain sm:h-64 sm:w-64" />
                </div>
              </div>
            </div>
          </div>
        </m.section>
      </div>
    </m.main>
  );
}