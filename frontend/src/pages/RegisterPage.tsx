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
