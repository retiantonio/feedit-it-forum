package com.retiantonio.onlineforum.service;

import com.retiantonio.onlineforum.dtos.request.QuestionRequest;
import com.retiantonio.onlineforum.dtos.response.QuestionResponse;
import com.retiantonio.onlineforum.exceptions.ResourceNotFoundException;
import com.retiantonio.onlineforum.exceptions.UnauthorizedException;
import com.retiantonio.onlineforum.model.Category;
import com.retiantonio.onlineforum.model.Question;
import com.retiantonio.onlineforum.model.UserAbstract;
import com.retiantonio.onlineforum.model.Vote;
import com.retiantonio.onlineforum.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final VoteRepository voteRepository;
    private final CategoryRepository categoryRepository;

    private UserAbstract getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private QuestionResponse toResponse(Question q) {
        QuestionResponse res = new QuestionResponse();
        res.setId(q.getId());
        res.setTitle(q.getTitle());
        res.setBody(q.getBody());

        res.setVotes(q.getVotes());
        res.setFlagged(q.isFlagged());
        res.setCategoryIds(q.getCategories().stream().map(Category::getId).toList());

        res.setOwnerUsername(q.getOwner().getUsername());
        res.setOwnerId(q.getOwner().getId());

        res.setAnswerCount(answerRepository.countByParentPostId(q.getId()));

        res.setCreatedAt(q.getCreatedAt());
        res.setUpdatedAt(q.getUpdatedAt());
        return res;
    }

    public QuestionResponse create(QuestionRequest request) {
        Question question = new Question();
        question.setTitle(request.getTitle());
        question.setBody(request.getBody());

        List<Category> categories = new ArrayList<>(request.getCategoryIds()
                .stream()
                .map(id -> categoryRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id)))
                .toList());

        question.setCategories(categories);

        question.setOwner(getCurrentUser());
        return toResponse(questionRepository.save(question));
    }

    public List<QuestionResponse> getAll() {
        return questionRepository.findAll()
                .stream().map(this::toResponse).toList();
    }

    public QuestionResponse getById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        return toResponse(question);
    }

    public List<QuestionResponse> search(String keyword) {
        return questionRepository.findByTitleContainingIgnoreCase(keyword)
                .stream().map(this::toResponse).toList();
    }

    public List<QuestionResponse> unifiedSearch(String keyword) {
        List<Question> keywordResults = questionRepository.findByTitleContainingIgnoreCase(keyword);
        List<Question> bodyResults = questionRepository.findByBodyContainingIgnoreCase(keyword);

        List<Category> matchingCategories = categoryRepository.findByNameContainingIgnoreCase(keyword);
        List<Question> categoryResults = new ArrayList<>();
        for (Category cat : matchingCategories) {
            categoryResults.addAll(questionRepository.findByCategoriesContaining(cat));
        }

        return Stream.of(keywordResults, bodyResults, categoryResults)
                .flatMap(Collection::stream)
                .distinct()
                .map(this::toResponse)
                .toList();
    }

    public List<QuestionResponse> getByCategory(Category category) {
        return questionRepository.findByCategoriesContaining(category)
                .stream().map(this::toResponse).toList();
    }

    public QuestionResponse update(Long id, QuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        UserAbstract currentUser = getCurrentUser();
        if (!question.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only edit your own questions");
        }

        question.setTitle(request.getTitle());
        question.setBody(request.getBody());

        List<Category> categories = new ArrayList<>(request.getCategoryIds()
                .stream()
                .map(catId -> categoryRepository.findById(catId)
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id)))
                .toList());

        question.setCategories(categories);

        question.setUpdatedAt(LocalDateTime.now());
        return toResponse(questionRepository.save(question));
    }

    public void delete(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        UserAbstract currentUser = getCurrentUser();
        if (!question.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only delete your own questions");
        }

        questionRepository.delete(question);
    }

    public QuestionResponse vote(Long id, int direction) {
        UserAbstract currentUser = getCurrentUser();

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        Optional<Vote> existingVote = voteRepository.findByUser_IdAndPost_Id(
                currentUser.getId(), id);

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            if (vote.getDirection() == direction) {
                question.setVotes(question.getVotes() - direction);
                voteRepository.delete(vote);
            } else {
                question.setVotes(question.getVotes() - vote.getDirection() + direction);
                vote.setDirection(direction);
                voteRepository.save(vote);
            }
        } else {
            Vote vote = new Vote();
            vote.setUser(currentUser);
            vote.setPost(question);
            vote.setDirection(direction);
            voteRepository.save(vote);
            question.setVotes(question.getVotes() + direction);
        }

        return toResponse(questionRepository.save(question));
    }
}