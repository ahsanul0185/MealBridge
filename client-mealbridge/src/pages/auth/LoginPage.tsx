import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth.service";
import { Button } from "../../components/common/Button";
import { useState } from "react";

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await login({ email: email.trim(), password });
      toast.success("Login successful!");
      // Navigate to role-based dashboard
      const role = result.data.user.role;
      navigate(`/${role}/dashboard`);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Invalid email or password.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-warm-white">
      <div className="mx-auto flex  max-w-7xl min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8">
      {/* Left Side - Hero */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-white py-14 pr-12 pl-2 lg:flex">
                <div>
          <h1 className="text-5xl font-bold leading-[1.15] tracking-tight text-dark-gray">
            Good food
          </h1>
          <h1 className="mt-1 text-5xl font-bold leading-[1.15] tracking-tight text-primary">
            Better together
          </h1>
          <p className="mt-6 max-w-[340px] text-base leading-relaxed text-text-secondary">
            MealBridge connects restaurants with NGOs to rescue extra food and deliver it to people who need it most.
          </p>
        </div>
        <div className="mt-8 flex flex-1 items-end justify-center">
          <img
            src="/login-page-image.png"
            alt="MealBridge Food Donation"
            className="max-h-[380px] w-auto object-contain"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 flex-col ">
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-full rounded-2xl border border-border bg-white p-8 shadow-card sm:p-10">
            <h2 className="text-center text-2xl font-bold text-dark-gray">Welcome back</h2>
            <p className="mb-8 mt-1 text-center text-sm text-text-secondary">
              Sign in to your MealBridge account
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark-gray">Email address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className={`focus-ring block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-dark-gray placeholder:text-text-muted ${
                      errors.email ? "border-red-400" : "border-border focus:border-primary"
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark-gray">Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`focus-ring block w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-dark-gray placeholder:text-text-muted ${
                      errors.password ? "border-red-400" : "border-border focus:border-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-secondary"
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
                Sign In
              </Button>

              <p className="text-center text-sm text-text-secondary">
                <Link to="/forgot-password" className="font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </p>

              <p className="text-center text-sm text-text-secondary">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Create account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
