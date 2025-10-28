package com.tchatbot.t_chatbot_backend.dto;

public class ShareChatRequest {
    private String title;
    private String tags;
    private String userMessage;
    private String botResponse;
    
    public ShareChatRequest() {
    }
    
    public ShareChatRequest(String title, String tags, String userMessage, String botResponse) {
        this.title = title;
        this.tags = tags;
        this.userMessage = userMessage;
        this.botResponse = botResponse;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getTags() {
        return tags;
    }
    
    public void setTags(String tags) {
        this.tags = tags;
    }
    
    public String getUserMessage() {
        return userMessage;
    }
    
    public void setUserMessage(String userMessage) {
        this.userMessage = userMessage;
    }
    
    public String getBotResponse() {
        return botResponse;
    }
    
    public void setBotResponse(String botResponse) {
        this.botResponse = botResponse;
    }
}
