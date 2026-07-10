import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useState } from "react";
import { forgotPassword } from "../../services/auth.service";
import { Button } from "../../components/common/Button";
import { Mail, ArrowLeft } from "lucide-react";

interface FormErrors {
  email?: string;
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await forgotPassword({ email: email.trim() });
      setIsSuccess(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-warm-white">
      <div className="mx-auto flex max-w-7xl min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8">
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
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-full rounded-2xl border border-border bg-white p-8 shadow-card sm:p-10">
              <Link
                to="/login"
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>

              <h2 className="text-center text-2xl font-bold text-dark-gray">Forgot password?</h2>
              <p className="mb-8 mt-1 text-center text-sm text-text-secondary">
                Enter your email and we'll send you a reset link.
              </p>

              {isSuccess ? (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                  <p className="text-sm font-medium text-green-800">Reset link sent!</p>
                  <p className="mt-1 text-sm text-green-700">
                    A reset link has been sent to <strong>{email}</strong>.
                  </p>
                  <Link
                    to="/login"
                    className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    Return to login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-gray">Email address</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                        <Mail className="h-4 w-4" />
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

                  <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
                    Send reset link
                  </Button>

                  <p className="text-center text-sm text-text-secondary">
                    Remember your password?{" "}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
