package com.retiantonio.onlineforum.controller;

import com.retiantonio.onlineforum.dtos.request.ReportRequest;
import com.retiantonio.onlineforum.dtos.response.ReportResponse;
import com.retiantonio.onlineforum.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponse> create(@Valid @RequestBody ReportRequest request) {
        return ResponseEntity.ok(reportService.create(request));
    }
}