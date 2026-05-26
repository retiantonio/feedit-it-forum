package com.retiantonio.onlineforum.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")

@Getter @Setter @NoArgsConstructor
public class Question extends PostAbstract {

    @NotBlank(message = "Title is required.")
    @Column(nullable = false)
    private String title;

    @ManyToMany
    @JoinTable(
            name = "question_categories",
            joinColumns = @JoinColumn(name = "question_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();
}