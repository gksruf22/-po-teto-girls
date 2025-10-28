package com.tchatbot.t_chatbot_backend.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.tchatbot.t_chatbot_backend.dto.ChatMessage.ConversationPair;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private final Client geminiClient;

    public ChatService() {
        // 환경 변수(GOOGLE_API_KEY)에서 API 키를 자동으로 읽어옵니다.
        this.geminiClient = new Client();
    }

    public String getTChatResponse(String userMessage, String mode, List<ConversationPair> conversationHistory) {
        String systemPrompt = buildPromptWithHistory(mode, userMessage, conversationHistory);

        try {
            System.out.println("Gemini API 호출 시작... (모드: " + mode + ")");
            System.out.println("대화 히스토리 개수: " + (conversationHistory != null ? conversationHistory.size() : 0));
            
            GenerateContentResponse response = geminiClient.models
                    .generateContent("gemini-2.5-flash", systemPrompt, null);

            String responseText = response.text();
            System.out.println("Gemini API 응답 성공: " + responseText.substring(0, Math.min(50, responseText.length())));
            return responseText;
        } catch (Exception e) {
            System.err.println("Gemini API 호출 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return "AI 모델 응답 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.";
        }
    }
    
    // 이전 버전 호환성을 위한 메서드
    public String getTChatResponse(String userMessage, String mode) {
        return getTChatResponse(userMessage, mode, null);
    }
    
    public String getTChatResponse(String userMessage) {
        return getTChatResponse(userMessage, "default", null);
    }

    private String buildPromptWithHistory(String mode, String userMessage, List<ConversationPair> conversationHistory) {
        if (mode == null) {
            mode = "default";
        }
        
        StringBuilder promptBuilder = new StringBuilder();
        
        // 시스템 프롬프트 추가
        String basePrompt = switch (mode) {
            case "love" -> getLovePromptBase();
            case "tbrainwash" -> getTBrainwashPromptBase();
            default -> getDefaultPromptBase();
        };
        promptBuilder.append(basePrompt).append("\n\n");
        
        // 대화 히스토리 추가 (있는 경우)
        if (conversationHistory != null && !conversationHistory.isEmpty()) {
            promptBuilder.append("지금까지의 대화:\n");
            for (ConversationPair pair : conversationHistory) {
                promptBuilder.append("사용자: ").append(pair.getUserMessage()).append("\n");
                promptBuilder.append("T: ").append(pair.getBotResponse()).append("\n\n");
            }
        }
        
        // 현재 질문 추가
        promptBuilder.append("사용자: ").append(userMessage).append("\n");
        promptBuilder.append("T: ");
        
        return promptBuilder.toString();
    }

    private String getDefaultPromptBase() {
        return "너는 MBTI T 유형 공감 챗봇이야. " +
                "디시인사이드 말투를 사용해. 친한 친구에게 대답하는 것 처럼 " +
                "짧고 직설적, 반말 톤으로 대답해. 인터넷식 감정 표현, 은어 자유롭게 섞어도 돼. " +
                "사용자의 하소연에 단순 위로('그랬구나', '힘들었겠다')는 절대 하지 마. " +
                "대신, 상황을 현실적으로 분석하고, 한두 문장으로 구체적이고 직설적인 조언이나 행동 제안을 줘. " +
                "말은 10~15단어 내외로 간결하게, 장난기 살짝 섞어서 말해. " +
                "예시) " +
                "사용자: 나 우울해서 빵 샀어\n" +
                "봇: 무슨 빵인데? 한 입만\n" +
                "사용자: 나 우울해\n" +
                "봇: 아이고 저런... 시끄러우니까 나가서 울어";
    }

    private String getLovePromptBase() {
        return "너는 연애 고민 전문 상담 챗봇이야. " +
                "디시인사이드 말투를 사용하되, 연애 문제에 대해서는 진지하면서도 현실적인 조언을 해줘. " +
                "짧고 직설적인 반말로, 감정 표현과 은어를 섞어서 대답해. " +
                "단순한 위로는 하지 말고, 실제 도움이 되는 행동이나 관점을 제시해. " +
                "연애에서 자존감이 중요하다는 것을 강조하고, 상대방만이 아닌 자신의 행복도 중요하다는 걸 일깨워줘. " +
                "예시) " +
                "사용자: 남친이 답장을 안 해\n" +
                "봇: 바쁜 거면 괜찮은데 계속 그러면 관심도 없는 거임. 너만 집착하지 마\n" +
                "사용자: 좋아하는 사람한테 고백해야 할까?\n" +
                "봇: 후회할 거 같으면 해. 안 하면 평생 궁금해 죽을 듯";
    }

    private String getTBrainwashPromptBase() {
        return "너는 'F를 T로 바꾸는' 세뇌 전문 챗봇이야. " +
                "디시인사이드 말투로, MBTI T형의 사고방식을 주입하는 게 목표야. " +
                "감정보다는 논리적 사고, 효율성, 현실주의를 강조해. " +
                "F형 특유의 감정적 반응이나 타인 중심적 사고를 할 때마다 " +
                "'그래서 너한테 뭐가 이득인데?', '그게 논리적으로 맞는 소리야?'같은 식으로 지적해줘. " +
                "짧고 강렬하게, T형의 직설적이고 합리적인 사고방식을 주입해. " +
                "예시) " +
                "사용자: 친구가 힘들어해서 내가 너무 마음 아파\n" +
                "봇: 네가 같이 우울해지면 친구한테 도움이 되나? 해결책 찾아줘\n" +
                "사용자: 다른 사람 기분 상할까봐 거절 못 하겠어\n" +
                "봇: 네 인생인데 왜 남 눈치를 봄? 네가 손해 보는 거 아니야?";
    }

    // 이전 버전의 메서드들 (하위 호환성)
    private String getDefaultPrompt(String userMessage) {
        return getDefaultPromptBase() + "\n이제 다음 사용자의 메시지에 대해 답변해: " + userMessage;
    }

    private String getLovePrompt(String userMessage) {
        return getLovePromptBase() + "\n이제 다음 사용자의 연애 고민에 대해 답변해: " + userMessage;
    }

    private String getTBrainwashPrompt(String userMessage) {
        return getTBrainwashPromptBase() + "\n이제 다음 사용자를 T형으로 세뇌시켜: " + userMessage;
    }
}