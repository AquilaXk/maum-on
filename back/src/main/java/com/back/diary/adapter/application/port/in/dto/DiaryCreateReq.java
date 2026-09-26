package com.back.diary.adapter.application.port.in.dto;

import com.back.diary.domain.Diary;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@JsonIgnoreProperties(ignoreUnknown = true)
@Schema(description = "감정 일기 생성/수정 요청")
public record DiaryCreateReq(
    @NotBlank(message = "제목을 입력해주세요.")
    @Schema(description = "일기 제목", example = "오늘의 기록")
    String title,
    
    @NotBlank(message = "내용을 입력해주세요.")
    @Schema(description = "일기 본문", example = "불안했지만 그래도 하루를 버텼다.")
    String content,
    
    @NotBlank(message = "카테고리를 선택해주세요.")
    @Schema(description = "감정 카테고리 이름", example = "WORRY")
    String categoryName,
    @Schema(description = "비공개 여부", example = "false")
    boolean isPrivate,
    @Schema(description = "첨부 이미지 URL", example = "https://cdn.example.com/diary-image.png")
    String imageUrl,
    @Schema(description = "기분 점수 (1~5)", example = "4")
    Integer moodScore,
    @Schema(description = "세부 감정 태그", example = "행복,뿌듯함")
    String emotionTags,
    @Schema(description = "유발 요인 태그", example = "업무,운동")
    String triggerTags
) {
    public DiaryCreateReq(String title, String content, String categoryName, boolean isPrivate, String imageUrl) {
        this(title, content, categoryName, isPrivate, imageUrl, null, null, null);
    }

    // Service 계층에서 엔티티로 변환할 때 사용
    public Diary toEntity(Long memberId, String nickname) {
        return Diary.builder()
            .memberId(memberId)
            .nickname(nickname)
            .title(title)
            .content(content)
            .imageUrl(imageUrl)
            .categoryName(categoryName)
            .isPrivate(isPrivate)
            .moodScore(moodScore)
            .emotionTags(emotionTags)
            .triggerTags(triggerTags)
            .build();
    }
}
