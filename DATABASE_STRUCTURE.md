# 📊 T-Chatbot 데이터베이스 구조

## 현재 DB 구조 (H2 Database)

### 1️⃣ **User (사용자)**
```
Table: users
┌─────────────┬──────────────┬─────────────┐
│ Column      │ Type         │ Constraint  │
├─────────────┼──────────────┼─────────────┤
│ id          │ BIGINT       │ PK, AI      │
│ email       │ VARCHAR      │ UNIQUE, NN  │
│ password    │ VARCHAR      │ NN          │
│ username    │ VARCHAR      │ NN          │
│ created_at  │ TIMESTAMP    │ NN          │
└─────────────┴──────────────┴─────────────┘
Relationship: 1:N with ChatHistory
```

### 2️⃣ **ChatHistory (채팅 기록)** ⭐ 핵심!
```
Table: chat_history
┌─────────────────┬──────────────┬─────────────┐
│ Column          │ Type         │ Constraint  │
├─────────────────┼──────────────┼─────────────┤
│ id              │ BIGINT       │ PK, AI      │
│ user_id         │ BIGINT       │ FK, NN      │
│ user_message    │ TEXT         │ NN          │
│ bot_response    │ TEXT         │ NN          │
│ created_at      │ TIMESTAMP    │ NN          │
│ is_public       │ BOOLEAN      │ Default:0   │
└─────────────────┴──────────────┴─────────────┘
Relationship: N:1 with User
```

### 3️⃣ **SharedChat (커뮤니티 공유 게시글)**
```
Table: shared_chats
┌─────────────────┬──────────────┬─────────────┐
│ Column          │ Type         │ Constraint  │
├─────────────────┼──────────────┼─────────────┤
│ id              │ BIGINT       │ PK, AI      │
│ user_id         │ VARCHAR      │ NN (email)  │
│ username        │ VARCHAR      │ NN          │
│ title           │ VARCHAR(200) │ NN          │
│ tags            │ VARCHAR(500) │             │
│ user_message    │ VARCHAR(2000)│ NN          │
│ bot_response    │ VARCHAR(2000)│ NN          │
│ created_at      │ TIMESTAMP    │ NN          │
│ likes           │ INTEGER      │ Default:0   │
└─────────────────┴──────────────┴─────────────┘
Note: User 엔티티와 직접 연결 없음 (email로 참조)
```

### 4️⃣ **ChatLike (좋아요)**
```
Table: chat_likes
┌─────────────────┬──────────────┬─────────────────────────┐
│ Column          │ Type         │ Constraint              │
├─────────────────┼──────────────┼─────────────────────────┤
│ id              │ BIGINT       │ PK, AI                  │
│ shared_chat_id  │ BIGINT       │ NN                      │
│ user_id         │ VARCHAR      │ NN (email)              │
│ created_at      │ TIMESTAMP    │ NN                      │
└─────────────────┴──────────────┴─────────────────────────┘
Unique Constraint: (shared_chat_id, user_id)
```

### 5️⃣ **Comment (댓글)**
```
Table: comments
┌─────────────────┬──────────────┬─────────────┐
│ Column          │ Type         │ Constraint  │
├─────────────────┼──────────────┼─────────────┤
│ id              │ BIGINT       │ PK, AI      │
│ shared_chat_id  │ BIGINT       │ NN          │
│ user_id         │ VARCHAR      │ NN (email)  │
│ username        │ VARCHAR      │ NN          │
│ content         │ VARCHAR(1000)│ NN          │
│ created_at      │ TIMESTAMP    │ NN          │
└─────────────────┴──────────────┴─────────────┘
```

---

## 🔍 현재 상황 분석

### ✅ 이미 구현된 것
1. **ChatHistory 테이블**: 채팅 저장 기능의 뼈대는 이미 존재!
   - User와 N:1 관계 설정됨
   - user_message, bot_response 저장 가능
   - is_public 필드로 공유 여부 관리 가능

2. **Repository**: `ChatHistoryRepository` 이미 존재
   - `findByUserIdOrderByCreatedAtDesc()`: 사용자별 채팅 조회
   - `findByIsPublicTrueOrderByCreatedAtDesc()`: 공개 채팅 조회

### ❌ 아직 구현되지 않은 것
1. **ChatController에서 실제 저장 로직 없음**
   - 현재는 메시지 주고받기만 함
   - DB에 저장하는 코드가 없음

2. **채팅 세션/룸 개념 없음**
   - 현재는 개별 메시지 단위만 저장 가능
   - 대화 세션을 그룹화하는 개념이 없음

3. **프론트엔드에서 채팅 목록 조회 기능 없음**
   - 사이드바에 이전 채팅 목록 표시 기능 없음
   - 저장된 채팅 불러오기 기능 없음

---

## 🎯 채팅 저장 기능 구현을 위한 제안

### 옵션 1: 간단한 방식 (현재 구조 활용)
개별 Q&A 메시지를 각각 저장
- 장점: 빠른 구현
- 단점: 대화의 연속성 파악 어려움

### 옵션 2: 채팅 세션 방식 (권장) ⭐
새로운 `ChatSession` 엔티티 추가
```
ChatSession (채팅방/대화 세션)
├── id
├── user_id
├── title (자동생성 또는 사용자 지정)
├── mode (default/love/tbrainwash)
├── created_at
├── updated_at
└── chat_messages (1:N)
    └── ChatHistory
```

이 방식으로 하면:
- 대화를 세션별로 그룹화
- 사이드바에서 이전 대화 목록 표시
- 대화 이어가기 가능
- 각 세션의 제목 자동 생성 (첫 질문 기반)

어떤 방식으로 구현하고 싶으신가요?
