package com.retiantonio.onlineforum.repository;

import com.retiantonio.onlineforum.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByResolved(boolean resolved);
    List<Report> findByReportedPost_Id(Long postId);
    boolean existsByReporter_IdAndReportedPost_Id(Long reporterId, Long postId);
}