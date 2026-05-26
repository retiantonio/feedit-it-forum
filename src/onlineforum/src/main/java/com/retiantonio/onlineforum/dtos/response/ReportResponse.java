package com.retiantonio.onlineforum.dtos.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReportResponse {
    private Long id;
    private Long reportedPostId;
    private String reportedPostType;
    private String reportedPostOwner;
    private String reason;
    private boolean resolved;
    private LocalDateTime reportedAt;
    private String reportedPostTitle;
    private String reportedPostBody;
}