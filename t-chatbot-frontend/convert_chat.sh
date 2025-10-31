#!/bin/bash
# Chat.tsx의 Tailwind 클래스를 CSS 클래스로 변환

cp src/pages/Chat.tsx src/pages/Chat.tsx.backup

# className 변환
sed -i '' 's/className="bg-\[#1e1e1e\] text-white h-screen flex flex-col"/className="chat-container"/g' src/pages/Chat.tsx
sed -i '' 's/className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"/className="share-modal-overlay"/g' src/pages/Chat.tsx
sed -i '' 's/className="bg-\[#2d2d2d\] rounded-2xl p-6 max-w-2xl w-full max-h-\[90vh\] overflow-y-auto"/className="share-modal"/g' src/pages/Chat.tsx
sed -i '' 's/className="text-2xl font-bold mb-6"/className="share-modal-title"/g' src/pages/Chat.tsx
sed -i '' 's/className="bg-\[#1e1e1e\] rounded-lg p-4 mb-6 space-y-4"/className="chat-preview-messages"/g' src/pages/Chat.tsx
sed -i '' 's/className="flex justify-end"/className="message-row user"/g' src/pages/Chat.tsx
sed -i '' 's/className="bg-\[#282828\] px-5 py-3 rounded-2xl max-w-\[80%\]"/className="user-message-bubble"/g' src/pages/Chat.tsx

echo "Tailwind classes converted to CSS classes"
