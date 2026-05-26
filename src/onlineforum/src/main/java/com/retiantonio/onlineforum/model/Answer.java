package com.retiantonio.onlineforum.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "answers")

@Getter @Setter @NoArgsConstructor
public class Answer extends PostAbstract {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_post_id")
    @org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
    private PostAbstract parentPost;
}