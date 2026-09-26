'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

function subscribe(callback: () => void) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'class') {
        callback();
      }
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains('dark');
}

function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.theme = 'light';
      } catch {
        // ignore storage errors
      }
    } else {
      document.documentElement.classList.add('dark');
      try {
        localStorage.theme = 'dark';
      } catch {
        // ignore storage errors
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 cursor-pointer"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform" />
      ) : (
        <Moon className="h-4 w-4 text-slate-600 transition-transform" />
      )}
    </button>
  );
}
