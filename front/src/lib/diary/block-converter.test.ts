import { describe, expect, it } from "vitest";
import {
  htmlToDiaryBlocks,
  diaryBlocksToHtml,
  stripHtml,
} from "./block-converter";

describe("block-converter", () => {
  it("converts HTML with paragraphs and images to DiaryContentBlock list", () => {
    const html = `<p>안녕하세요. 첫 번째 문단입니다.</p><figure><img src="/images/uploads/1/photo.jpg" alt="사진1" data-filename="photo.jpg" data-size="1024" /></figure><p>두 번째 문단입니다.</p>`;
    const blocks = htmlToDiaryBlocks(html);

    expect(blocks.length).toBe(3);
    expect(blocks[0].type).toBe("text");
    expect(blocks[0].text).toContain("첫 번째 문단입니다.");

    expect(blocks[1].type).toBe("image");
    expect(blocks[1].imageUrl).toBe("/images/uploads/1/photo.jpg");
    expect(blocks[1].filename).toBe("photo.jpg");
    expect(blocks[1].byteSize).toBe(1024);

    expect(blocks[2].type).toBe("text");
    expect(blocks[2].text).toContain("두 번째 문단입니다.");
  });

  it("converts DiaryContentBlock list to clean, safe HTML", () => {
    const blocks = [
      { id: "text-0", type: "text" as const, text: "첫 줄\n둘째 줄" },
      {
        id: "image-1",
        type: "image" as const,
        imageUrl: "/images/uploads/1/art.png",
        filename: "art.png",
        byteSize: 2048,
      },
    ];

    const html = diaryBlocksToHtml(blocks);
    expect(html).toContain("<p>첫 줄</p><p>둘째 줄</p>");
    expect(html).toContain('<img src="/images/uploads/1/art.png" alt="art.png" data-filename="art.png" data-size="2048" />');
  });

  it("handles empty or blank content gracefully", () => {
    expect(htmlToDiaryBlocks("")).toEqual([]);
    expect(htmlToDiaryBlocks("   ")).toEqual([]);
    expect(diaryBlocksToHtml([])).toBe("<p><br></p>");
  });

  it("strips raw HTML tags from text cleanly", () => {
    const raw = "<p><strong>강조</strong> 및 <em>이탤릭</em><br>새 줄</p>";
    const text = stripHtml(raw);
    expect(text).toContain("강조 및 이탤릭");
    expect(text).toContain("새 줄");
  });
});
