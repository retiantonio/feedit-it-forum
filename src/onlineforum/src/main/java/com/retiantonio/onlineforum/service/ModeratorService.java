package com.retiantonio.onlineforum.service;

import com.retiantonio.onlineforum.dtos.request.CategoryRequest;
import com.retiantonio.onlineforum.dtos.response.ActivityLogResponse;
import com.retiantonio.onlineforum.dtos.response.CategoryResponse;
import com.retiantonio.onlineforum.dtos.response.ReportResponse;
import com.retiantonio.onlineforum.exceptions.ResourceNotFoundException;
import com.retiantonio.onlineforum.model.*;
import com.retiantonio.onlineforum.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ModeratorService {

    private final PostAbstractRepository postRepository;
    private final UserRepository userRepository;
    private final ReportService reportService;
    private final ActivityLogService activityLogService;
    private final CategoryService categoryService;

    public void deletePost(Long postId) {
        PostAbstract post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        postRepository.delete(post);
        activityLogService.log("DELETE_POST",
                post instanceof Question ? "QUESTION" : "ANSWER", postId);
    }

    public void suspendUser(Long userId, int days) {
        UserAbstract user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LocalDateTime until = LocalDateTime.now().plusDays(days);

        user.setSuspendedUntil(until);
        userRepository.save(user);
        activityLogService.log(
                "SUSPEND_USER_" + days + "_DAYS",
                "USER", userId
        );
    }

    public List<UserAbstract> getSuspendedUsers() {
        return userRepository.findBySuspended(true);
    }

    public ReportResponse resolveReport(Long reportId) {
        ReportResponse res = reportService.resolve(reportId);
        activityLogService.log("RESOLVE_REPORT", "REPORT", reportId);
        return res;
    }

    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        return categoryService.create(categoryRequest);
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest) {
        return categoryService.update(id, categoryRequest);
    }

    public void deleteCategory(Long id) {
        categoryService.delete(id);
    }

    public List<ReportResponse> getPendingReports() {
        return reportService.getPending();
    }

    public List<ReportResponse> getAllReports() {
        return reportService.getAll();
    }

    public List<ActivityLogResponse> getActivityLogs() {
        return activityLogService.getByModerator();
    }
}