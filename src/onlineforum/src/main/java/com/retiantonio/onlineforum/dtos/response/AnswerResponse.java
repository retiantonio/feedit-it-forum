package com.retiantonio.onlineforum.dtos.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AnswerResponse {

    private Long id;
    private String body;
    private int votes;
    private boolean flagged;
    private String ownerUsername;
    private Long ownerId;

    private Long parentPostId;
    private String parentPostType;

    private int replyCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}