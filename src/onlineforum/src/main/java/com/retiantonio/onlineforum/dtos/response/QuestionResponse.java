package com.retiantonio.onlineforum.dtos.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuestionResponse {
    private Long id;
    private String title;
    private String body;
    private int votes;
    private boolean flagged;
    private List<Long> categoryIds;
    private String ownerUsername;
    private Long ownerId;
    private int answerCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}