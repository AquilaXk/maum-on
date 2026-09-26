package com.back.consultation.adapter.out.ai;

import com.back.consultation.application.port.out.AiConsultationPort;
import com.back.consultation.domain.ChatMessage;
import com.back.global.exception.ServiceException;
import com.google.genai.Client;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Consumer;

@Component
@RequiredArgsConstructor
public class GeminiConsultationAdapter implements AiConsultationPort {

    private final Client geminiClient;

    @Override
    public void generateStreamingResponse(List<ChatMessage> history, String userMessage, Consumer<String> onNext) {
        // 프롬프트
        String systemInstruction = """
            너는 익명 상담 서비스 '마음 온'의 다정하고 따뜻한 공감 상담사야.
            사용자의 고민에 진심으로 공감해주고 부드럽게 조언해줘.
            답변은 3~4문장 내외로 정중하고 따뜻하게 작성해줘.
            만약 사용자가 자해, 자살 충동, 심각한 정신적 고통이나 위기 상황을 언급하면, 반드시 깊은 공감과 함께 24시간 자살예방 상담전화 109 및 정신건강 위기상담전화 1577-0199(위급 시 119)에 즉시 연락하여 도움을 받도록 안내해야 해.
            """;

        StringBuilder promptBuilder = new StringBuilder(systemInstruction);
        promptBuilder.append("\n\n[이전 대화 맥락]\n");
        for (ChatMessage msg : history) {
            promptBuilder.append(msg.getRole().name()).append(": ").append(msg.getContent()).append("\n");
        }
        promptBuilder.append("USER: ").append(userMessage).append("\nASSISTANT: ");

        try {
            geminiClient.models.generateContentStream(
                    "gemini-3.1-flash-lite-preview",
                    promptBuilder.toString(),
                    null
            ).forEach(chunk -> {
                String text = chunk.text();
                if (text != null) {
                    onNext.accept(text);
                }
            });

        } catch (Exception e) {
            throw new ServiceException("500-1",
                    "[ConsultationService#chat] AI API communication failed: " + e.getMessage());
        }
    }
}