// Generates a downloadable "patches on a table" collage image for a user's
// completed (and optionally in-progress) patches.

export type PatchBoardItem = {
  id: string;
  name: string;
  imageUrl?: string | null;
  status: 'Completed' | 'In Progress';
  dateCompleted?: string | null;
};

const CELL_SIZE = 200;
const PADDING = 16;
const HEADER_HEIGHT = 90;
const FOOTER_HEIGHT = 36;
const MAX_COLS = 6;
const IMAGE_AREA_INSET = 12;
const LABEL_PADDING_X = 10;
const LABEL_PADDING_Y = 6;
const LABEL_GAP = 6;
const NAME_FONT = '600 13px sans-serif';
const NAME_LINE_HEIGHT = 14;
const DATE_FONT = '11px sans-serif';
const DATE_LINE_HEIGHT = 13;

export async function generatePatchBoardImage(
  canvas: HTMLCanvasElement,
  items: PatchBoardItem[],
): Promise<void> {
  const count = Math.max(items.length, 1);
  const cols = Math.min(MAX_COLS, Math.max(1, Math.ceil(Math.sqrt(count))));
  const rows = Math.ceil(count / cols);

  const width = cols * CELL_SIZE + (cols + 1) * PADDING;
  const height = HEADER_HEIGHT + rows * CELL_SIZE + (rows + 1) * PADDING + FOOTER_HEIGHT;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  drawBackground(ctx, width, height);
  drawHeader(ctx, width, items);

  const images = await Promise.all(items.map((item) => loadImage(item.imageUrl)));

  items.forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = PADDING + col * (CELL_SIZE + PADDING);
    const y = HEADER_HEIGHT + PADDING + row * (CELL_SIZE + PADDING);
    drawPatchCell(ctx, item, images[i], x, y);
  });

  drawFooter(ctx, width, height);
}

function loadImage(src?: string | null): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#b07b50');
  gradient.addColorStop(0.5, '#8b5a36');
  gradient.addColorStop(1, '#6b4226');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) / 2.5,
    width / 2,
    height / 2,
    Math.max(width, height) / 1.1,
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function drawHeader(ctx: CanvasRenderingContext2D, width: number, items: PatchBoardItem[]) {
  const completedCount = items.filter((i) => i.status === 'Completed').length;
  const inProgressCount = items.filter((i) => i.status === 'In Progress').length;

  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 4;

  ctx.fillStyle = '#fff8ec';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('My Hiking Patches', width / 2, 42);

  let summary = `${completedCount} completed`;
  if (inProgressCount > 0) summary += ` · ${inProgressCount} in progress`;
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  summary += ` · ${dateStr}`;

  ctx.font = '16px sans-serif';
  ctx.shadowBlur = 2;
  ctx.fillText(summary, width / 2, 68);

  ctx.shadowBlur = 0;
}

function drawFooter(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,248,236,0.7)';
  ctx.font = '13px sans-serif';
  ctx.fillText('hiking-patches.com', width / 2, height - 14);
}

