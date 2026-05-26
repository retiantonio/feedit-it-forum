package com.retiantonio.onlineforum.controller;

import com.retiantonio.onlineforum.dtos.request.AnswerRequest;
import com.retiantonio.onlineforum.dtos.response.AnswerResponse;
import com.retiantonio.onlineforum.service.AnswerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    @PostMapping("/posts/{postParentId}/answers")
    public ResponseEntity<AnswerResponse> create(
            @PathVariable Long postParentId,
            @Valid @RequestBody AnswerRequest request) {
        return ResponseEntity.ok(answerService.create(postParentId, request));
    }

    @GetMapping("/posts/{parentPostId}/answers")
    public ResponseEntity<List<AnswerResponse>> getByParentPost(@PathVariable Long parentPostId) {
        return ResponseEntity.ok(answerService.getByParentPost(parentPostId));
    }

    @PutMapping("/answers/{id}")
    public ResponseEntity<AnswerResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AnswerRequest request) {
        return ResponseEntity.ok(answerService.update(id, request));
    }

    @DeleteMapping("/answers/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        answerService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/answers/{id}/vote")
    public ResponseEntity<AnswerResponse> vote(
            @PathVariable Long id,
            @RequestParam int direction) {
        return ResponseEntity.ok(answerService.vote(id, direction));
    }
}