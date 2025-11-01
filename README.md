# T-Chatbot 🤖

> AI 기반 전공 학습 지원 챗봇 플랫폼

T-Chatbot은 Google Gemini AI를 활용하여 학생들의 전공 학습을 돕는 인터랙티브 챗봇 서비스입니다. 개인화된 대화 세션과 커뮤니티 공유 기능을 제공합니다.

## ✨ 주요 기능

### 🎯 AI 챗봇
- **Google Gemini API** 기반 지능형 대화
- **대화 세션 관리**: 여러 대화 세션을 생성하고 관리
- **히스토리 저장**: 모든 대화 내용 자동 저장 및 로드

### 👥 커뮤니티
- **대화 공유**: 유용한 대화를 커뮤니티에 공유
- **좋아요 & 댓글**: 다른 사용자와 상호작용
- **실시간 업데이트**: 최신 공유 대화 확인

### 🔐 사용자 인증
- **회원가입/로그인**: 안전한 세션 기반 인증
- **비밀번호 암호화**: BCrypt를 사용한 보안 강화

## 🛠 기술 스택

### Backend
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 21
- **Build Tool**: Gradle 8.14.3
- **Database**: PostgreSQL (Production), H2 (Development)
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + BCrypt
- **AI Integration**: Google Gemini API (google-genai:1.0.0)
- **Authentication**: Session-based with JWT support

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS Modules

### Deployment
- **Backend**: Railway / Render
- **Frontend**: Vercel
- **Database**: Supabase (PostgreSQL)

## 📁 프로젝트 구조

```
hackerthon/
├── t-chatbot-backend/          # Spring Boot 백엔드
│   ├── src/
│   │   └── main/
│   │       ├── java/com/tchatbot/
│   │       │   ├── config/     # 설정 (CORS, 보안)
│   │       │   ├── controller/ # REST API 컨트롤러
│   │       │   ├── service/    # 비즈니스 로직
│   │       │   ├── repository/ # 데이터 접근 계층
│   │       │   ├── entity/     # JPA 엔티티
│   │       │   └── dto/        # 데이터 전송 객체
│   │       └── resources/
│   │           ├── application.properties
│   │           └── application-prod.properties
│   ├── .env.example
│   ├── Procfile
│   ├── railway.json
│   └── render.yaml
│
├── t-chatbot-frontend/         # React 프론트엔드
│   ├── src/
│   │   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── pages/              # 페이지 컴포넌트
│   │   ├── context/            # Context API (인증)
│   │   ├── config/             # API 설정
│   │   └── styles/             # CSS 스타일
│   ├── .env.development
│   ├── .env.production
│   └── .env.example
│
├── DEPLOYMENT.md               # 배포 가이드
└── README.md
```

## 🚀 시작하기

### 사전 요구사항
- Java 21
- Node.js 18+
- PostgreSQL (선택사항, H2로 개발 가능)
- Google Gemini API Key

### 1. 백엔드 설정

```bash
cd t-chatbot-backend

# 환경 변수 설정
cp .env.example .env
# .env 파일에 Google Gemini API 키 입력

# 빌드 및 실행
./gradlew bootRun
```

**기본 개발 환경**: H2 인메모리 데이터베이스 (자동 설정)

### 2. 프론트엔드 설정

```bash
cd t-chatbot-frontend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.development
# VITE_API_URL=http://localhost:8080

# 개발 서버 실행
npm run dev
```

### 3. 접속

- **프론트엔드**: http://localhost:5173
- **백엔드 API**: http://localhost:8080

## 🔑 환경 변수

### Backend (.env)

```env
# Server
PORT=8080

# Database (개발 시 H2 자동 사용)
DATABASE_URL=jdbc:postgresql://localhost:5432/tchatbot
DB_DRIVER=org.postgresql.Driver
DB_USERNAME=postgres
DB_PASSWORD=password

# Google Gemini API
GOOGLE_API_KEY=your-api-key-here

# JWT (선택사항)
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8080
```

## 📡 API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/check` - 인증 상태 확인

### 채팅
- `GET /api/chat/sessions` - 세션 목록 조회
- `POST /api/chat/sessions` - 새 세션 생성
- `GET /api/chat/{sessionId}/messages` - 메시지 조회
- `POST /api/chat/{sessionId}/message` - 메시지 전송
- `DELETE /api/chat/sessions/{sessionId}` - 세션 삭제

### 커뮤니티
- `POST /api/community/share` - 대화 공유
- `GET /api/community/shares` - 공유 목록 조회
- `POST /api/community/shares/{shareId}/like` - 좋아요
- `POST /api/community/shares/{shareId}/comments` - 댓글 작성
- `GET /api/community/shares/{shareId}/comments` - 댓글 조회

## 🌐 배포

상세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

### 배포 플랫폼
1. **Supabase**: PostgreSQL 데이터베이스
2. **Railway/Render**: Spring Boot 백엔드
3. **Vercel**: React 프론트엔드

## 🏗 아키텍처

### 백엔드 계층 구조
```
Controller → Service → Repository → Entity
           ↓
         DTO (Data Transfer Object)
```

### 프론트엔드 구조
```
Pages → Context (Auth) → API Config → Backend
     ↓
Components
```

## 🔒 보안

- **비밀번호 암호화**: BCrypt 해싱
- **세션 관리**: Spring Security 기반
- **CORS 설정**: 허용된 도메인만 접근 가능
- **환경 변수**: 민감한 정보 분리 관리

## 📝 라이선스

이 프로젝트는 학습 목적으로 개발되었습니다.

## 👥 개발팀

Seoul National University of Science and Technology - EC Club Hackathon Project

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 Issue를 등록해주세요.

---

**Made by 🥔(po)teto-girls🥔**
