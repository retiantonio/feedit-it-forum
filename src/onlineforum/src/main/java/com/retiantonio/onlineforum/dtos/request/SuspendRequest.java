package com.retiantonio.onlineforum.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SuspendRequest {
    @NotNull(message = "Number of days required")
    private int days;
}