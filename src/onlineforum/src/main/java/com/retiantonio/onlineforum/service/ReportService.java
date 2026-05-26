package com.retiantonio.onlineforum.service;

import com.retiantonio.onlineforum.dtos.request.ReportRequest;
import com.retiantonio.onlineforum.dtos.response.ReportResponse;
import com.retiantonio.onlineforum.exceptions.AlreadyExistsException;
import com.retiantonio.onlineforum.exceptions.ResourceNotFoundException;
import com.retiantonio.onlineforum.model.*;
import com.retiantonio.onlineforum.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final PostAbstractRepository postRepository;
    private final UserRepository userRepository;

    private UserAbstract getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ReportResponse toResponse(Report r) {
        ReportResponse res = new ReportResponse();
        res.setId(r.getId());
        res.setReportedPostId(r.getReportedPost().getId());
        res.setReportedPostType(r.getReportedPost() instanceof Question ? "QUESTION" : "ANSWER");
        res.setReportedPostOwner(r.getReportedPost().getOwner().getUsername());
        res.setReportedPostBody(r.getReportedPost().getBody());
        if (r.getReportedPost() instanceof Question) {
            res.setReportedPostTitle(((Question) r.getReportedPost()).getTitle());
        }

        res.setReason(r.getReason());
        res.setResolved(r.isResolved());
        res.setReportedAt(r.getReportedAt());
        return res;
    }

    public ReportResponse create(ReportRequest request) {
        UserAbstract currentUser = getCurrentUser();

        PostAbstract post = postRepository.findById(request.getReportedPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (reportRepository.existsByReporter_IdAndReportedPost_Id(
                currentUser.getId(), post.getId())) {
            throw new AlreadyExistsException("You have already reported this post");
        }

        Report report = new Report();
        report.setReportedPost(post);

        report.setReporter(currentUser);
        report.setReason(request.getReason());

        return toResponse(reportRepository.save(report));
    }

    public List<ReportResponse> getPending() {
        return reportRepository.findByResolved(false)
                .stream().map(this::toResponse).toList();
    }

    public List<ReportResponse> getAll() {
        return reportRepository.findAll()
                .stream().map(this::toResponse).toList();
    }

    public ReportResponse resolve(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        report.setResolved(true);
        return toResponse(reportRepository.save(report));
    }

}
