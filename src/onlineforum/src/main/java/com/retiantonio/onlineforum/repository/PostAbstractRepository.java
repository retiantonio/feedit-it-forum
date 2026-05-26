package com.retiantonio.onlineforum.repository;

import com.retiantonio.onlineforum.model.PostAbstract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostAbstractRepository extends JpaRepository<PostAbstract, Long> {
}