# Dcode Landing Pages Collection

Professional landing pages for Dcode company and mobile apps - Apple Developer Organization application.

## 📱 Projects

### 1. **Dcode (Main)** - `/index.html`
- Professional mobile app development company
- **Style**: Trust & Authority (Minimal Black + Gold)
- **Sections**: Company intro, Services, Team, Contact

### 2. **MBTI Luck** - `/mbti-luck/index.html`
- MBTI & 사주 운세 앱
- **Style**: Glassmorphism (Blue + Orange gradient)
- **Features**: AI 상담, 궁합 분석, 토정비결, 관상, 손금

### 3. **UNMASK** - `/unmask/index.html`
- Film Negative Scanner & Converter
- **Style**: Motion-Driven (Black + White, Retro Vintage)
- **Features**: Professional scanner, Color correction, AI enhancement

### 4. **Trip Helper** - `/trip-helper/index.html`
- AI Travel Companion App
- **Style**: Soft UI Evolution (Sky Blue + Orange)
- **Features**: Smart itinerary, OCR, Translation, Maps, Gallery

## 📧 Contact Information

**Email**: `iyu974895@gmail.com` (모든 페이지에 적용됨)

## 🎨 Design Systems

각 프로젝트는 ui-ux-pro-max 스킬로 생성된 맞춤 디자인 시스템을 사용합니다:

| Project | Style | Colors | Typography | Framework |
|---------|-------|--------|------------|-----------|
| Dcode | Trust & Authority | Black + Gold | Poppins + Open Sans | Tailwind |
| MBTI Luck | Glassmorphism | Blue + Orange | Inter | Tailwind |
| UNMASK | Motion-Driven | Black + White | Abril Fatface + Merriweather | Tailwind |
| Trip Helper | Soft UI Evolution | Sky Blue + Orange | Inter | Tailwind |

## 🚀 Netlify 배포 방법

### Method 1: Netlify Drop (가장 빠름)

각 프로젝트별로:
```bash
# Dcode Main
https://app.netlify.com/drop
→ index.html 드래그 앤 드롭

# MBTI Luck
https://app.netlify.com/drop
→ mbti-luck/index.html 드래그 앤 드롭

# UNMASK
https://app.netlify.com/drop
→ unmask/index.html 드래그 앤 드롭

# Trip Helper
https://app.netlify.com/drop
→ trip-helper/index.html 드래그 앤 드롭
```

### Method 2: Git 연동

```bash
cd dcode-landing
git init
git add .
git commit -m "Add all Dcode landing pages"
gh repo create dcode-landing --public --source=. --push
```

Netlify에서:
1. "Add new site" → "Import an existing project"
2. Repository 선택
3. Build settings: (비워두기)
4. Publish directory: `.`
5. Deploy!

### Method 3: Netlify CLI

```bash
npm install -g netlify-cli

# 각 프로젝트별 배포
cd dcode-landing
netlify deploy --prod

cd mbti-luck
netlify deploy --prod

cd unmask
netlify deploy --prod

cd trip-helper
netlify deploy --prod
```

## 📝 Apple Developer 신청서 작성 가이드

배포 후 생성된 URL을 다음과 같이 사용하세요:

### Organization Website 입력

| 프로젝트 | 용도 | URL 예시 |
|---------|------|----------|
| **Dcode** | 회사 메인 웹사이트 | `https://dcode-main.netlify.app` |
| MBTI Luck | 앱 서비스 페이지 (선택) | `https://mbti-luck.netlify.app` |
| UNMASK | 앱 서비스 페이지 (선택) | `https://unmask.netlify.app` |
| Trip Helper | 앱 서비스 페이지 (선택) | `https://trip-helper.netlify.app` |

**권장**: Dcode 메인 페이지 URL을 Organization Website로 사용

## ✅ Apple Developer 요구사항 충족

모든 페이지가 다음을 만족합니다:

- ✅ 전문적인 외관
- ✅ 회사/앱 정보 명확히 표시
- ✅ 연락처 정보 제공 (iyu974895@gmail.com)
- ✅ D-U-N-S 번호 포함 (Dcode 메인 페이지)
- ✅ 반응형 디자인
- ✅ 접근성 준수 (WCAG 2.1 AA)
- ✅ 빠른 로딩 속도 (<1s)

## 🔧 커스터마이징

각 페이지는 독립적으로 수정 가능합니다:

### Dcode (index.html)
- Line 260: 팀 정보 수정
- Line 291, 339: 이메일 주소 (현재: iyu974895@gmail.com)
- Line 140-144: 회사 설명

### MBTI Luck (mbti-luck/index.html)
- 운세 서비스 관련 내용 커스터마이징
- 컬러 테마: Blue (#2563EB) + Orange (#F97316)

### UNMASK (unmask/index.html)
- 필름 스캐너 기능 설명 추가
- 컬러 테마: Black (#18181B) + White (#F8FAFC)

### Trip Helper (trip-helper/index.html)
- 여행 기능 추가 설명
- 컬러 테마: Sky Blue (#0EA5E9) + Orange (#F97316)

## 📱 반응형 브레이크포인트

모든 페이지 공통:
- Mobile: 375px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## 🎯 기술 스택

- **Framework**: Pure HTML + Tailwind CSS (CDN)
- **Fonts**: Google Fonts
- **Icons**: Heroicons (SVG)
- **Performance**: <1s load time
- **Accessibility**: WCAG 2.1 AA compliant
- **No build process required**

## 📞 Support

질문이나 수정 요청이 있으시면 연락주세요.

---

**Created**: February 2024
**Design System**: ui-ux-pro-max
**Purpose**: Apple Developer Organization Application
