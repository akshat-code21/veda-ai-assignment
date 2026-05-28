import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)

    try {
      const { error: authError } = await authClient.signUp.email({
        name,
        email,
        password,
      })

      if (authError) {
        setError(authError.message || "Registration failed. Please try again.")
        return
      }

      navigate("/assignments")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img
            src="/images/logo.svg"
            alt="VedaAI Logo"
            className="h-14 w-14 shrink-0 relative top-[4px]"
          />
          <span className="font-heading text-[28px] font-bold text-[#303030]">
            VedaAI
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-[0px_8px_32px_rgba(0,0,0,0.08)]">
          <h1 className="font-heading text-2xl font-bold text-[#303030] text-center">
            Create your account
          </h1>
          <p className="font-sans text-sm text-[#5E5E5E] text-center mt-1.5">
            Get started with AI-powered assignments
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="font-heading text-sm font-semibold text-[#303030] block mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full h-11 px-4 rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-[#303030] text-sm font-sans text-[#303030] placeholder-[#A9A9A9] transition-all"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-semibold text-[#303030] block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                required
                className="w-full h-11 px-4 rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-[#303030] text-sm font-sans text-[#303030] placeholder-[#A9A9A9] transition-all"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-semibold text-[#303030] block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className="w-full h-11 px-4 rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-[#303030] text-sm font-sans text-[#303030] placeholder-[#A9A9A9] transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-[46px] rounded-full bg-[#181818] text-white hover:bg-neutral-800 font-heading font-medium text-base mt-2 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="h-px w-full bg-[#E5E7EB]" />
            <span className="text-[11px] font-medium tracking-wider text-[#A3A3A3] uppercase whitespace-nowrap">
              Or continue with
            </span>
            <div className="h-px w-full bg-[#E5E7EB]" />
          </div>

          <Button
            type="button"
            onClick={async () => {
              try {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: `${window.location.origin}/assignments`,
                })
              } catch (e) {
                console.error("Google Auth error", e)
                setError("Google sign-in failed. Please try again.")
              }
            }}
            className="w-full h-[46px] rounded-full border border-[#D9D9D9] bg-white text-[#303030] hover:bg-[#F9F9F9] font-heading font-medium text-base mt-4 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-none"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.16 2.682 1.077 6.623l4.189 3.142Z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.273c0-.818-.073-1.609-.209-2.373H12v4.5h6.455a5.514 5.514 0 0 1-2.391 3.614l3.736 2.895c2.182-2.01 3.691-4.968 3.691-8.636Z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.235 1.077 17.377C3.16 21.318 7.27 24 12 24c3.055 0 5.864-1.009 8.018-2.736l-3.736-2.895a7.11 7.11 0 0 1-4.282 1.182c-3.69 0-6.809-2.491-7.918-5.836h-4.816v.02c.002 0 0-.001 0 0Z"
              />
              <path
                fill="#34A853"
                d="M12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.16 2.682 1.077 6.623l4.189 3.142A7.059 7.059 0 0 1 12 4.909Z"
                clipPath="url(#a)"
              />
            </svg>
            Google
          </Button>

          <p className="mt-6 text-center text-sm font-sans text-[#5E5E5E]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#303030] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
