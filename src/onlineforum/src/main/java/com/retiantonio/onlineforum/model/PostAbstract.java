package com.retiantonio.onlineforum.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "posts")

@Getter @Setter @NoArgsConstructor
public abstract class PostAbstract {

    @Id
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private UserAbstract owner;

    @NotBlank(message = "Body is required.")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private int votes = 0;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private boolean flagged = false;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}