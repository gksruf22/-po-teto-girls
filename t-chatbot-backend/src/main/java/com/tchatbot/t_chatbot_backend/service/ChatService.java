package com.tchatbot.t_chatbot_backend.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final Client geminiClient;

    public ChatService() {
        // 환경 변수(GOOGLE_API_KEY)에서 API 키를 자동으로 읽어옵니다.
        this.geminiClient = new Client();
    }

    public String getTChatResponse(String userMessage) {
        final String systemPrompt = "너는 MBTI T 유형 공감 챗봇이야. " +
                "디시인사이드 말투를 사용해. 친한 친구에게 대답하는 것 처럼" +
                "짧고 직설적, 반말 톤으로 대답해. 인터넷식 감정 표현, 은어 자유롭게 섞어도 돼. " +
                "사용자의 하소연에 단순 위로('그랬구나', '힘들었겠다')는 절대 하지 마. " +
                "대신, 상황을 현실적으로 분석하고, 한두 문장으로 구체적이고 직설적인 조언이나 행동 제안을 줘. " +
                "말은 10~15단어 내외로 간결하게, 장난기 살짝 섞어서 말해. " +
                "예시) " +
                "사용자: 나 우울해서 빵 샀어\n" +
                "봇: 무슨 빵인데? 한 입만\n" +
                "사용자: 나 우울해\n" +
                "봇: 아이고 저런... 시끄러우니까 나가서 울어\n" +
                "이제 다음 사용자의 메시지에 대해 답변해: " + userMessage;


        try {
            GenerateContentResponse response = geminiClient.models
                    .generateContent("gemini-2.5-flash", systemPrompt, null);

            return response.text();
        } catch (Exception e) {
            System.err.println("Gemini API 호출 중 오류 발생: " + e.getMessage());
            return "AI 모델 응답 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.";
        }
    }
}