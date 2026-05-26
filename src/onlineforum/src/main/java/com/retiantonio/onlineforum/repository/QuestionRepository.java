package com.retiantonio.onlineforum.repository;

import com.retiantonio.onlineforum.model.Category;
import com.retiantonio.onlineforum.model.Question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByTitleContainingIgnoreCase(String keyword);
    List<Question> findByBodyContainingIgnoreCase(String keyword);
    List<Question> findByCategoriesContaining(Category category);
    List<Question> findByOwner_Id(Long ownerId);
    boolean existsByCategoriesContaining(Category category);
}