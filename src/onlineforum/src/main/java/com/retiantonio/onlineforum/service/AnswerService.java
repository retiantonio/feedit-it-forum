package com.retiantonio.onlineforum.service;

import com.retiantonio.onlineforum.dtos.request.AnswerRequest;
import com.retiantonio.onlineforum.dtos.response.AnswerResponse;
import com.retiantonio.onlineforum.exceptions.ResourceNotFoundException;
import com.retiantonio.onlineforum.exceptions.UnauthorizedException;
import com.retiantonio.onlineforum.model.*;
import com.retiantonio.onlineforum.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final PostAbstractRepository postRepository;
    private final VoteRepository voteRepository;

    private UserAbstract getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AnswerResponse toResponse(Answer a) {
        AnswerResponse res = new AnswerResponse();
        res.setId(a.getId());
        res.setBody(a.getBody());
        res.setVotes(a.getVotes());
        res.setFlagged(a.isFlagged());

        res.setOwnerUsername(a.getOwner().getUsername());
        res.setOwnerId(a.getOwner().getId());

        res.setParentPostId(a.getParentPost().getId());
        res.setParentPostType(
                a.getParentPost() instanceof Question ? "QUESTION" : "ANSWER"
        );

        res.setReplyCount(answerRepository.countByParentPostId(a.getId()));

        res.setCreatedAt(a.getCreatedAt());
        res.setUpdatedAt(a.getUpdatedAt());
        return res;
    }

    public AnswerResponse create(Long parentPostId, AnswerRequest request) {
        PostAbstract parentPost = postRepository.findById(parentPostId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        Answer answer = new Answer();
        answer.setBody(request.getBody());
        answer.setParentPost(parentPost);
        answer.setOwner(getCurrentUser());
        return toResponse(answerRepository.save(answer));
    }

    public List<AnswerResponse> getByParentPost(Long parentPostId) {
        return answerRepository.findByParentPost_Id(parentPostId)
                .stream().map(this::toResponse).toList();
    }

    public AnswerResponse update(Long id, AnswerRequest request) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found"));

        UserAbstract currentUser = getCurrentUser();
        if (!answer.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only edit your own answers");
        }

        answer.setBody(request.getBody());
        answer.setUpdatedAt(LocalDateTime.now());
        return toResponse(answerRepository.save(answer));
    }

    public void delete(Long id) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found"));

        UserAbstract currentUser = getCurrentUser();
        if (!answer.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only delete your own answers");
        }

        answerRepository.delete(answer);
    }

    public AnswerResponse vote(Long id, int direction) {
        UserAbstract currentUser = getCurrentUser();

        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found"));

        Optional<Vote> existingVote = voteRepository.findByUser_IdAndPost_Id(
                currentUser.getId(), id);

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            if (vote.getDirection() == direction) {
                answer.setVotes(answer.getVotes() - direction);
                voteRepository.delete(vote);
            } else {
                answer.setVotes(answer.getVotes() - vote.getDirection() + direction);
                vote.setDirection(direction);
                voteRepository.save(vote);
            }
        } else {
            Vote vote = new Vote();
            vote.setUser(currentUser);
            vote.setPost(answer);
            vote.setDirection(direction);
            voteRepository.save(vote);
            answer.setVotes(answer.getVotes() + direction);
        }

        return toResponse(answerRepository.save(answer));
    }
}