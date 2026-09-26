import ThemeToggle from "@/components/theme/ThemeToggle";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/50 py-8 transition-colors dark:border-slate-800/80 dark:bg-[#18191d]/80">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
          © 2026 MAUM-ON. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
