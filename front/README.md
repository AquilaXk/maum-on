# 🌿 마음온 (Maum On) — Web Frontend

> **Next.js 16 (App Router) + React 19 + Tailwind CSS v4 기반의 마음온 공식 웹 프론트엔드 애플리케이션입니다.**

---

## 🛠️ 기술 스택 (Tech Stack)

- **Framework**: Next.js 16.1.7 (App Router)
- **Library**: React 19.2.3, React DOM 19.2.3
- **Styling**: Tailwind CSS v4, PostCSS
- **Language**: TypeScript 5
- **Icons & Animation**: Lucide React 1.0.1, Framer Motion 12.38.0
- **Toast Notifications**: react-hot-toast 2.6.0
- **Testing**: Vitest 4.1.1, React Testing Library
- **Code Quality**: ESLint 9 (`eslint-config-next` 16.1.7)

---

## 📂 디렉토리 구조 (Directory Structure)

```text
front/
├── public/                 # 정적 리소스 (아이콘, SVG, 로고)
├── src/
│   ├── app/                # Next.js App Router 페이지 및 API 라우트
│   │   ├── (auth)/         # 로그인, 회원가입, OIDC 간편 로그인 콜백
│   │   ├── dashboard/      # 월별 감정 일기 캘린더 대시보드
│   │   ├── diaries/        # 감정 일기 목록, 작성, 상세, 수정
│   │   ├── letters/        # 익명 마음 편지함 (수신함, 발신함, 편지 작성)
│   │   ├── stories/        # 사연 커뮤니티 (고민, 일상, 질문 피드 및 댓글)
│   │   ├── settings/       # 회원 프로필 관리, 랜덤 편지 수신 토글, 탈퇴
│   │   ├── admin/          # 관리자 회원, 편지, 신고 검수 대시보드
│   │   ├── layout.tsx      # 루트 레이아웃 (헤더, 네비게이션, 모달 프로바이더)
│   │   ├── page.tsx        # 홈 랜딩 페이지 (통계, 사연 미리보기, 퀵 액션)
│   │   └── globals.css     # Tailwind v4 전역 테마 및 스타일
│   ├── components/         # 재사용 가능한 UI 컴포넌트
│   │   ├── consultation/   # Gemini AI 1:1 상담 플로팅 런처 & 위기 핫라인 모달
│   │   ├── common/         # 헤더, 푸터, 버튼, 인풋, 카드 등 공통 컴포넌트
│   │   └── modal/          # 알림, 확인, 신고 팝업 모달
│   ├── lib/                # 공유 로직 및 헬퍼
│   │   ├── auth/           # 인증 스토어, 세션 복원, 토큰 갱신 로직
│   │   ├── api/            # 백엔드 REST API 클라이언트
│   │   └── utils/          # 날짜 포맷, 텍스트 변환 등 유틸리티
│   └── types/              # TypeScript 타입 및 인터페이스 정의
├── vitest.config.ts        # Vitest 테스트 설정
├── next.config.ts          # Next.js 빌드 및 리버스 프록시 설정
└── package.json
```

---

## 🔑 주요 아키텍처 및 기능 특징

### 1. SSR 무깜빡임(Flash-Free) 인증 하이드레이션
- `middleware.ts`에서 HttpOnly Cookie와 `auth_hint` 쿠키를 검사하여 비인증 사용자의 보호된 라우트 접근을 즉각 리다이렉트합니다.
- `AuthHintProvider`와 `AuthBootstrap`을 결합하여, 페이지 로드 시 클라이언트 깜빡임 없이 즉각적으로 인증 상태를 동기화하고 `/api/v1/auth/session`을 통해 안전하게 세션을 복원합니다.

### 2. 24시간 실시간 AI 상담 플로팅 런처 (`ConsultationLauncher`)
- 웹 화면 우측 하단에 상시 배치되어, 언제든 Google Gemini 기반 실시간 SSE 스트리밍 상담을 시작할 수 있습니다.
- 자해/위기 키워드 감지 시, 자살예방 상담전화(109) 등 긴급 핫라인 모달을 즉시 띄워 사용자의 안전을 우선시합니다.

### 3. 실시간 알림 (SSE) 연동
- 편지 수신, 답장 도착, 내 사연에 댓글 등록 등의 이벤트를 단기 티켓 기반 Server-Sent Events(SSE)로 실시간 수신하여 토스트 및 헤더 뱃지에 반영합니다.

### 4. 관리자 모니터링 프록시
- 관리자 권한을 가진 사용자에게 Next.js 리버스 프록시 라우트(`/grafana/[[...path]]`, `/prometheus/[[...path]]`)를 통해 그라파나 대시보드를 안전하게 임베딩 서빙합니다.

---

## 🚀 개발 및 실행 명령어

```bash
# 의존성 패키지 설치
npm install

# 로컬 개발 서버 실행 (기본 포트: 3000)
npm run dev

# 프로덕션 빌드 생성
npm run build

# 프로덕션 서버 실행
npm run start

# ESLint 코드 스타일 및 문법 검사
npm run lint

# Vitest 단위 테스트 실행
npm run test
```

---

## 🌐 환경 변수 설정

루트 `.env` 파일 또는 `front/.env.local` 파일에서 프론트엔드 환경변수를 설정할 수 있습니다:

```env
# 백엔드 API 베이스 URL (기본값: http://localhost:8080)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# 소셜 로그인 클라이언트 ID (Google, Kakao 등)
NEXT_PUBLIC_KAKAO_CLIENT_ID=your_kakao_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```
