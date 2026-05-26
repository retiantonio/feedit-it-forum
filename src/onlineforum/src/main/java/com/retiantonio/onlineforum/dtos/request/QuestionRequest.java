package com.retiantonio.onlineforum.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class QuestionRequest {

    @NotBlank
    @Size(min = 10, max = 200, message = "Title must be between 10 and 200 characters")
    private String title;

    @NotBlank
    @Size(min = 20, message = "Body must be at least 20 characters long")
    private String body;

    @NotEmpty(message = "Please select at least one category")
    private List<Long> categoryIds;
}
