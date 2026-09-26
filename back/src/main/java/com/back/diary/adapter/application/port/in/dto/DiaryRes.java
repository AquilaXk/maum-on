package com.back.diary.adapter.application.port.in.dto;

import com.back.diary.domain.Diary;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "감정 일기 응답")
public record DiaryRes(
    @Schema(description = "일기 식별자", example = "301") Long id,
    @Schema(description = "일기 제목", example = "오늘의 기록") String title,
    @Schema(description = "일기 본문", example = "불안했지만 그래도 하루를 버텼다.") String content,
    @Schema(description = "감정 카테고리", example = "WORRY") String categoryName,
    @Schema(description = "작성자 닉네임", example = "마음온데모") String nickname,
    @Schema(description = "첨부 이미지 URL", example = "https://cdn.example.com/diary-image.png") String imageUrl,
    @Schema(description = "비공개 여부", example = "false") boolean isPrivate,
    @Schema(description = "작성 시각", example = "2026-04-10T09:20:00") LocalDateTime createDate,
    @Schema(description = "수정 시각", example = "2026-04-10T09:30:00") LocalDateTime modifyDate,
    @Schema(description = "기분 점수 (1~5)", example = "4") Integer moodScore,
    @Schema(description = "세부 감정 태그", example = "행복,뿌듯함") String emotionTags,
    @Schema(description = "유발 요인 태그", example = "업무,운동") String triggerTags
) {
    public DiaryRes(Long id, String title, String content, String categoryName, String nickname, String imageUrl, boolean isPrivate, LocalDateTime createDate, LocalDateTime modifyDate) {
        this(id, title, content, categoryName, nickname, imageUrl, isPrivate, createDate, modifyDate, null, null, null);
    }

    public static DiaryRes from(Diary diary) {
        return new DiaryRes(
            diary.getId(),
            diary.getTitle(),
            diary.getContent(),
            diary.getCategoryName(),
            diary.getNickname(),
            diary.getImageUrl(),
            diary.isPrivate(),
            diary.getCreateDate(),
            diary.getModifyDate(),
            diary.getMoodScore(),
            diary.getEmotionTags(),
            diary.getTriggerTags()
        );
    }
}
