package com.retiantonio.onlineforum.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "questions")

@Getter @Setter @NoArgsConstructor
public class Question extends PostAbstract {

    @NotBlank(message = "Title is required.")
    @Column(nullable = false)
    private String title;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "question_categories", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "category")
    private List<Category> categories;

}