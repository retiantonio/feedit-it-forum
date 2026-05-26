package com.retiantonio.onlineforum.service;

import com.retiantonio.onlineforum.dtos.response.VoteStatusResponse;
import com.retiantonio.onlineforum.exceptions.ResourceNotFoundException;
import com.retiantonio.onlineforum.model.UserAbstract;
import com.retiantonio.onlineforum.model.Vote;
import com.retiantonio.onlineforum.repository.UserRepository;
import com.retiantonio.onlineforum.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final UserRepository userRepository;

    private UserAbstract getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<VoteStatusResponse> getCurrentUserVotes() {
        UserAbstract user = getCurrentUser();
        return voteRepository.findByUser_Id(user.getId())
                .stream()
                .map(v -> new VoteStatusResponse(v.getPost().getId(), v.getDirection()))
                .toList();
    }
}
