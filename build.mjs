#!/usr/bin/env node
/**
 * Tailwind CDN → Local CSS Build
 * 각 앱 디렉토리의 HTML에서 tailwind.config를 추출하여 앱별 style.css 빌드
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LANDING = __dirname;

// 앱별 빌드 그룹 정의
// dir: landing/ 하위 경로 ('' = root)
// htmlOnly: true면 dir 직하 *.html만 처리 (하위 디렉토리 제외)
// themeExtend: tailwind theme.extend 객체 (HTML에서 config 제거된 후에도 유지)
const APP_GROUPS = [
  {
    name: 'root', dir: '', htmlOnly: true,
    themeExtend: `
      colors: {
        primary: '#F97316', secondary: '#FB923C', cta: '#2563EB',
        background: '#FFF7ED', text: '#9A3412', dark: '#1F2937',
      },
      fontFamily: { heading: ['Space Grotesk', 'sans-serif'], body: ['DM Sans', 'sans-serif'] },`,
  },
  {
    name: 'blog', dir: 'blog',
    themeExtend: `
      colors: { primary: '#F97316', dark: '#09090B', surface: '#18181B', muted: '#3F3F46', light: '#FAFAFA' },
      fontFamily: { heading: ['Archivo', 'sans-serif'], body: ['Space Grotesk', 'sans-serif'] },`,
  },
  {
    name: 'keeps', dir: 'keeps',
    themeExtend: `
      colors: { primary: '#0F766E', secondary: '#14B8A6', cta: '#0369A1', bg: '#F0FDFA', text: '#134E4A', dark: '#0F172A' },
      fontFamily: { heading: ['Cinzel', 'serif'], body: ['Josefin Sans', 'sans-serif'] },`,
  },
  {
    name: 'launchcrew', dir: 'launchcrew',
    themeExtend: `
      colors: {
        primary: '#4F46E5', 'primary-dark': '#3730A3', 'primary-light': '#818CF8',
        secondary: '#7C3AED', accent: '#F97316', 'bg-soft': '#F5F3FF', dark: '#1E1B4B',
      },
      fontFamily: { heading: ['Outfit', 'sans-serif'], body: ['DM Sans', 'sans-serif'] },`,
  },
  {
    name: 'trip-helper', dir: 'trip-helper',
    themeExtend: `
      colors: { primary: '#0EA5E9', secondary: '#38BDF8', accent: '#F97316', background: '#F0F9FF', text: '#0C4A6E' },
      fontFamily: { sans: ['Inter', 'sans-serif'] },`,
  },
  {
    name: 'voiceting', dir: 'voiceting',
    themeExtend: `
      colors: {
        primary: '#e63946', 'primary-hover': '#c9303c', 'primary-light': '#fff0f0',
        'primary-soft': '#ffccd0', secondary: '#ffb3ba', 'text-main': '#2d1b1b',
        'text-muted': '#8b6b6b', 'border-soft': 'rgba(230, 57, 70, 0.15)', accent: '#ffd4d8',
      },
      fontFamily: { sans: ['Noto Sans KR', 'sans-serif'] },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem' },`,
  },
  {
    name: 'mbti-luck', dir: 'mbti-luck',
    themeExtend: `
      colors: { primary: '#2563EB', secondary: '#3B82F6', accent: '#F97316', background: '#F8FAFC', text: '#1E293B' },
      fontFamily: { sans: ['Inter', 'sans-serif'] },`,
  },
  {
    name: 'ai-media-detector', dir: 'ai-media-detector',
    themeExtend: `
      colors: { primary: '#22C55E', dark: '#0F172A', surface: '#1E293B', muted: '#334155', accent: '#F8FAFC' },
      fontFamily: { heading: ['Cinzel', 'serif'], body: ['Josefin Sans', 'sans-serif'] },`,
  },
  {
    name: 'unmask', dir: 'unmask',
    themeExtend: `
      colors: { primary: '#18181B', secondary: '#27272A', accent: '#F8FAFC', background: '#000000', text: '#FAFAFA' },
      fontFamily: { heading: ['Abril Fatface', 'serif'], body: ['Merriweather', 'serif'] },`,
  },
];

const INPUT_CSS = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`;

// --- 헬퍼 함수 ---

/** HTML에서 tailwind.config 객체 추출 (중첩 브레이스 안전 처리) */
function extractTailwindConfig(html) {
  const marker = 'tailwind.config = ';
  const markerIdx = html.indexOf(marker);
  if (markerIdx === -1) return null;

  const objStart = html.indexOf('{', markerIdx);
  if (objStart === -1) return null;

  let depth = 0;
  let i = objStart;
  while (i < html.length) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
    i++;
  }
  return html.slice(objStart, i + 1); // "{ theme: { extend: { ... } } }"
}

