# 🚀 T-Chatbot 배포 가이드

이 문서는 T-Chatbot 프로젝트를 Supabase PostgreSQL + Railway/Render + Vercel로 배포하는 방법을 안내합니다.

---

## 📋 목차

1. [준비사항](#준비사항)
2. [데이터베이스 설정 (Supabase)](#1-데이터베이스-설정-supabase)
3. [백엔드 배포 (Railway 또는 Render)](#2-백엔드-배포)
4. [프론트엔드 배포 (Vercel)](#3-프론트엔드-배포-vercel)
5. [환경 변수 설정](#4-환경-변수-설정)
6. [배포 확인](#5-배포-확인)

---

## 준비사항

### 필요한 계정
- ✅ [Supabase](https://supabase.com) 계정
- ✅ [Railway](https://railway.app) 또는 [Render](https://render.com) 계정
- ✅ [Vercel](https://vercel.com) 계정
- ✅ [Google AI Studio](https://makersuite.google.com/app/apikey) - Gemini API Key

### 필요한 정보
- Google Gemini API Key
- GitHub 리포지토리 (코드 푸시 필요)

---

## 1. 데이터베이스 설정 (Supabase)

### 1.1 Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: `t-chatbot-db` (원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (저장 필요!)
   - **Region**: `Northeast Asia (Tokyo)` 선택 (한국과 가까움)

### 1.2 데이터베이스 연결 정보 확인

1. 프로젝트 대시보드에서 **Settings** → **Database** 클릭
2. **Connection string** 섹션에서 정보 확인:
   ```
   Host: db.xxxxxxxxxxxxx.supabase.co
   Database name: postgres
   Port: 5432
   User: postgres
   Password: [your-password]
   ```

3. **Connection pooling** URI 복사 (Transaction mode):
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
   ```

### 1.3 JDBC URL 형식 변환

Spring Boot에서 사용할 JDBC URL 형식:
```
jdbc:postgresql://db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

---

## 2. 백엔드 배포

### Option A: Railway 배포 (추천)

#### 2.1 Railway 프로젝트 생성

1. [Railway](https://railway.app)에 로그인
2. "New Project" 클릭
3. "Deploy from GitHub repo" 선택
4. GitHub 리포지토리 연결 및 선택
5. `t-chatbot-backend` 폴더를 Root Directory로 설정

#### 2.2 빌드 설정

Railway에서 자동으로 감지하지만, 확인:
- **Build Command**: `./gradlew clean bootJar`
- **Start Command**: `java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar build/libs/*.jar`

#### 2.3 환경 변수 설정

Railway 프로젝트의 **Variables** 탭에서 설정:

```bash
# Database (Supabase)
DATABASE_URL=jdbc:postgresql://db.xxxxxxxxxxxxx.supabase.co:5432/postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password

# Database Driver
DB_DRIVER=org.postgresql.Driver

# JPA Settings
JPA_DDL_AUTO=update
JPA_SHOW_SQL=false
JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect

# H2 Console (프로덕션에서는 비활성화)
H2_CONSOLE_ENABLED=false

# Session
SESSION_COOKIE_SECURE=true

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-256-bits-long-please-change-this-to-random-string
JWT_EXPIRATION=86400000

# Google Gemini API
GOOGLE_API_KEY=your-google-gemini-api-key

# CORS (프론트엔드 URL로 변경)
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app

# Spring Profile
SPRING_PROFILES_ACTIVE=prod
```

#### 2.4 배포 및 URL 확인

- Railway가 자동으로 배포 시작
- **Settings** → **Domains**에서 `your-app.up.railway.app` 형식의 URL 확인
- 이 URL을 복사해두세요 (프론트엔드에서 사용)

---

### Option B: Render 배포

#### 2.1 Render 서비스 생성

1. [Render](https://render.com)에 로그인
2. "New +" → "Web Service" 클릭
3. GitHub 리포지토리 연결
4. 설정:
   - **Name**: `t-chatbot-backend`
   - **Root Directory**: `t-chatbot-backend`
   - **Environment**: `Java`
   - **Build Command**: `./gradlew clean bootJar`
   - **Start Command**: `java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar build/libs/*.jar`

#### 2.2 환경 변수 설정

위의 Railway와 동일한 환경 변수 설정

---

## 3. 프론트엔드 배포 (Vercel)

### 3.1 Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 로그인
2. "Add New..." → "Project" 클릭
3. GitHub 리포지토리 Import
4. 설정:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `t-chatbot-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 환경 변수 설정

Vercel 프로젝트의 **Settings** → **Environment Variables**에서:

```bash
VITE_API_URL=https://your-backend.up.railway.app
```

⚠️ **중요**: Railway/Render에서 배포한 백엔드 URL을 정확히 입력하세요!

### 3.3 배포

- "Deploy" 버튼 클릭
- 배포 완료 후 `your-app.vercel.app` 형식의 URL 확인

---

## 4. 환경 변수 설정

### 4.1 백엔드 CORS 업데이트

Railway/Render 환경 변수에서 `CORS_ALLOWED_ORIGINS` 업데이트:

```bash
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
```

여러 도메인은 콤마(,)로 구분

### 4.2 재배포

- Railway: 자동으로 재배포
- Render: "Manual Deploy" → "Deploy latest commit"

---

## 5. 배포 확인

### 5.1 백엔드 Health Check

브라우저에서 접속:
```
https://your-backend.up.railway.app/api/auth/check
```

예상 응답: `401 Unauthorized` (정상 - 로그인하지 않았기 때문)

### 5.2 프론트엔드 접속

```
https://your-app.vercel.app
```

### 5.3 테스트

1. 회원가입 테스트
2. 로그인 테스트
3. 채팅 기능 테스트
4. 커뮤니티 기능 테스트

---

## 🔧 트러블슈팅

### 문제 1: CORS 에러

**증상**: 브라우저 콘솔에 CORS 관련 에러

**해결**:
1. 백엔드 환경 변수 `CORS_ALLOWED_ORIGINS`에 프론트엔드 URL 추가
2. Railway/Render 재배포

### 문제 2: Database Connection 실패

**증상**: 백엔드 로그에 "Unable to connect to database"

**해결**:
1. Supabase Database Password 확인
2. DATABASE_URL 형식 확인: `jdbc:postgresql://...`
3. DB_USERNAME이 `postgres`인지 확인

### 문제 3: API 호출 실패

**증상**: 프론트엔드에서 API 호출 시 404 또는 연결 실패

**해결**:
1. Vercel 환경 변수 `VITE_API_URL` 확인
2. 백엔드 URL이 정확한지 확인
3. Vercel 프로젝트 재배포

### 문제 4: 빌드 실패

**백엔드 빌드 실패**:
- Gradle 권한 확인: `chmod +x gradlew`
- Java 21 사용 확인

**프론트엔드 빌드 실패**:
- `package.json`의 의존성 확인
- Node.js 버전 18+ 사용 권장

---

## 📚 추가 정보

### 로컬 테스트 (PostgreSQL)

1. `.env` 파일 생성 (`.env.example` 참고)
2. 환경 변수 설정
3. 실행:
   ```bash
   # Backend
   cd t-chatbot-backend
   ./gradlew bootRun --args='--spring.profiles.active=prod'

   # Frontend
   cd t-chatbot-frontend
   npm run dev
   ```

### 데이터베이스 마이그레이션

H2에서 PostgreSQL로 데이터 이동이 필요한 경우:
1. H2 데이터 Export
2. Supabase SQL Editor에서 Import

### 커스텀 도메인 설정

**Vercel**:
- Settings → Domains → Add Domain

**Railway**:
- Settings → Domains → Custom Domain

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] Supabase PostgreSQL 데이터베이스 생성 완료
- [ ] Google Gemini API Key 발급 완료
- [ ] JWT Secret 생성 (256비트 이상 랜덤 문자열)
- [ ] 모든 환경 변수 설정 완료
- [ ] GitHub에 코드 푸시 완료
- [ ] 백엔드 배포 및 URL 확인
- [ ] 프론트엔드 배포 및 URL 확인
- [ ] CORS 설정 완료
- [ ] 회원가입/로그인 테스트 완료
- [ ] 채팅 기능 테스트 완료

---

## 💡 팁

1. **무료 티어 제한**:
   - Railway: $5 크레딧/월
   - Render: 750시간/월 (Free tier)
   - Vercel: 무제한 (개인 프로젝트)
   - Supabase: 500MB 데이터베이스

2. **성능 최적화**:
   - Render Free tier는 15분 미사용 시 sleep 모드
   - 첫 요청 시 cold start 발생 (30초~1분 소요)

3. **보안**:
   - JWT_SECRET은 반드시 변경하세요
   - Database Password는 강력하게 설정하세요
   - 환경 변수는 절대 GitHub에 커밋하지 마세요

---

## 📞 지원

문제가 발생하면:
1. Railway/Render/Vercel 로그 확인
2. 브라우저 개발자 도구 콘솔 확인
3. GitHub Issues에 문의

---

**배포 성공을 축하합니다! 🎉**
