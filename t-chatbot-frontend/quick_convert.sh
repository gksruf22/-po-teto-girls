#!/bin/bash

# Login.css와 Community.css 생성 및 파일 변환을 위한 스크립트
echo "Creating CSS files and converting components..."

# Login.css 생성
cat > src/pages/Login.css << 'CSS'
.login-container {
  background-color: #1e1e1e;
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
}

.login-wrapper {
  max-width: 28rem;
  width: 100%;
}

.login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  text-decoration: none;
  transition: opacity 0.2s;
}

.login-logo:hover {
  opacity: 0.8;
}

.login-logo span {
  font-size: 1.875rem;
  font-weight: 500;
  color: white;
}

.login-card {
  background-color: #282828;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  border: 1px solid #3c4043;
}

.login-title {
  font-size: 1.5rem;
  font-weight: normal;
  text-align: center;
  margin-bottom: 1.5rem;
}

.error-message {
  background-color: rgba(127, 29, 29, 0.3);
  border: 1px solid #991b1b;
  color: #fecaca;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  color: #d1d5db;
  margin-bottom: 0.5rem;
}

.form-input-field {
  width: 100%;
  background-color: #3c4043;
  border: 1px solid #5f6368;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: white;
  outline: none;
  transition: border-color 0.2s;
}

.form-input-field:focus {
  border-color: #3b82f6;
}

.form-input-field::placeholder {
  color: #9ca3af;
}

.submit-button {
  width: 100%;
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.submit-button:hover {
  background-color: #1d4ed8;
}

.toggle-text {
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.toggle-button {
  color: #60a5fa;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 0.25rem;
}

.toggle-button:hover {
  color: #3b82f6;
}
CSS

# Community.css 생성
cat > src/pages/Community.css << 'CSS'
.community-container {
  background-color: #1e1e1e;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.community-main {
  flex: 1;
  padding: 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
  width: 100%;
}

.community-title {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.post-card {
  background-color: #282828;
  border: 1px solid #3c4043;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: border-color 0.2s;
}

.post-card:hover {
  border-color: #60a5fa;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.post-meta {
  font-size: 0.875rem;
  color: #9ca3af;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.post-tag {
  background-color: #3c4043;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  color: #60a5fa;
}

.post-content {
  margin: 1rem 0;
}

.chat-qa {
  background-color: #1e1e1e;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 0.75rem;
}

.qa-item {
  margin-bottom: 1rem;
}

.qa-label {
  font-weight: 600;
  color: #60a5fa;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.qa-text {
  color: #d1d5db;
  white-space: pre-wrap;
}

.post-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s, color 0.2s;
}

.action-button:hover {
  background-color: #3c4043;
  color: white;
}

.action-button.liked {
  color: #ef4444;
}

.action-button svg {
  width: 1.25rem;
  height: 1.25rem;
}

@media (min-width: 768px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .posts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
CSS

echo "CSS files created successfully!"
echo "Now you need to update the TSX files to import these CSS files."

