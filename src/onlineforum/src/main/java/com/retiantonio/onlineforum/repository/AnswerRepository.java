package com.retiantonio.onlineforum.repository;

import com.retiantonio.onlineforum.model.Answer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByQuestion_Id(Long questionId);
    List<Answer> findByOwner_Id(Long ownerId);

}