import { Link } from "react-router-dom";

interface AuthHeaderProps {
  rightText: string;
  rightButtonText: string;
  rightButtonHref: string;
}

export function AuthHeader({ rightText, rightButtonText, rightButtonHref }: AuthHeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 py-6 sm:px-12">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <img
          src="/logo-mealbridge.png"
          alt="MealBridge"
          className="h-13 object-contain"
        />
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary">{rightText}</span>
        <Link
          to={rightButtonHref}
          className="rounded-lg border-2 border-primary px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          {rightButtonText}
        </Link>
      </div>
    </div>
  );
}
