import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../../services/auth.service";
import { Button } from "../../components/common/Button";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token, { password, confirmPassword });
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to reset password.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-warm-white px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-card">
          <h2 className="text-2xl font-bold text-dark-gray">Invalid link</h2>
          <p className="mt-2 text-sm text-text-secondary">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

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

              <h2 className="text-center text-2xl font-bold text-dark-gray">Set new password</h2>
              <p className="mb-8 mt-1 text-center text-sm text-text-secondary">
                Enter a new password for your account.
              </p>

              {isSuccess ? (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                  <p className="text-sm font-medium text-green-800">Password reset successful!</p>
                  <p className="mt-1 text-sm text-green-700">
                    You can now sign in with your new password.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    className="mt-4"
                    onClick={() => navigate("/login")}
                  >
                    Go to login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-gray">New password</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
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
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-gray">Confirm password</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className={`focus-ring block w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-dark-gray placeholder:text-text-muted ${
                          errors.confirmPassword ? "border-red-400" : "border-border focus:border-primary"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-secondary"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
                    Reset password
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
