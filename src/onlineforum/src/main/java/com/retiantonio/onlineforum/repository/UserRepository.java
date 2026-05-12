package com.retiantonio.onlineforum.repository;

import com.retiantonio.onlineforum.model.UserAbstract;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserAbstract, Long> {

    Optional<UserAbstract> findByUsername(String username);
    Optional<UserAbstract> findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

}