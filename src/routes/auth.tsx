import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In or Register — Urbanova" },
      {
        name: "description",
        content:
          "Sign in to your Urbanova account to view your order history, or create an account in seconds. Checkout stays available as a guest.",
      },
      { property: "og:title", content: "Sign In or Register — Urbanova" },
      {
        property: "og:description",
        content: "Access your Urbanova order history, or continue shopping as a guest.",
      },
    ],
  }),
  component: AuthPage,
});

const input =
  "w-full px-4 py-3 rounded-xl bg-neutral-100 border border-black/10 text-sm outline-none focus:border-black transition-colors";

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/account" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName, phone },
          },
        });
        if (err) throw err;
        setMessage("Check your email to confirm your account, then sign in.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        navigate({ to: "/account" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError(null);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/account` },
    });
    if (err) {
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#121316] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="text-xs font-grotesk font-bold uppercase tracking-widest text-neutral-500 hover:text-black"
        >
          ← Back to store
        </Link>
        <h1 className="font-syne text-4xl font-extrabold uppercase tracking-tight mt-6">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h1>
        <p className="text-xs font-grotesk uppercase tracking-wider text-neutral-500 mt-2 mb-8">
          Optional — you can always check out as a guest
        </p>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <>
              <input
                className={input}
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={120}
              />
              <input
                className={input}
                placeholder="Mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={30}
              />
            </>
          )}
          <input
            required
            type="email"
            className={input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
          />
          <input
            required
            type="password"
            className={input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            maxLength={100}
          />

          {error && (
            <p className="text-xs text-rose-500 font-grotesk uppercase tracking-wider">{error}</p>
          )}
          {message && (
            <p className="text-xs text-emerald-600 font-grotesk uppercase tracking-wider">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-4 bg-black text-white font-grotesk font-extrabold text-xs tracking-widest uppercase rounded-xl disabled:opacity-50"
          >
            {busy ? "Please wait..." : mode === "signin" ? "Sign In" : "Register"}
          </button>
        </form>

        <button
          onClick={google}
          className="mt-3 w-full py-4 border border-black/15 font-grotesk font-extrabold text-xs tracking-widest uppercase rounded-xl hover:bg-black/5"
        >
          Continue with Google
        </button>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-xs font-grotesk uppercase tracking-wider text-neutral-500 hover:text-black"
        >
          {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>

        <Link
          to="/track"
          className="mt-3 block text-center text-xs font-grotesk uppercase tracking-wider text-neutral-500 hover:text-black"
        >
          Track an order with your mobile number
        </Link>
      </div>
    </main>
  );
}
