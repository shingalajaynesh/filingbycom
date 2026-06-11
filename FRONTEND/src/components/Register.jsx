import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";

// 1. Extract the pending UI to keep the main component clean
const PendingScreen = () => (
  <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(14,31,60,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.16),transparent_35%),linear-gradient(135deg,#e9eef8_0%,#f7f8fb_45%,#dde7f8_100%)] px-4">
    <div className="max-w-sm text-center">
      <div className="mb-6 flex justify-center">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
          <div
            className="absolute inset-0 animate-spin rounded-full border-4 border-t-navy-900"
            style={{ borderTopColor: "#0f172a" }}
          />
        </div>
      </div>
      <h2 className="mb-2 text-xl font-bold text-slate-900">Setting up your account…</h2>
      <p className="text-sm text-slate-500">We're creating your profile. You'll be redirected shortly.</p>
    </div>
  </main>
);

// 2. Removed unused `onRegistered` prop and `useNavigate` hook 
export default function Register() {
  const location = useLocation();
  const { isLoaded, signUp, setActive } = useSignUp();

  // 3. Consolidate 6 individual state variables into one clean object
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    code: "",
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [registrationPending, setRegistrationPending] = useState(false);

  // Helper to handle all input changes natively
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleGoogleSignUp = async () => {
    if (!isLoaded || !signUp) return setError("Authentication is still loading. Please try again.");
    
    setIsGoogleLoading(true);
    setError("");
    
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/sso-callback`,
      });
    } catch (oauthError) {
      setError(oauthError.message || "Google sign-up failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const handleContinue = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      return setError("Enter your first name, last name, and email to continue.");
    }
    setError("");
    setStep(2);
  };

  const handleRegister = async () => {
    if (!formData.mobile.trim() || !formData.password.trim()) {
      return setError("Enter your mobile number and password to finish registration.");
    }
    if (!isLoaded || !signUp) return setError("Authentication is loading.");

    setError("");
    setIsSubmitting(true);

    try {
      const signUpAttempt = await signUp.create({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        emailAddress: formData.email.trim(),
        password: formData.password,
        unsafeMetadata: { phoneNumber: formData.mobile.trim() },
      });

      if (signUpAttempt.status === "complete" && signUpAttempt.createdSessionId) {
        sessionStorage.setItem("justRegistered", "true");
        setRegistrationPending(true);
        await setActive({ session: signUpAttempt.createdSessionId });
        return;
      }

      await signUpAttempt.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep(3);
    } catch (registerError) {
      setError(registerError.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async () => {
    if (!formData.code.trim()) return setError("Please enter the verification code.");
    if (!isLoaded || !signUp || !setActive) return setError("Authentication is loading.");

    setError("");
    setIsSubmitting(true);

    try {
      const verificationAttempt = await signUp.attemptEmailAddressVerification({
        code: formData.code.trim(),
      });

      if (verificationAttempt.status === "complete" && verificationAttempt.createdSessionId) {
        sessionStorage.setItem("justRegistered", "true");
        setRegistrationPending(true);
        await setActive({ session: verificationAttempt.createdSessionId });
        return;
      }

      setError(`Verification incomplete. Status: ${verificationAttempt.status}`);
    } catch (err) {
      setError(err.message || "Verification failed. Please check the code and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Unified form submit handler
  const handleSubmit = (event) => {
    event.preventDefault();
    if (step === 1) handleContinue();
    else if (step === 2) handleRegister();
    else handleVerification();
  };

  if (registrationPending) return <PendingScreen />;

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,31,60,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.16),transparent_35%),linear-gradient(135deg,#e9eef8_0%,#f7f8fb_45%,#dde7f8_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[2.25rem] border border-white/60 bg-white/60 shadow-[0_40px_120px_rgba(15,23,42,0.16)] backdrop-blur-2xl lg:grid-cols-2">
        <section className="relative flex items-center justify-center bg-[#f7f8fb] px-6 py-10 sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.16),transparent_30%)]" />
          <div className="relative z-10 w-full max-w-md">
            <div className="mb-4 flex justify-center lg:hidden">
              <img src="/favicon.png" alt="Company logo" className="h-16 w-auto object-contain" />
            </div>
            
            <div className="mb-6 flex items-center justify-between sm:mb-8">
              <span className="rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 sm:inline-flex">
                Create Account
              </span>
              <span className="rounded-full bg-slate-900 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-slate-900/10 sm:px-4 sm:text-xs">
                Step {step}
              </span>
            </div>

            <div className="rounded-4xl border border-slate-300/80 bg-[#eef1f5]/90 p-5 shadow-[20px_30px_15px_rgba(15,23,42,0.3)] sm:p-8">
              <div className="mb-5 sm:mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-sm">Sign up</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Create your account</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 sm:hidden">
                  {step === 3 ? "Verify your email." : "Register in two quick steps."}
                </p>
              </div>

              <div className="sm:block">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
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
                {step === 1 && (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700" htmlFor="firstName">First name</label>
                        <input id="firstName" type="text" value={formData.firstName} onChange={handleChange} placeholder="John" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent-blue focus:bg-white" autoComplete="given-name" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700" htmlFor="lastName">Last name</label>
                        <input id="lastName" type="text" value={formData.lastName} onChange={handleChange} placeholder="Smith" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent-blue focus:bg-white" autoComplete="family-name" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700" htmlFor="email">Email address</label>
                      <input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent-blue focus:bg-white" autoComplete="email" />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700" htmlFor="mobile">Mobile number</label>
                      <input id="mobile" type="tel" value={formData.mobile} onChange={handleChange} placeholder="+91 98765 43210" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent-blue focus:bg-white" autoComplete="tel" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                      <input id="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create a password" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent-blue focus:bg-white" autoComplete="new-password" />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700" htmlFor="code">Verification Code</label>
                    <p className="mt-1 text-xs text-slate-500">We have sent a verification code to {formData.email}.</p>
                    <input id="code" type="text" value={formData.code} onChange={handleChange} placeholder="Enter 6-digit code" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-center font-mono text-lg tracking-[0.25em] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent-blue focus:bg-white" maxLength={6} />
                  </div>
                )}

                <div id="clerk-captcha" className="my-2" />

                {error && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
                )}

                <div className="flex items-center justify-between gap-3 pt-1">
                  {step > 1 && (
                    <button type="button" onClick={() => setStep(step - 1)} disabled={isSubmitting} className="text-sm font-semibold text-slate-500 transition hover:text-slate-700">
                      Back
                    </button>
                  )}
                  {step === 1 && (
                    <Link to="/login" className="text-sm font-semibold text-slate-500 transition hover:text-slate-700">
                      Already have an account? <span className="text-blue-500">Login</span>
                    </Link>
                  )}

                  <button type="submit" disabled={isSubmitting} className="ml-auto rounded-2xl bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-navy-900/20 transition hover:-translate-y-0.5 hover:bg-navy-800 sm:px-6">
                    {isSubmitting
                      ? (step === 3 ? "Verifying..." : step === 2 ? "Registering..." : "Continuing...")
                      : (step === 3 ? "Verify" : step === 2 ? "Register" : "Continue")}
                  </button>
                </div>
              </form>

              <p className="mt-6 hidden text-xs leading-6 text-slate-500 sm:block">
                By continuing you agree to the secure client portal experience.
              </p>
            </div>
          </div>
        </section>

        {/* Static Visual Layout */}
        <section className="relative hidden overflow-hidden bg-navy-900 px-6 py-10 text-white sm:px-10 lg:flex lg:px-14">
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
        </section>
      </div>
    </main>
  );
}