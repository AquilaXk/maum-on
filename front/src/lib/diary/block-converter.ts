export interface DiaryContentBlock {
  id: string;
  type: "text" | "image";
  text?: string;
  imageUrl?: string;
  filename?: string;
  byteSize?: number;
  source?: string;
  contentType?: string;
  uploadStatus?: string;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function htmlToDiaryBlocks(html: string): DiaryContentBlock[] {
  if (!html || !html.trim()) {
    return [];
  }

  const blocks: DiaryContentBlock[] = [];
  let blockIndex = 0;

  if (typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const processElement = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        if (tagName === "script" || tagName === "style") {
          return;
        }

        if (tagName === "img") {
          const img = el as HTMLImageElement;
          const src = img.getAttribute("src");
          if (src) {
            blocks.push({
              id: `image-${blockIndex++}`,
              type: "image",
              imageUrl: src,
              filename: img.getAttribute("data-filename") || img.getAttribute("alt") || undefined,
              byteSize: img.getAttribute("data-size") ? Number(img.getAttribute("data-size")) : undefined,
            });
          }
          return;
        }

        const isContainer = ["div", "section", "article", "main", "figure", "ul", "ol"].includes(tagName);
        if (el.querySelector("img") || (isContainer && el.children.length > 0)) {
          Array.from(el.childNodes).forEach(processElement);
          return;
        }

        const text = el.textContent?.replace(/\u00a0/g, " ").trim();
        if (text) {
          blocks.push({
            id: `text-${blockIndex++}`,
            type: "text",
            text,
          });
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.replace(/\u00a0/g, " ").trim();
        if (text) {
          blocks.push({
            id: `text-${blockIndex++}`,
            type: "text",
            text,
          });
        }
      }
    };

    Array.from(doc.body.childNodes).forEach(processElement);
  } else {
    // Universal regex-based parser when DOMParser is unavailable (e.g. Node.js environment)
    const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = imgRegex.exec(html)) !== null) {
      const textBefore = html.substring(lastIndex, match.index);
      const cleanText = stripHtml(textBefore);
      if (cleanText) {
        blocks.push({
          id: `text-${blockIndex++}`,
          type: "text",
          text: cleanText,
        });
      }

      const imgTag = match[0];
      const src = match[1];
      const dataFilenameMatch = imgTag.match(/data-filename=["']([^"']+)["']/i);
      const altMatch = imgTag.match(/alt=["']([^"']+)["']/i);
      const filename = dataFilenameMatch ? dataFilenameMatch[1] : (altMatch ? altMatch[1] : undefined);
      const sizeMatch = imgTag.match(/data-size=["']([^"']+)["']/i);

      blocks.push({
        id: `image-${blockIndex++}`,
        type: "image",
        imageUrl: src,
        filename,
        byteSize: sizeMatch ? Number(sizeMatch[1]) : undefined,
      });

      lastIndex = imgRegex.lastIndex;
    }

    const remainingText = html.substring(lastIndex);
    const cleanRemaining = stripHtml(remainingText);
    if (cleanRemaining) {
      blocks.push({
        id: `text-${blockIndex++}`,
        type: "text",
        text: cleanRemaining,
      });
    }
  }

  if (blocks.length === 0) {
    const rawText = stripHtml(html);
    if (rawText) {
      blocks.push({
        id: `text-${blockIndex++}`,
        type: "text",
        text: rawText,
      });
    }
  }

  return blocks;
}

export function diaryBlocksToHtml(blocks: DiaryContentBlock[]): string {
  if (!blocks || blocks.length === 0) {
    return "<p><br></p>";
  }

  return blocks
    .map((block) => {
      if (block.type === "image" && block.imageUrl) {
        const alt = escapeHtml(block.filename || "");
        const src = escapeHtml(block.imageUrl);
        const dataFilename = block.filename ? ` data-filename="${escapeHtml(block.filename)}"` : "";
        const dataSize = block.byteSize ? ` data-size="${block.byteSize}"` : "";
        return `<figure><img src="${src}" alt="${alt}"${dataFilename}${dataSize} /></figure>`;
      }
      if (block.type === "text") {
        const text = block.text || "";
        if (!text.trim()) {
          return "<p><br></p>";
        }
        return text
          .split("\n")
          .map((line) => `<p>${escapeHtml(line) || "<br>"}</p>`)
          .join("");
      }
      return "";
    })
    .filter(Boolean)
    .join("");
}
