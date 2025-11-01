package com.tchatbot.t_chatbot_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateSessionRequest {
    private String mode; // default, love, tbrainwash
    private String title; // optional - 사용자가 직접 지정할 수도 있음
}
