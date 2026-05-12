package com.retiantonio.onlineforum.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "users")

@Getter @Setter @NoArgsConstructor
public abstract class UserAbstract {

    //BUSINESS LOGIC
    @Id
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean suspended = false;

    //REGISTRATION DATA
    @NotBlank(message = "Username is required.")
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank(message = "Email is required.")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Password is required.")
    @Column(nullable = false)
    private String password;

}