/** 디렉토리 내 모든 HTML 파일 목록 (재귀 or 직하만) */
function getHtmlFiles(dir, recursive = true) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && recursive) {
      results.push(...getHtmlFiles(fullPath, true));
    } else if (item.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

/** HTML 파일에서 CDN 스크립트 → link 태그 교체, tailwind.config 블록 제거 */
function patchHtml(htmlFile, cssRelPath) {
  let html = fs.readFileSync(htmlFile, 'utf8');
  const original = html;

  // 1) CDN script 태그 → link 태그 교체
  html = html.replace(
    /<script src="https:\/\/cdn\.tailwindcss\.com[^"]*"><\/script>\r?\n?/g,
    `<link rel="stylesheet" href="${cssRelPath}">\n`
  );

  // 2) tailwind.config = { ... } 스크립트 블록 제거
  html = html.replace(
    /<script>\r?\n\s*tailwind\.config\s*=\s*\{[\s\S]*?\}\r?\n\s*<\/script>\r?\n?/g,
    ''
  );

  if (html !== original) {
    fs.writeFileSync(htmlFile, html);
    return true;
  }
  return false;
}

// --- 메인 빌드 루프 ---

let totalBuilt = 0;
let totalPatched = 0;

for (const app of APP_GROUPS) {
  const appAbsDir = path.join(LANDING, app.dir);
  const mainHtml = path.join(appAbsDir, 'index.html');

  if (!fs.existsSync(mainHtml)) {
    console.log(`⏭  ${app.name}: index.html 없음, 건너뜀`);
    continue;
  }

  console.log(`\n🔨 Building: ${app.name} (${app.dir || 'root'})`);

  // tailwind.config 추출 (HTML에 남아있으면 우선 사용, 없으면 하드코딩 사용)
  const html = fs.readFileSync(mainHtml, 'utf8');
  const configObj = extractTailwindConfig(html);

  // content 경로: 앱 디렉토리 내 모든 HTML
  const contentGlob = app.htmlOnly ? ['./*.html'] : ['./**/*.html'];

  // 임시 tailwind.config.cjs 생성
  const configPath = path.join(appAbsDir, '_tailwind.config.cjs');
  if (configObj) {
    // HTML에 config가 남아있으면 그것 사용
    const inner = configObj.slice(1, configObj.lastIndexOf('}')).trim();
    fs.writeFileSync(
      configPath,
      `module.exports = {\n  content: ${JSON.stringify(contentGlob)},\n  ${inner}\n};\n`
    );
  } else if (app.themeExtend) {
    // 하드코딩된 config 사용
    fs.writeFileSync(
      configPath,
      `module.exports = {\n  content: ${JSON.stringify(contentGlob)},\n  theme: { extend: {${app.themeExtend}\n  } }\n};\n`
    );
  } else {
    fs.writeFileSync(
      configPath,
      `module.exports = {\n  content: ${JSON.stringify(contentGlob)},\n};\n`
    );
  }

  // 임시 input.css 생성
  const inputPath = path.join(appAbsDir, '_input.css');
  fs.writeFileSync(inputPath, INPUT_CSS);

  // Tailwind CLI 빌드
  const outputPath = path.join(appAbsDir, 'style.css');
  try {
    execSync(
      `npx tailwindcss -c _tailwind.config.cjs -i _input.css -o style.css --minify`,
      { cwd: appAbsDir, stdio: 'pipe' }
    );
    const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(1);
    console.log(`  ✅ style.css 생성 완료 (${sizeKB} KB)`);
    totalBuilt++;
  } catch (err) {
    console.error(`  ❌ 빌드 실패:`, err.stderr?.toString() || err.message);
  } finally {
    // 임시 파일 정리
    fs.existsSync(configPath) && fs.unlinkSync(configPath);
    fs.existsSync(inputPath) && fs.unlinkSync(inputPath);
  }

  // HTML 파일 패치
  const htmlFiles = getHtmlFiles(appAbsDir, !app.htmlOnly);
  for (const htmlFile of htmlFiles) {
    const htmlDir = path.dirname(htmlFile);
    const cssAbsPath = path.join(appAbsDir, 'style.css');
    let relPath = path.relative(htmlDir, cssAbsPath);
    if (!relPath.startsWith('.')) relPath = './' + relPath;

    const patched = patchHtml(htmlFile, relPath);
    if (patched) {
      console.log(`  📝 ${path.relative(LANDING, htmlFile)}`);
      totalPatched++;
    }
  }
}

console.log(`\n✨ 완료: ${totalBuilt}개 CSS 빌드, ${totalPatched}개 HTML 패치`);
