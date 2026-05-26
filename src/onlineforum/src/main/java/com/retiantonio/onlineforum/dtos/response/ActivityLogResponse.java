package com.retiantonio.onlineforum.dtos.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActivityLogResponse {
    private Long id;
    private String moderatorUsername;
    private String action;
    private String targetType;
    private Long targetId;
    private LocalDateTime timestamp;
}