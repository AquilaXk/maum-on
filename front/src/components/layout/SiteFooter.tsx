import ThemeToggle from "@/components/theme/ThemeToggle";
import { Phone, HeartPulse, ShieldAlert } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/50 py-8 transition-colors dark:border-slate-800/80 dark:bg-[#18191d]/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* 24시간 위기 대응 안내 배너 */}
        <div className="mb-6 rounded-2xl border border-rose-200/60 bg-rose-50/50 p-4 dark:border-rose-900/40 dark:bg-rose-950/20 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-rose-100 p-1.5 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                  24시간 마음 건강 위기상담 안내
                </p>
                <p className="mt-0.5 text-xs text-rose-700/90 dark:text-rose-300/80">
                  마음 온은 의료 서비스가 아니며 전문 진료를 대신할 수 없습니다. 극심한 고통이나 위기 상황에는 즉시 전문 상담전화의 도움을 받으세요.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <a
                href="tel:109"
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-white shadow-xs transition hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>자살예방 109</span>
              </a>
              <a
                href="tel:1577-0199"
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-rose-800 transition hover:bg-rose-100/60 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-slate-800"
              >
                <HeartPulse className="h-3.5 w-3.5" />
                <span>정신건강 1577-0199</span>
              </a>
              <a
                href="tel:119"
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-rose-800 transition hover:bg-rose-100/60 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-slate-800"
              >
                <span>긴급구조 119</span>
              </a>
            </div>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
            © 2026 MAUM-ON. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
