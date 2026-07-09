export function Footer() {
  return (
    <footer className="border-t border-border bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-text-muted">
          Trusted by restaurants. Powered by purpose.
        </p>
        <p className="mt-1 text-xs text-text-muted">
          MealBridge &copy; {new Date().getFullYear()}. Connecting extra food with those who need it.
        </p>
      </div>
    </footer>
  );
}
