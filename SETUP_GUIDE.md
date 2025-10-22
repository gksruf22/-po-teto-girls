# T-Chatbot 프로젝트 설정 가이드

## 🚀 프로젝트 개요

MBTI T 유형을 위한 공감 챗봇 웹 애플리케이션입니다. 홈화면, 로그인/회원가입, 채팅 기능을 제공합니다.

---

## 📋 필수 요구사항

### Backend
- Java 21
- PostgreSQL 14+
- Gradle
- Google Gemini API Key

### Frontend
- Node.js 18+
- npm

---

## 🗄️ 데이터베이스 설정

### 1. PostgreSQL 설치

#### macOS (Homebrew 사용)
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Windows
[PostgreSQL 공식 사이트](https://www.postgresql.org/download/)에서 설치

### 2. 데이터베이스 생성

```bash
# PostgreSQL 접속
psql postgres

# 데이터베이스 생성
CREATE DATABASE tchatbot_db;

# 사용자 생성 (선택사항)
CREATE USER tchatbot_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE tchatbot_db TO tchatbot_user;

# 종료
\q
```

---

## 🔧 Backend 설정

### 1. 환경 변수 설정

`.env` 파일 생성 또는 시스템 환경 변수 설정:

```bash
export GOOGLE_API_KEY="your_gemini_api_key_here"
```

### 2. application.properties 수정 (필요시)

`src/main/resources/application.properties`에서 DB 설정 변경:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tchatbot_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### 3. Backend 실행

```bash
cd t-chatbot-backend

# Gradle 빌드 및 실행
./gradlew bootRun
```

서버가 `http://localhost:8080`에서 실행됩니다.

---

## 💻 Frontend 설정

### 1. 의존성 설치

```bash
cd t-chatbot-frontend
npm install
```

### 2. Frontend 실행

```bash
npm run dev
```

서버가 `http://localhost:5173`에서 실행됩니다.

---

## 🎯 사용 방법

### 1. 홈페이지 접속
- `http://localhost:5173` 접속
- 홈화면에서 메시지 입력 후 Enter 또는 "시작하기" 버튼 클릭
- 자동으로 채팅 페이지로 이동

### 2. 회원가입/로그인
- 헤더의 "로그인" 버튼 클릭
- 회원가입 또는 로그인 진행
- JWT 토큰 기반 인증

### 3. 채팅
- 홈에서 직접 시작하거나 `/chat` 페이지로 이동
- AI와 대화 진행

---

## 📁 프로젝트 구조

### Backend
```
src/main/java/com/tchatbot/t_chatbot_backend/
├── config/          # CORS, Security 설정
├── controller/      # REST API 엔드포인트
├── dto/            # 데이터 전송 객체
├── entity/         # JPA 엔티티
├── repository/     # DB Repository
├── security/       # JWT, Security 설정
└── service/        # 비즈니스 로직
```

### Frontend
```
src/
├── components/     # 재사용 컴포넌트 (Header)
├── pages/          # 페이지 컴포넌트
│   ├── Home.tsx    # 홈화면
│   ├── Login.tsx   # 로그인/회원가입
│   └── Chat.tsx    # 채팅 페이지
└── App.tsx         # 라우터 설정
```

---

## 🔐 API 엔드포인트

### 인증 API
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인

### 채팅 API
- `POST /api/chat` - 메시지 전송 및 AI 응답 받기

---

## 🗃️ 데이터베이스 스키마

### users 테이블
- `id` (BIGINT, PK)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR)
- `username` (VARCHAR)
- `created_at` (TIMESTAMP)

### chat_history 테이블
- `id` (BIGINT, PK)
- `user_id` (BIGINT, FK)
- `user_message` (TEXT)
- `bot_response` (TEXT)
- `is_public` (BOOLEAN)
- `created_at` (TIMESTAMP)

---

## 🛠️ 트러블슈팅

### PostgreSQL 연결 오류
```bash
# PostgreSQL 실행 확인
brew services list  # macOS
# 또는
pg_isready
```

### 포트 충돌
- Backend: `application.properties`에서 `server.port` 변경
- Frontend: `vite.config.ts`에서 포트 변경

### Gemini API 오류
- 환경 변수 `GOOGLE_API_KEY` 설정 확인
- API 키 유효성 확인

---

## 📝 TODO

- [ ] 대화 저장 기능 구현
- [ ] 대화 공유 기능 구현
- [ ] 사용자 프로필 페이지
- [ ] 대화 히스토리 조회

---

## 👥 기여

EC 동아리 해커톤 프로젝트

## 📄 라이선스

MIT License
