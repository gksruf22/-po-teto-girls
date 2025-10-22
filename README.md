# T-Talk 🤖

MBTI T 유형을 위한 진짜 공감 AI 챗봇

## 🎯 프로젝트 소개

T-Talk은 MBTI T 유형(사고형)을 위해 설계된 AI 챗봇입니다. 감정적 위로보다는 논리적이고 직설적인 조언을 제공합니다.

### 주요 기능
- ✅ JWT 기반 회원가입/로그인
- ✅ Google Gemini 2.5 Flash API 연동
- ✅ T 유형 맞춤 대화 스타일
- ✅ 실시간 채팅 인터페이스
- ✅ Gemini 스타일 UI/UX

## 🛠 기술 스택

### Backend
- Java 21
- Spring Boot 3.5.6
- Spring Security + JWT
- H2 Database (임베디드)
- Google Gemini API

### Frontend
- React 19.1.1
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## 🚀 실행 방법

### 1. 사전 요구사항
- Java 21 이상
- Node.js 18 이상
- Google Gemini API Key ([여기서 발급](https://ai.google.dev/))

### 2. 백엔드 실행

```bash
cd t-chatbot-backend

# Gemini API 키와 함께 실행 (Mac/Linux)
GOOGLE_API_KEY=your_api_key_here ./gradlew bootRun

# Windows
set GOOGLE_API_KEY=your_api_key_here
gradlew.bat bootRun
```

서버가 http://localhost:8080 에서 실행됩니다.

### 3. 프론트엔드 실행

```bash
cd t-chatbot-frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:5173 으로 접속하세요.

## 📁 프로젝트 구조

```
hackerton/
├── t-chatbot-backend/      # Spring Boot 백엔드
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/tchatbot/
│   │       │       ├── controller/    # API 엔드포인트
│   │       │       ├── service/       # 비즈니스 로직
│   │       │       ├── entity/        # JPA 엔티티
│   │       │       ├── repository/    # DB 레포지토리
│   │       │       ├── security/      # JWT 보안
│   │       │       └── dto/           # 데이터 전송 객체
│   │       └── resources/
│   │           └── application.properties
│   └── data/                # H2 데이터베이스 파일 (자동 생성)
│
└── t-chatbot-frontend/     # React 프론트엔드
    ├── src/
    │   ├── components/     # 재사용 컴포넌트
    │   ├── pages/          # 페이지 컴포넌트
    │   └── context/        # Context API (인증)
    └── public/
```

## 🔑 API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인

### 채팅
- `POST /api/chat` - 메시지 전송 및 AI 응답

## 💾 데이터베이스

H2 임베디드 데이터베이스를 사용합니다.
- DB 파일 위치: `t-chatbot-backend/data/tchatbot.mv.db`
- 서버 실행 시 자동으로 생성됩니다
- Git에는 포함되지 않습니다 (.gitignore 처리됨)

### H2 Console 접속 (디버깅용)
http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:file:./data/tchatbot`
- Username: `sa`
- Password: (빈칸)

## 🎨 주요 화면

1. **홈 화면**: 개인화된 인사말과 채팅 시작
2. **로그인/회원가입**: JWT 기반 인증
3. **채팅 화면**: Gemini 스타일 실시간 대화

## ⚠️ 주의사항

- `.gitignore`에 `data/` 폴더가 포함되어 있어 데이터베이스 파일은 Git에 업로드되지 않습니다
- 프로젝트를 클론한 후 처음 실행하면 DB가 자동으로 생성됩니다
- Gemini API 키는 환경변수로 전달해야 합니다 (보안상 코드에 직접 포함 금지)

## 📝 라이선스

이 프로젝트는 해커톤 참가작입니다.

## 👥 개발자

- 서울과학기술대학교 EC 동아리
