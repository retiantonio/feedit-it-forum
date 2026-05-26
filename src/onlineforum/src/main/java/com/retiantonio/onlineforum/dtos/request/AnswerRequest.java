package com.retiantonio.onlineforum.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AnswerRequest {

    @NotBlank(message = "Body must not be blank")
    @Size(min = 10, message = "Body must be at least 20 characters long")
    private String body;

}