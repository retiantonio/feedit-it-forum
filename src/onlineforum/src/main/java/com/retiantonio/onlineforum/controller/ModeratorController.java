package com.retiantonio.onlineforum.controller;

import com.retiantonio.onlineforum.dtos.request.CategoryRequest;
import com.retiantonio.onlineforum.dtos.request.SuspendRequest;
import com.retiantonio.onlineforum.dtos.response.ActivityLogResponse;
import com.retiantonio.onlineforum.dtos.response.CategoryResponse;
import com.retiantonio.onlineforum.dtos.response.ReportResponse;
import com.retiantonio.onlineforum.service.ModeratorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moderator")
@RequiredArgsConstructor
public class ModeratorController {

    private final ModeratorService moderatorService;

    @GetMapping("/reports")
    public ResponseEntity<List<ReportResponse>> getPendingReports() {
        return ResponseEntity.ok(moderatorService.getPendingReports());
    }

    @GetMapping("/reports/all")
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        return ResponseEntity.ok(moderatorService.getAllReports());
    }

    @PutMapping("/reports/{id}/resolve")
    public ResponseEntity<ReportResponse> resolveReport(@PathVariable Long id) {
        return ResponseEntity.ok(moderatorService.resolveReport(id));
    }

    @DeleteMapping("/posts/{id}/delete")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        moderatorService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/suspend")
    public ResponseEntity<Void> suspendUser(
            @PathVariable Long id,
            @Valid @RequestBody SuspendRequest request) {
        moderatorService.suspendUser(id, request.getDays());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/logs")
    public ResponseEntity<List<ActivityLogResponse>> getLogs() {
        return ResponseEntity.ok(moderatorService.getActivityLogs());
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(moderatorService.createCategory(request));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<CategoryResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(moderatorService.updateCategory(id, request));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        moderatorService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}