import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MonthlyMoodHeatmap, { MOOD_COLORS } from "./MonthlyMoodHeatmap";

describe("MonthlyMoodHeatmap", () => {
  it("renders 7-column grid, weekday headers, and 5-stage mood colors", () => {
    const entries = [
      { date: "2026-09-01", moodScore: 5, title: "최고의 하루" },
      { date: "2026-09-02", moodScore: 1, title: "힘든 하루" },
      { date: "2026-09-03", moodScore: 3, title: "무난한 하루" },
      { date: "2026-09-04", moodScore: 2, title: "지친 하루" },
      { date: "2026-09-05", moodScore: 4, title: "좋은 하루" },
    ];

    const html = renderToStaticMarkup(
      <MonthlyMoodHeatmap
        entries={entries}
        initialYear={2026}
        initialMonth={8} // September (0-indexed: 8)
      />,
    );

    // Verify header title
    expect(html).toContain("2026년 9월");

    // Verify 7 weekday headers
    expect(html).toContain("일");
    expect(html).toContain("월");
    expect(html).toContain("화");
    expect(html).toContain("수");
    expect(html).toContain("목");
    expect(html).toContain("금");
    expect(html).toContain("토");

    // Verify 5-stage mood colors are rendered in the HTML
    expect(html).toContain(MOOD_COLORS[1].bg); // Coral #EF4444
    expect(html).toContain(MOOD_COLORS[2].bg); // Amber #F97316
    expect(html).toContain(MOOD_COLORS[3].bg); // Yellow #EAB308
    expect(html).toContain(MOOD_COLORS[4].bg); // Sky #0284C7
    expect(html).toContain(MOOD_COLORS[5].bg); // Lavender #5C6BC0

    // Verify unrecorded dashed cells and legend
    expect(html).toContain("미기록");
    expect(html).toContain("기분 범례:");
  });
});
