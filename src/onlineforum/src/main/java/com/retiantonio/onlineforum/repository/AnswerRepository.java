package com.retiantonio.onlineforum.repository;

import com.retiantonio.onlineforum.model.Answer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByParentPost_Id(Long parentPostId);
    List<Answer> findByOwner_Id(Long ownerId);

    @Query("SELECT COUNT(a) FROM Answer a WHERE a.parentPost.id = :postId")
    int countByParentPostId(@Param("postId") Long postId);

}