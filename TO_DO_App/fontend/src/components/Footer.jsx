export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-100 text-stone-500 text-xs">
      <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-serif italic">Intentional living, one task at a time.</p>
        <div className="flex items-center gap-4 text-stone-600">
          <a href="#archive" className="hover:underline">Archive</a>
          <span>•</span>
          <a href="#settings" className="hover:underline">Settings</a>
        </div>
      </div>
    </footer>
  );
}