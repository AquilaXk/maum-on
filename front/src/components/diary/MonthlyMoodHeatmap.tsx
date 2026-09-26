"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export interface MoodEntry {
  date: string; // ISO string e.g. "2026-09-26" or "2026-09-26T..."
  moodScore?: number | null;
  title?: string;
  id?: number;
}

interface MonthlyMoodHeatmapProps {
  entries: MoodEntry[];
  initialYear?: number;
  initialMonth?: number; // 0-indexed (0 = Jan, 11 = Dec)
  onSelectDate?: (dateKey: string, entry?: MoodEntry) => void;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export const MOOD_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: "#EF4444", text: "#FFFFFF", label: "매우 힘듦" },
  2: { bg: "#F97316", text: "#FFFFFF", label: "지침" },
  3: { bg: "#EAB308", text: "#FFFFFF", label: "보통" },
  4: { bg: "#0284C7", text: "#FFFFFF", label: "좋음" },
  5: { bg: "#5C6BC0", text: "#FFFFFF", label: "매우 좋음" },
};

export default function MonthlyMoodHeatmap({
  entries,
  initialYear,
  initialMonth,
  onSelectDate,
}: MonthlyMoodHeatmapProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(
      initialYear ?? now.getFullYear(),
      initialMonth ?? now.getMonth(),
      1,
    );
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Map entries by date key YYYY-MM-DD
  const entriesByDate = useMemo(() => {
    const map = new Map<string, MoodEntry>();
    for (const entry of entries) {
      if (!entry.date) continue;
      const dateKey = entry.date.slice(0, 10);
      map.set(dateKey, entry);
    }
    return map;
  }, [entries]);

  // Calendar matrix calculation
  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{
      day: number | null;
      dateKey: string | null;
      entry?: MoodEntry;
    }> = [];

    // Leading empty cells
    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: null, dateKey: null });
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(month + 1).padStart(2, "0");
      const dayStr = String(d).padStart(2, "0");
      const dateKey = `${year}-${monthStr}-${dayStr}`;
      const entry = entriesByDate.get(dateKey);
      cells.push({ day: d, dateKey, entry });
    }

    return cells;
  }, [year, month, entriesByDate]);

  return (
    <div
      data-testid="monthly-mood-heatmap"
      className="mb-10 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-colors dark:border-neutral-800 dark:bg-[#212529]/90"
    >
      {/* Heatmap Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Sparkles size={14} />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-neutral-100">
              {year}년 {month + 1}월 감정 컬러 히트맵
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
            하루하루 쌓아온 마음의 빛깔을 한눈에 확인하세요.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="이전 달"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[80px] text-center text-sm font-semibold text-slate-700 dark:text-neutral-200">
            {year}.{String(month + 1).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="다음 달"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Labels (7 columns) */}
      <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 dark:text-neutral-500">
        {WEEKDAYS.map((day, idx) => (
          <div
            key={day}
            className={idx === 0 ? "text-rose-500" : idx === 6 ? "text-sky-500" : ""}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 7-column Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarCells.map((cell, idx) => {
          if (!cell.day || !cell.dateKey) {
            return (
              <div
                key={`empty-${idx}`}
                className="aspect-square rounded-xl bg-transparent"
                aria-hidden="true"
              />
            );
          }

          const mood = cell.entry?.moodScore;
          const moodConfig = mood && MOOD_COLORS[mood] ? MOOD_COLORS[mood] : null;

          return (
            <button
              key={cell.dateKey}
              type="button"
              data-testid={`heatmap-cell-${cell.dateKey}`}
              onClick={() => onSelectDate?.(cell.dateKey!, cell.entry)}
              title={
                moodConfig
                  ? `${cell.dateKey}: ${moodConfig.label} (${mood}점) - ${cell.entry?.title || ""}`
                  : `${cell.dateKey}: 기록 없음`
              }
              className={`group relative flex aspect-square flex-col items-center justify-center rounded-xl p-1 text-xs transition-all duration-200 ${
                moodConfig
                  ? "shadow-sm hover:scale-105 hover:shadow-md cursor-pointer"
                  : "border border-dashed border-[#E2E8F0] dark:border-[#343A40] bg-slate-50/50 dark:bg-neutral-900/30 text-slate-400 dark:text-neutral-500 hover:border-slate-300 dark:hover:border-neutral-600"
              }`}
              style={
                moodConfig
                  ? {
                      backgroundColor: moodConfig.bg,
                      color: moodConfig.text,
                    }
                  : undefined
              }
            >
              <span className="font-semibold">{cell.day}</span>
              {moodConfig && (
                <span className="hidden text-[10px] font-medium opacity-90 sm:inline">
                  {moodConfig.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Heatmap Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-neutral-800/80 dark:text-neutral-400">
        <span className="font-medium text-slate-400 dark:text-neutral-500">기분 범례:</span>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-full border border-dashed border-[#E2E8F0] bg-slate-100 dark:border-[#343A40] dark:bg-neutral-800"
            title="미기록"
          />
          <span>미기록</span>
        </div>
        {[1, 2, 3, 4, 5].map((score) => {
          const config = MOOD_COLORS[score];
          return (
            <div key={score} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full shadow-xs"
                style={{ backgroundColor: config.bg }}
                title={`${score}점: ${config.label}`}
              />
              <span>
                {score}점 ({config.label})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