function drawPatchCell(
  ctx: CanvasRenderingContext2D,
  item: PatchBoardItem,
  img: HTMLImageElement | null,
  x: number,
  y: number,
) {
  const label = measureLabel(ctx, item);

  if (img) {
    const imageAreaSize = CELL_SIZE - IMAGE_AREA_INSET * 2;
    const maxImageHeight = imageAreaSize - label.boxHeight - LABEL_GAP;
    const scale = Math.min(imageAreaSize / img.width, maxImageHeight / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    const drawX = x + IMAGE_AREA_INSET + (imageAreaSize - drawWidth) / 2;
    const drawY = y + IMAGE_AREA_INSET + (maxImageHeight - drawHeight) / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  }

  drawLabel(ctx, label, x, y);

  if (item.status === 'In Progress') {
    const tagWidth = 82;
    const tagHeight = 20;
    roundedRectPath(ctx, x + 8, y + 8, tagWidth, tagHeight, 10);
    ctx.fillStyle = '#facc15';
    ctx.fill();
    ctx.fillStyle = '#1f2937';
    ctx.font = '600 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('In Progress', x + 8 + tagWidth / 2, y + 8 + tagHeight / 2 + 4);
  }
}

type LabelInfo = {
  nameLines: string[];
  dateText: string | null;
  boxWidth: number;
  boxHeight: number;
};

// Measures the patch name (wrapped, possibly ellipsized) and completion date
// so the label box and image area can be sized to fit both.
function measureLabel(ctx: CanvasRenderingContext2D, item: PatchBoardItem): LabelInfo {
  const maxTextWidth = CELL_SIZE - IMAGE_AREA_INSET * 2 - LABEL_PADDING_X * 2;

  ctx.font = NAME_FONT;
  const nameLines = wrapLines(ctx, item.name, maxTextWidth);
  const nameWidths = nameLines.map((line) => ctx.measureText(line).width);

  let dateText: string | null = null;
  let dateWidth = 0;
  if (item.status === 'Completed' && item.dateCompleted) {
    dateText = formatDate(item.dateCompleted);
    ctx.font = DATE_FONT;
    dateWidth = ctx.measureText(dateText).width;
  }

  const textWidth = Math.max(...nameWidths, dateWidth);
  const boxWidth = Math.min(CELL_SIZE - IMAGE_AREA_INSET * 2, textWidth + LABEL_PADDING_X * 2);
  const contentHeight = nameLines.length * NAME_LINE_HEIGHT + (dateText ? DATE_LINE_HEIGHT : 0);
  const boxHeight = contentHeight + LABEL_PADDING_Y * 2;

  return { nameLines, dateText, boxWidth, boxHeight };
}

// Draws the patch name (and completion date, if any) in a small cream label
// box near the bottom of the cell.
function drawLabel(ctx: CanvasRenderingContext2D, label: LabelInfo, x: number, y: number) {
  const boxX = x + (CELL_SIZE - label.boxWidth) / 2;
  const boxY = y + CELL_SIZE - IMAGE_AREA_INSET - label.boxHeight;

  roundedRectPath(ctx, boxX, boxY, label.boxWidth, label.boxHeight, 8);
  ctx.fillStyle = 'rgba(255, 250, 240, 0.92)';
  ctx.fill();

  ctx.textAlign = 'center';
  const centerX = x + CELL_SIZE / 2;
  let lineTop = boxY + LABEL_PADDING_Y;

  ctx.fillStyle = '#3a2a1a';
  ctx.font = NAME_FONT;
  label.nameLines.forEach((line) => {
    ctx.fillText(line, centerX, lineTop + NAME_LINE_HEIGHT * 0.78);
    lineTop += NAME_LINE_HEIGHT;
  });

  if (label.dateText) {
    ctx.fillStyle = '#8a7a68';
    ctx.font = DATE_FONT;
    ctx.fillText(label.dateText, centerX, lineTop + DATE_LINE_HEIGHT * 0.78);
  }
}

// Formats an AWSDate string ("YYYY-MM-DD") using local date parts to avoid
// UTC-parsing off-by-one-day issues.
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// Wraps text into up to 2 lines that fit within `maxWidth`, ellipsizing the
// last line if it still doesn't fit.
function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(candidate).width > maxWidth) {
      lines.push(current);
      current = word;
      if (lines.length === 2) break;
    } else {
      current = candidate;
    }
  }
  if (lines.length < 2 && current) lines.push(current);

  const consumedWords = lines.join(' ').split(/\s+/).length;
  if (consumedWords < words.length || ctx.measureText(lines[lines.length - 1]).width > maxWidth) {
    let last = lines[lines.length - 1] ?? '';
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    lines[lines.length - 1] = `${last.trimEnd()}…`;
  }

  return lines;
}
