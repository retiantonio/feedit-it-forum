package com.retiantonio.onlineforum.controller;

import com.retiantonio.onlineforum.dtos.request.QuestionRequest;
import com.retiantonio.onlineforum.dtos.response.QuestionResponse;
import com.retiantonio.onlineforum.model.Category;
import com.retiantonio.onlineforum.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionResponse> create(@Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(questionService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> getAll() {
        return ResponseEntity.ok(questionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<QuestionResponse>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(questionService.search(keyword));
    }

    @GetMapping("/unified-search")
    public ResponseEntity<List<QuestionResponse>> unifiedSearch(@RequestParam String keyword) {
        return ResponseEntity.ok(questionService.unifiedSearch(keyword));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<QuestionResponse>> getByCategory(@PathVariable Category category) {
        return ResponseEntity.ok(questionService.getByCategory(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(questionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        questionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<QuestionResponse> vote(
            @PathVariable Long id,
            @RequestParam int direction) {
        return ResponseEntity.ok(questionService.vote(id, direction));
    }
}