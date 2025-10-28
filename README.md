# T-Talk 🤖

> MBTI T 유형을 위한 진짜 공감 AI 챗봇  
> "위로 대신 조언, 공감 대신 해결책"

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-21-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)
![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)

</div>

---

## 📖 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [실행 방법](#-실행-방법)
- [프로젝트 구조](#-프로젝트-구조)
- [API 명세](#-api-명세)
- [데이터베이스](#-데이터베이스)
- [주요 화면](#-주요-화면)
- [개발 과정](#-개발-과정)
- [트러블슈팅](#-트러블슈팅)
- [향후 계획](#-향후-계획)
- [라이선스](#-라이선스)

---

## 🎯 프로젝트 소개

**T-Talk**은 MBTI T 유형(사고형)을 위한 AI 챗봇입니다. 

### 기획 배경

기존 AI 챗봇들은 "괜찮아요", "힘내세요" 같은 감정적 위로에 치중되어 있습니다.  
하지만 T 유형 사람들은 이런 위로보다는 **논리적 분석**과 **실질적 조언**을 선호합니다.

T-Talk은 다음과 같은 대화 스타일을 제공합니다:
- ❌ "그랬구나, 힘들었겠다" → ✅ "그게 문제면 이렇게 해봐"
- ❌ "많이 속상하셨겠어요" → ✅ "냉정하게 생각해보면 이건 네 잘못이 아니야"
- ❌ "항상 응원할게요" → ✅ "시간 낭비 말고 당장 실행해"
- ❌ "시험 망쳐서 속상하겠다" → ✅ "니가 열심히 공부했었어야지"


### 핵심 가치

1. **직설적 소통**: 감정 포장 없이 핵심만 전달
2. **논리적 분석**: 상황을 객관적으로 분석
3. **실질적 조언**: 구체적이고 실행 가능한 해결책 제시
4. **T 유형 친화**: 디시인사이드 말투로 친근하게

---

## ✨ 주요 기능

### 1. 🔐 Session 기반 인증
- 회원가입 및 로그인 (이메일 기반)
- HttpSession을 통한 상태 관리
- BCrypt 비밀번호 암호화
- 자동 로그인 유지 (세션 쿠키)
- 로그아웃 시 세션 즉시 무효화

### 2. 🤖 AI 채팅
- Google Gemini 2.5 Flash API 연동
- T 유형 특화 프롬프트 엔지니어링
- 실시간 응답
- 대화 히스토리 저장
- 이전 대화 기억

### 3. 💬 커뮤니티 (공유 게시판)
- 대화 내용 공유 기능
- 최신순/인기순 필터링
- 좋아요 토글 (한 사용자당 1회)
- 댓글 시스템
- 해시태그 지원

### 4. 🎨 사용자 경험
- Gemini 스타일 다크 테마 UI
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 로딩 애니메이션
- 에러 핸들링 및 사용자 피드백
- 페이지 새로고침 시에도 로그인 상태 유지

---

## 🛠 기술 스택

### Backend

| 기술 | 버전 | 용도 |
|------|------|------|
| **Java** | 21 (LTS) | 메인 언어 |
| **Spring Boot** | 3.5.6 | 백엔드 프레임워크 |
| **Spring Security** | 6.x | 인증/인가 (Session 방식) |
| **Spring Data JPA** | 3.x | ORM, 데이터베이스 접근 |
| **H2 Database** | 2.x | 임베디드 데이터베이스 |
| **Lombok** | 1.18.x | 보일러플레이트 코드 제거 |
| **Google Gemini API** | 1.0.0 | AI 대화 생성 |
| **Gradle** | 8.14.3 | 빌드 도구 |

### Frontend

| 기술 | 버전 | 용도 |
|------|------|------|
| **React** | 19.1.1 | UI 라이브러리 |
| **TypeScript** | 5.9.3 | 타입 안정성 |
| **Vite** | 7.1.7 | 빌드 도구 (빠른 HMR) |
| **Tailwind CSS** | 3.4.18 | 스타일링 |
| **React Router** | 7.9.4 | 클라이언트 라우팅 |
| **Axios** | 1.12.2 | HTTP 클라이언트 |

### DevOps & Tools

- **Git** - 버전 관리
- **VS Code** - 개발 환경
- **Postman** - API 테스트
- **H2 Console** - 데이터베이스 관리

---

## 🏗 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                      웹 브라우저 (Client)                          │
│                    http://localhost:5173                        │
│  ┌──────────────┬──────────────┬─────────────┐                 │
│  │   Home.tsx   │  Login.tsx   │  Chat.tsx   │                 │
│  └──────┬───────┴──────┬───────┴─────┬───────┘                 │
│         └──────────────┴─────────────┘                          │
│                        │                                         │
│              ┌─────────▼─────────┐                              │
│              │  AuthContext.tsx  │ (전역 인증 상태)              │
│              └───────────────────┘                              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS + Session Cookie (JSESSIONID)
                     │ Axios (withCredentials: true)
                     │
┌────────────────────▼────────────────────────────────────────────┐
│              Spring Boot Backend (Port 8080)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Spring Security (Session)                    │  │
│  │  • SessionCreationPolicy.IF_REQUIRED                     │  │
│  │  • maximumSessions(1)                                    │  │
│  │  • BCryptPasswordEncoder                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│  ┌─────────────────────────▼──────────────────────────────┐   │
│  │                   REST Controllers                       │   │
│  │  ┌──────────────────┬──────────────────┬──────────────┐│   │
│  │  │ AuthController   │  ChatController  │CommunityCtrl ││   │
│  │  │ • /api/auth/*    │  • /api/chat     │• /api/comm/* ││   │
│  │  └────────┬─────────┴─────────┬────────┴──────┬───────┘│   │
│  └───────────│───────────────────│───────────────│────────┘   │
│              │                   │               │             │
│  ┌───────────▼─────────┬─────────▼──────┬────────▼────────┐   │
│  │    AuthService      │  ChatService   │CommunityService │   │
│  │  • User 인증/등록   │  • Gemini API  │• 게시글/댓글/좋아요│   │
│  └─────────┬───────────┴──────────┬─────┴─────────┬───────┘   │
│            │                      │               │            │
│  ┌─────────▼──────────┐  ┌────────▼────────┐ ┌───▼──────┐    │
│  │  UserRepository    │  │  Gemini 2.5     │ │SharedChat│    │
│  │  (Spring Data JPA) │  │  Flash API      │ │Repository│    │
│  │                    │  │  Client         │ │Comment   │    │
│  │                    │  │                 │ │ChatLike  │    │
│  └─────────┬──────────┘  └─────────────────┘ └────┬─────┘    │
└────────────┼──────────────────────────────────────┼──────────┘
             │                                      │
             │ JPA/Hibernate (자동 DDL)             │
             │                                      │
┌────────────▼──────────────────────────────────────▼──────────┐
│              H2 Database (file:./data/tchatbot)              │
│  ┌──────────────┬────────────────┬──────────────┬──────────┐ │
│  │  users       │  chat_history  │ shared_chats │ comments │ │
│  │  • id (PK)   │  • id (PK)     │  • id (PK)   │• id (PK) │ │
│  │  • email     │  • user_id (FK)│  • user_id   │• content │ │
│  │  • password  │  • user_msg    │  • title     │• user_id │ │
│  │  • username  │  • bot_resp    │  • tags      │          │ │
│  │  • created_at│  • created_at  │  • likes     │          │ │
│  │              │                │  • created_at│          │ │
│  └──────────────┴────────────────┴──────────────┴──────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  chat_likes (좋아요 중복 방지)                            │ │
│  │  • id (PK)                                               │ │
│  │  • shared_chat_id (FK)                                   │ │
│  │  • user_id                                               │ │
│  │  • UNIQUE(shared_chat_id, user_id)  ← 1인당 1좋아요     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 인증 플로우 (Session 방식)

```
1. 로그인 요청
   User → POST /api/auth/login → AuthController
   → AuthService.login()
   → UserRepository.findByEmail()
   → 비밀번호 검증 (BCrypt)
   → HttpSession.setAttribute("email", email)
   → JSESSIONID 쿠키 생성 및 반환

2. 인증이 필요한 API 요청
   User → POST /api/chat (with JSESSIONID cookie)
   → Spring Security 세션 검증
   → ChatController.handleChatMessage()
   → session.getAttribute("email") 확인
   → 인증 성공 → ChatService 호출

3. 로그아웃
   User → POST /api/auth/logout
   → HttpSession.invalidate()
   → 세션 즉시 무효화
```

---

## 🚀 실행 방법

### 📋 사전 요구사항

- **Java 21 이상** ([다운로드](https://adoptium.net/))
- **Node.js 18 이상** ([다운로드](https://nodejs.org/))
- **Google Gemini API Key** ([발급받기](https://ai.google.dev/))

### 1️⃣ 저장소 클론

```bash
git clone https://github.com/gksruf22/-po-teto-mans.git
cd -po-teto-mans
```

### 2️⃣ 백엔드 실행

#### VS Code에서 실행

1. `t-chatbot-backend` 폴더를 VS Code로 열기
2. `.vscode/launch.json` 파일에서 API 키가 설정하기
3. F5 키를 눌러 디버그 모드로 실행

#### 터미널에서 실행

```bash
cd t-chatbot-backend

# Mac/Linux
export GOOGLE_API_KEY=your_api_key_here
./gradlew bootRun

# Windows (cmd)
set GOOGLE_API_KEY=your_api_key_here
gradlew.bat bootRun

# Windows (PowerShell)
$env:GOOGLE_API_KEY="your_api_key_here"
./gradlew.bat bootRun
```

✅ 서버가 **http://localhost:8080** 에서 실행됩니다.

#### 백엔드 정상 동작 확인

```bash
# Health Check
curl http://localhost:8080/api/auth/check

# 응답: 401 Unauthorized (세션 없음) → 정상
```

### 3️⃣ 프론트엔드 실행

```bash
cd t-chatbot-frontend

# 의존성 설치 (최초 1회만)
npm install

# 개발 서버 실행
npm run dev
```

✅ 브라우저에서 **http://localhost:5173** 으로 접속하세요.

### 4️⃣ 사용 방법

1. **회원가입**: 우측 상단 "로그인" → "회원가입" 탭에서 계정 생성
2. **로그인**: 이메일과 비밀번호로 로그인
3. **채팅 시작**: 홈 화면에서 메시지 입력 후 Enter 또는 채팅 페이지로 이동
4. **AI와 대화**: T 유형 특화 AI가 직설적인 조언 제공

---

## 📁 프로젝트 구조

---

## 📁 프로젝트 구조

### Backend (Spring Boot)

```
t-chatbot-backend/
├── src/main/
│   ├── java/com/tchatbot/t_chatbot_backend/
│   │   ├── TChatbotBackendApplication.java    # 메인 애플리케이션
│   │   │
│   │   ├── config/
│   │   │   └── WebConfig.java                 # CORS 설정
│   │   │
│   │   ├── controller/
│   │   │   ├── AuthController.java            # 인증 API
│   │   │   │   ├── POST /api/auth/signup     # 회원가입
│   │   │   │   ├── POST /api/auth/login      # 로그인
│   │   │   │   ├── POST /api/auth/logout     # 로그아웃
│   │   │   │   └── GET  /api/auth/check      # 세션 체크
│   │   │   │
│   │   │   ├── ChatController.java            # 채팅 API
│   │   │   │   └── POST /api/chat             # 메시지 전송
│   │   │   │
│   │   │   └── CommunityController.java       # 커뮤니티 API
│   │   │       ├── POST /api/community/share  # 대화 공유
│   │   │       ├── GET  /api/community        # 최신순 조회
│   │   │       ├── GET  /api/community/popular # 인기순 조회
│   │   │       ├── GET  /api/community/my     # 내 공유 조회
│   │   │       ├── POST /api/community/{id}/like # 좋아요 토글
│   │   │       ├── POST /api/community/{id}/comments # 댓글 작성
│   │   │       ├── GET  /api/community/{id}/comments # 댓글 조회
│   │   │       └── DELETE /api/community/comments/{id} # 댓글 삭제
│   │   │
│   │   ├── service/
│   │   │   ├── AuthService.java               # 인증 비즈니스 로직
│   │   │   ├── ChatService.java               # Gemini API 통신
│   │   │   └── CommunityService.java          # 커뮤니티 로직
│   │   │
│   │   ├── entity/
│   │   │   ├── User.java                      # 사용자 엔티티
│   │   │   ├── ChatHistory.java               # 채팅 히스토리 엔티티
│   │   │   ├── SharedChat.java                # 공유 게시글 엔티티
│   │   │   ├── Comment.java                   # 댓글 엔티티
│   │   │   └── ChatLike.java                  # 좋아요 엔티티
│   │   │
│   │   ├── repository/
│   │   │   ├── UserRepository.java            # User DB 접근
│   │   │   ├── ChatHistoryRepository.java     # ChatHistory DB 접근
│   │   │   ├── SharedChatRepository.java      # SharedChat DB 접근
│   │   │   ├── CommentRepository.java         # Comment DB 접근
│   │   │   └── ChatLikeRepository.java        # ChatLike DB 접근
│   │   │
│   │   ├── dto/
│   │   │   ├── AuthResponse.java              # 인증 응답 DTO
│   │   │   ├── ChatMessage.java               # 채팅 메시지 DTO
│   │   │   ├── LoginRequest.java              # 로그인 요청 DTO
│   │   │   ├── SignUpRequest.java             # 회원가입 요청 DTO
│   │   │   ├── ShareChatRequest.java          # 대화 공유 요
│   │   │   ├── SharedChatResponse.java        # 공유 게시글 응답 DTO
│   │   │   ├── CommentRequest.java            # 댓글 요청 DTO
│   │   │   └── CommentResponse.java           # 댓글 응답 DTO
│   │   │
│   │   └── security/
│   │       └── SecurityConfig.java            # Spring Security 설정청 DTO
│   │
│   └── resources/
│       └── application.properties             # 애플리케이션 설정
│
├── data/                                      # H2 데이터베이스 파일
│   └── tchatbot.mv.db                         # (자동 생성)
│
├── build.gradle                               # Gradle 빌드 설정
└── .vscode/launch.json                        # VS Code 디버그 설정
```

### Frontend (React + TypeScript)

```
t-chatbot-frontend/
├── src/
│   ├── main.tsx                               # 엔트리 포인트
│   ├── App.tsx                                # 라우터 설정
│   │
│   ├── pages/
│   │   ├── Home.tsx                           # 홈 화면
│   │   │   └── "T-Talk에게 물어보기" 입력창
│   │   │
│   │   ├── Login.tsx                          # 로그인/회원가입
│   │   │   ├── 탭 전환 (로그인 ↔ 회원가입)
│   │   │   └── Form 제출 → AuthContext 업데이트
│   │   │
│   │   ├── Chat.tsx                           # 채팅 화면
│   │   │   ├── 메시지 목록 렌더링
│   │   │   ├── 로딩 애니메이션
│   │   │   ├── 메시지 전송 → Gemini AI 응답
│   │   │   └── 대화 공유 버튼 (모달)
│   │   │
│   │   └── Community.tsx                      # 커뮤니티 화면
│   │       ├── 최신순/인기순 필터
│   │       ├── 게시글 카드 (제목, 태그, 좋아요, 댓글 수)
│   │       ├── 상세 모달 (대화 내용, 댓글)
│   │       ├── 좋아요 토글 (빈하트 ♡ ↔ 빨간하트 ♥)
│   │       └── 댓글 작성/삭제
│   │
│   ├── components/
│   │   └── Header.tsx                         # 공통 헤더
│   │       ├── 로고 및 네비게이션
│   │       └── 로그인/로그아웃 버튼
│   │
│   ├── context/
│   │   └── AuthContext.tsx                    # 전역 인증 상태
│   │       ├── login(), logout()
│   │       ├── checkSession() → 세션 유효성 확인
│   │       └── username, email, isLoggedIn
│   │
│   └── assets/                                # 정적 파일
│
├── public/                                    # 퍼블릭 파일
├── package.json                               # npm 의존성
├── vite.config.ts                             # Vite 설정
├── tailwind.config.js                         # Tailwind CSS 설정
└── tsconfig.json                              # TypeScript 설정
```

---

## 🔑 API 명세

### 인증 API

#### 1. 회원가입
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "사용자이름"
}
```

**응답 (200 OK)**
```json
{
  "token": null,
  "username": "사용자이름",
  "email": "user@example.com"
}
```

**에러 (400 Bad Request)**
```json
{
  "message": "이미 사용 중인 이메일입니다."
}
```

---

#### 2. 로그인
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답 (200 OK)**
```json
{
  "token": null,
  "username": "사용자이름",
  "email": "user@example.com"
}
```
- **Set-Cookie 헤더**에 `JSESSIONID` 포함

**에러 (401 Unauthorized)**
```json
{
  "message": "이메일 또는 비밀번호가 올바르지 않습니다."
}
```

---

#### 3. 로그아웃
```http
POST /api/auth/logout
Cookie: JSESSIONID=xxx
```

**응답 (200 OK)**
```json
{
  "message": "로그아웃되었습니다."
}
```

---

#### 4. 세션 체크
```http
GET /api/auth/check
Cookie: JSESSIONID=xxx
```

**응답 (200 OK)**
```json
{
  "username": "사용자이름",
  "email": "user@example.com"
}
```

**에러 (401 Unauthorized)**
```json
{
  "message": "로그인이 필요합니다."
}
```

---

### 채팅 API

#### 메시지 전송
```http
POST /api/chat
Content-Type: application/json
Cookie: JSESSIONID=xxx

{
  "message": "오늘 너무 우울해"
}
```

**응답 (200 OK)**
```json
{
  "message": "뭐 때문에 우울한데? 구체적으로 말해봐"
}
```

**에러 (401 Unauthorized)**
```json
{
  "message": "로그인이 필요합니다."
}
```

---

### 커뮤니티 API

#### 1. 대화 공유
```http
POST /api/community/share
Content-Type: application/json
Cookie: JSESSIONID=xxx

{
  "title": "오늘 있었던 일",
  "tags": "#고민 #조언",
  "userMessage": "오늘 너무 우울해",
  "botResponse": "뭐 때문에 우울한데? 구체적으로 말해봐"
}
```

**응답 (200 OK)**
```json
{
  "id": 1,
  "userId": "user@example.com",
  "username": "사용자이름",
  "title": "오늘 있었던 일",
  "tags": "#고민 #조언",
  "userMessage": "오늘 너무 우울해",
  "botResponse": "뭐 때문에 우울한데? 구체적으로 말해봐",
  "likes": 0,
  "commentCount": 0,
  "isLikedByCurrentUser": false,
  "createdAt": "2025-01-29T10:30:00"
}
```

---

#### 2. 게시글 조회 (최신순)
```http
GET /api/community
Cookie: JSESSIONID=xxx
```

**응답 (200 OK)**
```json
[
  {
    "id": 1,
    "username": "사용자1",
    "title": "오늘 있었던 일",
    "tags": "#고민 #조언",
    "likes": 5,
    "commentCount": 3,
    "isLikedByCurrentUser": true,
    "createdAt": "2025-01-29T10:30:00"
  }
]
```

---

#### 3. 게시글 조회 (인기순)
```http
GET /api/community/popular
Cookie: JSESSIONID=xxx
```

**응답**: 최신순과 동일 (좋아요 많은 순으로 정렬)

---

#### 4. 내가 공유한 게시글 조회
```http
GET /api/community/my
Cookie: JSESSIONID=xxx
```

**응답**: 최신순과 동일 (본인이 작성한 게시글만)

---

#### 5. 좋아요 토글
```http
POST /api/community/{id}/like
Cookie: JSESSIONID=xxx
```

**응답 (200 OK)**
```json
{
  "id": 1,
  "likes": 6,
  "isLikedByCurrentUser": true
}
```

> **중요**: 같은 사용자가 다시 좋아요를 누르면 취소됩니다 (토글 방식)

---

#### 6. 댓글 작성
```http
POST /api/community/{id}/comments
Content-Type: application/json
Cookie: JSESSIONID=xxx

{
  "content": "좋은 조언이네요!"
}
```

**응답 (200 OK)**
```json
{
  "id": 1,
  "sharedChatId": 1,
  "userId": "user@example.com",
  "username": "사용자이름",
  "content": "좋은 조언이네요!",
  "createdAt": "2025-01-29T10:35:00"
}
```

---

#### 7. 댓글 조회
```http
GET /api/community/{id}/comments
```

**응답 (200 OK)**
```json
[
  {
    "id": 1,
    "username": "사용자이름",
    "content": "좋은 조언이네요!",
    "createdAt": "2025-01-29T10:35:00"
  }
]
```

---

#### 8. 댓글 삭제
```http
DELETE /api/community/comments/{commentId}
Cookie: JSESSIONID=xxx
```

**응답 (200 OK)**
```json
{
  "message": "댓글이 삭제되었습니다."
}
```

**에러 (403 Forbidden)**
```json
{
  "message": "댓글 삭제 권한이 없습니다."
}
```

---

## 💾 데이터베이스

### 사용 기술
- **H2 Database** (Embedded, File-based)
- 위치: `t-chatbot-backend/data/tchatbot.mv.db`
- 자동 생성: 첫 실행 시 자동으로 생성됨
- Git 제외: `.gitignore`에 포함

### 스키마

#### users 테이블
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- BCrypt 암호화
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### chat_history 테이블
```sql
CREATE TABLE chat_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### shared_chats 테이블 (커뮤니티 게시글)
```sql
CREATE TABLE shared_chats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    tags VARCHAR(500),
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### comments 테이블
```sql
CREATE TABLE comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    shared_chat_id BIGINT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shared_chat_id) REFERENCES shared_chats(id)
);
```

#### chat_likes 테이블 (좋아요 중복 방지)
```sql
CREATE TABLE chat_likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    shared_chat_id BIGINT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shared_chat_id) REFERENCES shared_chats(id),
    UNIQUE KEY unique_like (shared_chat_id, user_id)  -- 1인당 1좋아요
);
```

> **핵심 기능**: `chat_likes` 테이블의 UNIQUE 제약조건으로 한 사용자가 같은 게시글에 여러 번 좋아요를 누를 수 없습니다.

### H2 Console 접속 (디버깅용)

1. 백엔드 서버 실행 후
2. http://localhost:8080/h2-console 접속
3. 다음 정보로 로그인:
   - **JDBC URL**: `jdbc:h2:file:./data/tchatbot`
   - **Username**: `sa`
   - **Password**: (빈칸)

---

## 🎨 주요 화면

### 1. 홈 화면 (/)
<div align="center">
<img src="https://via.placeholder.com/800x500?text=Home+Screen" alt="홈 화면" width="600"/>
</div>

- **인사말**: 로그인 여부에 따라 동적 표시
  - 비로그인: "안녕하세요, T-Talk입니다"
  - 로그인: "{username}님, 무엇이 궁금하신가요?"
- **메시지 입력**: 바로 채팅 시작 가능
- **다크 테마**: Gemini 스타일 UI

### 2. 로그인/회원가입 화면 (/login)
<div align="center">
<img src="https://via.placeholder.com/800x500?text=Login+Screen" alt="로그인 화면" width="600"/>
</div>

- **탭 전환**: 로그인 ↔ 회원가입
- **폼 검증**: 이메일 형식, 비밀번호 길이 체크
- **에러 메시지**: 실패 시 이유 표시

### 3. 채팅 화면 (/chat)
<div align="center">
<img src="https://via.placeholder.com/800x500?text=Chat+Screen" alt="채팅 화면" width="600"/>
</div>

- **메시지 구분**: 사용자(우측) vs AI(좌측)
- **T-Talk 아바타**: 그라데이션 원형 아이콘
- **로딩 애니메이션**: 3개의 점이 바운스
- **스크롤 자동**: 새 메시지 시 하단으로 이동
- **공유하기 버튼**: 대화 내용을 커뮤니티에 공유

### 4. 커뮤니티 화면 (/community)
<div align="center">
<img src="https://via.placeholder.com/800x500?text=Community+Screen" alt="커뮤니티 화면" width="600"/>
</div>

- **필터링**: 최신순 / 인기순 (좋아요 많은 순)
- **게시글 카드**: 제목, 태그, 좋아요 수, 댓글 수 표시
- **좋아요 토글**:
  - 비활성화: 빈 하트 ♡ (흰색 테두리)
  - 활성화: 빨간 하트 ♥ (채워진 빨간색)
  - 클릭 시 즉시 토글 (1인당 1좋아요)
- **상세 모달**: 클릭 시 전체 대화 내용 + 댓글 표시
- **댓글 시스템**: 작성, 조회, 삭제 (작성자만)
- **해시태그**: #으로 시작하는 단어는 파란색으로 강조

---

## 💡 개발 과정

### 주요 의사결정

#### 1. JWT → Session 인증 방식 변경
**이유:**
- 해커톤 시간 제약: Session이 구현이 더 빠름
- Spring Security 기본 지원: HttpSession 자동 관리
- 로그아웃 처리 간편: `session.invalidate()` 한 줄로 해결

**변경 전 (JWT)**
```java
// JWT 토큰 생성
String token = jwtTokenProvider.createToken(user.getEmail());

// 프론트엔드에서 localStorage 저장
localStorage.setItem('token', token);

// 매 요청마다 헤더에 토큰 첨부
headers: { Authorization: `Bearer ${token}` }
```

**변경 후 (Session)**
```java
// 세션에 사용자 정보 저장
session.setAttribute("email", user.getEmail());
session.setAttribute("username", user.getUsername());

// 프론트엔드는 withCredentials만 설정
axios.post(url, data, { withCredentials: true });
```

#### 2. H2 Database 선택
**이유:**
- ✅ 설치 불필요: JAR에 포함
- ✅ 빠른 시작: 별도 DB 서버 설정 불필요
- ✅ 해커톤 적합: 인프라 구축 시간 제로

#### 3. Gemini API 선택 (vs ChatGPT)
**이유:**
- ✅ 무료 할당량: 더 많은 무료 사용량
- ✅ 빠른 응답: Flash 모델은 1-2초 응답
- ✅ 최신 기술: 2025년 기준 최신 모델

---

## 🔧 트러블슈팅

### 1. CORS Preflight 403 에러

**문제:**
```
Preflight response is not successful. Status code: 403
```

**원인:**
- Spring Security가 OPTIONS 요청을 차단
- Session 방식으로 변경 후 CORS 설정 누락

**해결:**
```java
// SecurityConfig.java
.cors(cors -> {})  // CORS 활성화
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/**").permitAll()  // 임시로 모든 API 허용
)
```

### 2. 세션 쿠키 전송 안 됨

**문제:**
```
Network Error - 세션 쿠키가 전송되지 않음
```

**원인:**
- axios 요청에 `withCredentials: true` 누락
- CORS 설정에서 `allowCredentials(true)` 누락

**해결:**
```typescript
// Frontend (Axios)
axios.post(url, data, {
  withCredentials: true  // 쿠키 자동 전송
});
```

```java
// Backend (WebConfig)
.allowCredentials(true)  // 쿠키 허용
```

### 3. Gemini API "Network Error"

**문제:**
```
AI 모델 응답 생성에 실패했습니다
```

**원인:**
- `GOOGLE_API_KEY` 환경변수 미설정

**해결:**
```bash
# VS Code launch.json에 API 키 추가
"env": {
  "GOOGLE_API_KEY": "your_api_key_here"
}
```

### 4. 좋아요 중복 방지 (UNIQUE 제약조건)

**문제:**
```
한 사용자가 같은 게시글에 여러 번 좋아요 가능
```

**원인:**
- 데이터베이스에 중복 방지 로직 없음

**해결:**
```java
// ChatLike.java - Entity 레벨에서 UNIQUE 제약조건
@Table(name = "chat_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"shared_chat_id", "user_id"})
})

// CommunityService.java - 토글 로직
if (existingLike.isPresent()) {
    // 이미 좋아요 누름 → 취소
    chatLikeRepository.delete(existingLike.get());
    sharedChat.decrementLikes();
} else {
    // 좋아요 추가
    ChatLike newLike = new ChatLike(chatId, userId);
    chatLikeRepository.save(newLike);
    sharedChat.incrementLikes();
}
```

### 5. 좋아요 UI 상태 동기화

**문제:**
```
좋아요를 눌렀는지 안 눌렀는지 UI에서 구분 불가
```

**원인:**
- 프론트엔드에 `isLikedByCurrentUser` 정보 없음

**해결:**
```java
// SharedChatResponse.java - DTO에 필드 추가
private Boolean isLikedByCurrentUser;

// CommunityService.java - 변환 시 좋아요 여부 체크
boolean isLiked = chatLikeRepository.existsBySharedChatIdAndUserId(
    sharedChat.getId(), userId
);
response.setIsLikedByCurrentUser(isLiked);
```

```typescript
// Community.tsx - 조건부 렌더링
{chat.isLikedByCurrentUser ? (
  <svg fill="red">♥</svg>  // 빨간 하트
) : (
  <svg fill="none" stroke="white">♡</svg>  // 빈 하트
)}
```

---

## 🚀 향후 계획

### Phase 1: 기능 개선
- [x] 대화 히스토리 저장 및 조회 ✅
- [x] 대화 공유 기능 (커뮤니티) ✅
- [x] 좋아요 및 댓글 시스템 ✅
- [ ] 사용자 프로필 페이지
- [ ] 비밀번호 변경 기능
- [ ] 게시글 검색 기능
- [ ] 북마크 기능

### Phase 2: UX 개선
- [ ] 실시간 타이핑 효과 (스트리밍)
- [ ] 마크다운 렌더링 (코드 블록, 링크)
- [ ] 음성 입력 지원
- [ ] 다크/라이트 테마 토글
- [ ] 무한 스크롤 (페이지네이션)
- [ ] 이미지 업로드 지원

### Phase 3: AI 고도화
- [ ] 대화 컨텍스트 유지 (이전 대화 기억)
- [ ] 감정 분석 및 맞춤 응답
- [ ] MBTI 유형별 프롬프트 최적화
- [ ] Fine-tuning (T 유형 데이터셋)
- [ ] 다중 AI 모드 (친구형, 선배형, 멘토형)

### Phase 4: 인프라
- [ ] PostgreSQL로 DB 변경
- [ ] Docker 컨테이너화
- [ ] CI/CD 파이프라인 구축
- [ ] AWS/GCP 배포
- [ ] Redis 캐싱 (세션 관리)
- [ ] 로그 시스템 구축

---

## ⚠️ 주의사항

### 보안
- ⚠️ **API 키 노출 금지**: `.env` 파일이나 환경변수 사용
- ⚠️ **비밀번호 평문 저장 금지**: BCrypt로 암호화됨
- ⚠️ **HTTPS 사용 권장**: 프로덕션에서는 SSL 인증서 필요

### 데이터
- ⚠️ **DB 백업**: H2 파일이 손상되면 데이터 복구 불가
- ⚠️ **Git에 업로드 금지**: `.gitignore`에 `data/` 폴더 포함
- ⚠️ **세션 만료**: 브라우저 종료 시 로그인 상태 해제 가능

### 개발
- ⚠️ **포트 충돌**: 8080 (백엔드), 5173 (프론트엔드) 사용 중인지 확인
- ⚠️ **Node 버전**: 18 이상 필요 (`node -v`로 확인)
- ⚠️ **Java 버전**: 21 이상 필요 (`java -version`으로 확인)

---

## 📝 라이선스

이 프로젝트는 **MIT License**를 따릅니다.

```
MIT License

Copyright (c) 2025 서울과학기술대학교 EC 동아리

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 팀원

<div align="center">

### 서울과학기술대학교 EC 동아리 해커톤 프로젝트

| 역할 | 담당 |
|------|------|
| **Backend** | Spring Boot, Spring Security, Gemini API |
| **Frontend** | React, TypeScript, Tailwind CSS |
| **Database** | H2, JPA |
| **DevOps** | Git, VS Code |

</div>

---

## 🔗 링크

- **GitHub Repository**: [gksruf22/-po-teto-mans](https://github.com/gksruf22/-po-teto-girls)
- **Gemini API**: [Google AI Studio](https://ai.google.dev/)
- **Issue 제보**: [GitHub Issues](https://github.com/gksruf22/-po-teto-mans/issues)

---

<div align="center">

**Made with by EC & TCP & NL 해커톤 || (포)테토녀들**

</div>
