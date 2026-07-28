// Cover SVG rendering — shared between ArticleCover.astro and search-index.json.ts
// Returns raw SVG markup that can be embedded anywhere.

export interface CoverData {
  title: string;
  category: 'ai' | 'football' | 'fragments';
  coverKeyword?: string;
  coverData?: number[];
  coverMultiline?: number[][];
  coverMotif?: 'loop' | 'viewfinder' | 'strata' | 'curve' | 'multiline' | 'weeknum' | 'keyword' | 'firstChar';
  coverWeek?: number;
}

const palettes = {
  ai: { bg: '#132229', accent: '#18c7b7', label: 'AI' },
  football: { bg: '#232e2c', accent: '#f06455', label: '足球' },
  fragments: { bg: '#1c1c16', accent: '#e7b844', label: '碎片' },
};

const a = (accent: string, o: number) => accent + Math.round(o * 255).toString(16).padStart(2, '0');

function keywordTextLength(word: string, isLg: boolean): number {
  const per = isLg ? 23 : 19;
  const max = isLg ? 170 : 138;
  return Math.min(max, Math.max(96, word.length * per));
}

function buildSingle(data: number[]): string {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padX = 28, padTop = 26, padBot = 30, w = 240, h = 120;
  return data
    .map((v, i) => {
      const x = padX + (i / (data.length - 1)) * (w - padX * 2);
      const y = h - padBot - ((v - min) / range) * (h - padTop - padBot);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function buildMulti(series: number[][]): string[] {
  const padX = 28, padTop = 26, padBot = 30, w = 240, h = 120;
  return series.map((arr) => {
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min || 1;
    return arr
      .map((v, i) => {
        const x = padX + (i / (arr.length - 1)) * (w - padX * 2);
        const y = h - padBot - ((v - min) / range) * (h - padTop - padBot);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });
}

function motifInner(data: CoverData, accent: string, isLg: boolean): string {
  const { title, coverKeyword, coverData, coverMultiline, coverMotif, coverWeek } = data;
  let motif = coverMotif;
  if (!motif) {
    if (coverKeyword) motif = 'keyword';
    else if (coverData) motif = 'curve';
    else if (coverMultiline) motif = 'multiline';
    else motif = 'firstChar';
  }

  if (motif === 'loop' && coverKeyword) {
    const tl = keywordTextLength(coverKeyword, isLg);
    return `
    <circle cx="120" cy="42" r="24" fill="none" stroke="${a(accent, 0.5)}" stroke-width="1.4" />
    <path d="M120,18 A24,24 0 1 1 96,42" fill="none" stroke="${a(accent, 0.9)}" stroke-width="2.4" stroke-linecap="round" />
    <path d="M96,42 l-7,-1 l2.5,7 Z" fill="${a(accent, 0.9)}" />
    <text x="120" y="92" text-anchor="middle" textLength="${tl}" lengthAdjust="spacingAndGlyphs"
      font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"
      font-size="26" font-weight="600" letter-spacing="0.04em" fill="${a(accent, 0.92)}">${coverKeyword}</text>`;
  } else if (motif === 'viewfinder' && coverKeyword) {
    const tl = keywordTextLength(coverKeyword, isLg);
    const bracket = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) =>
      `<path d="M${x1},${y1} L${x2},${y2} L${x3},${y3}" fill="none" stroke="${a(accent, 0.55)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`;
    let dots = '';
    const dotXs = [82, 96, 110, 124, 138, 152, 166];
    dotXs.forEach((x, i) => {
      const op = 0.7 - (i / (dotXs.length - 1)) * 0.55;
      dots += `<circle cx="${x}" cy="44" r="2.1" fill="${a(accent, op)}" />`;
    });
    return `
    ${bracket(66, 30, 66, 18, 78, 18)}
    ${bracket(174, 30, 174, 18, 162, 18)}
    ${bracket(66, 96, 66, 108, 78, 108)}
    ${bracket(174, 96, 174, 108, 162, 108)}
    ${dots}
    <text x="120" y="82" text-anchor="middle" textLength="${tl}" lengthAdjust="spacingAndGlyphs"
      font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"
      font-size="26" font-weight="600" letter-spacing="0.04em" fill="${a(accent, 0.92)}">${coverKeyword}</text>`;
  } else if (motif === 'strata') {
    return `
    <rect x="62" y="26" width="116" height="16" rx="3" fill="${a(accent, 0.82)}" />
    <rect x="62" y="50" width="116" height="16" rx="3" fill="none" stroke="${a(accent, 0.55)}" stroke-width="1.2" />
    <line x1="62" y1="74" x2="178" y2="74" stroke="${a(accent, 0.4)}" stroke-width="1" stroke-dasharray="4 4" />
    <rect x="62" y="80" width="116" height="14" rx="3" fill="${a(accent, 0.26)}" />
    <path d="M44,34 L44,87" stroke="${a(accent, 0.45)}" stroke-width="1.4" stroke-linecap="round" />
    <path d="M44,87 l-4,-7 l8,0 Z" fill="${a(accent, 0.45)}" />
    <path d="M196,87 L196,34" stroke="${a(accent, 0.3)}" stroke-width="1.2" stroke-dasharray="3 4" stroke-linecap="round" />
    <path d="M196,34 l-4,7 l8,0 Z" fill="${a(accent, 0.3)}" />`;
  } else if (motif === 'curve' && coverData) {
    const pts = buildSingle(coverData);
    const endX = 28 + (coverData.length - 1) / (coverData.length - 1) * (240 - 56);
    const max = Math.max(...coverData);
    const min = Math.min(...coverData);
    const range = max - min || 1;
    const endY = 120 - 30 - ((coverData[coverData.length - 1] - min) / range) * (120 - 26 - 30);
    return `
    <line x1="28" y1="90" x2="212" y2="90" stroke="${a(accent, 0.12)}" stroke-width="0.8" />
    <circle cx="120" cy="98" r="11" fill="none" stroke="${a(accent, 0.16)}" stroke-width="1" />
    <polyline points="${pts}" stroke="${a(accent, 0.1)}" stroke-width="${isLg ? 9 : 7}" fill="none" stroke-linejoin="round" stroke-linecap="round" />
    <polyline points="${pts}" stroke="${a(accent, 0.95)}" stroke-width="${isLg ? 3 : 2.4}" fill="none" stroke-linejoin="round" stroke-linecap="round" />
    <circle cx="${endX.toFixed(1)}" cy="${endY.toFixed(1)}" r="3.2" fill="${a(accent, 0.95)}" />`;
  } else if (motif === 'multiline' && coverMultiline) {
    const lines = buildMulti(coverMultiline);
    const opac = [0.9, 0.55, 0.32];
    const widths = [isLg ? 2.4 : 1.8, isLg ? 1.8 : 1.4, isLg ? 1.4 : 1.1];
    let svg = `<line x1="28" y1="92" x2="212" y2="92" stroke="${a(accent, 0.1)}" stroke-width="0.8" />`;
    lines.forEach((pts, i) => {
      svg += `<polyline points="${pts}" stroke="${a(accent, opac[i])}" stroke-width="${widths[i]}" fill="none" stroke-linejoin="round" stroke-linecap="round" />`;
    });
    return svg;
  } else if (motif === 'weeknum' && coverWeek) {
    const wstr = String(coverWeek);
    return `
    <text x="120" y="36" text-anchor="middle"
      font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"
      font-size="9" font-weight="600" letter-spacing="0.32em" fill="${a(accent, 0.6)}">WEEK</text>
    <text x="120" y="76" text-anchor="middle"
      font-family="Georgia, 'Times New Roman', serif"
      font-size="44" font-weight="600" fill="${a(accent, 0.92)}">${wstr}</text>
    <rect x="86" y="88" width="68" height="2.4" rx="1.2" fill="${a(accent, 0.42)}" />
    <rect x="86" y="95" width="52" height="2.4" rx="1.2" fill="${a(accent, 0.3)}" />
    <rect x="86" y="102" width="60" height="2.4" rx="1.2" fill="${a(accent, 0.2)}" />`;
  } else if (motif === 'keyword' && coverKeyword) {
    const tl = keywordTextLength(coverKeyword, isLg);
    return `
    <text x="120" y="68" text-anchor="middle" textLength="${tl}" lengthAdjust="spacingAndGlyphs"
      font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"
      font-size="30" font-weight="600" letter-spacing="0.04em" fill="${a(accent, 0.9)}">${coverKeyword}</text>`;
  } else {
    const firstChar = title.charAt(0);
    return `
    <text x="120" y="76" text-anchor="middle"
      font-family="Georgia, 'Times New Roman', serif"
      font-size="48" font-weight="500" fill="${a(accent, 0.88)}">${firstChar}</text>`;
  }
}

export function renderCoverSVG(data: CoverData, size: 'sm' | 'lg' = 'sm'): string {
  const color = palettes[data.category] || palettes.ai;
  const accent = color.accent;
  const inner = motifInner(data, accent, size === 'lg');
  return `<svg class="cover-svg" viewBox="0 0 240 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="240" height="120" fill="${color.bg}" />
    ${inner}
  </svg>`;
}
