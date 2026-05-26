package com.retiantonio.onlineforum.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReportRequest {

    @NotNull(message = "Reported post ID is required")
    private Long reportedPostId;

    @NotBlank(message = "Please provide a reason for reporting this post")
    @Size(min = 10, message = "Reason must be at least 20 characters long")
    private String reason;
}