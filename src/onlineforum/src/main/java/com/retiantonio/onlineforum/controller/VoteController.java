package com.retiantonio.onlineforum.controller;


import com.retiantonio.onlineforum.dtos.response.VoteStatusResponse;
import com.retiantonio.onlineforum.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @GetMapping("/me")
    public ResponseEntity<List<VoteStatusResponse>> getMyVotes() {
        return ResponseEntity.ok(voteService.getCurrentUserVotes());
    }
}
