package com.retiantonio.onlineforum.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "answers")

@Getter @Setter @NoArgsConstructor
public class Answer extends PostAbstract {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

}