package com.retiantonio.onlineforum.service;

import com.retiantonio.onlineforum.dtos.request.QuestionRequest;
import com.retiantonio.onlineforum.dtos.response.QuestionResponse;
import com.retiantonio.onlineforum.exceptions.ResourceNotFoundException;
import com.retiantonio.onlineforum.exceptions.UnauthorizedException;
import com.retiantonio.onlineforum.model.*;
import com.retiantonio.onlineforum.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("QuestionService Tests")
class QuestionServiceTest {

    @Mock private QuestionRepository questionRepository;
    @Mock private UserRepository userRepository;
    @Mock private AnswerRepository answerRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private VoteRepository voteRepository;
    @Mock private SecurityContext securityContext;
    @Mock private Authentication authentication;

    @InjectMocks private QuestionService questionService;

    private Question question;
    private RegularUser user;
    private RegularUser otherUser;
    private QuestionRequest questionRequest;
    private Category category;

    @BeforeEach
    void setUp() {
        user = new RegularUser();
        user.setId(1L);
        user.setUsername("testuser");

        otherUser = new RegularUser();
        otherUser.setId(2L);
        otherUser.setUsername("otheruser");

        category = new Category();
        category.setId(1L);
        category.setName("Java");
        category.setColor("#FF5733");

        question = new Question();
        question.setId(1L);
        question.setTitle("How to use Streams?");
        question.setBody("I want to learn how to use Java Streams...");
        question.setOwner(user);
        question.setVotes(5);
        question.setFlagged(false);
        question.setCategories(new ArrayList<>(List.of(category)));
        question.setCreatedAt(LocalDateTime.now());
        question.setUpdatedAt(LocalDateTime.now());

        questionRequest = new QuestionRequest();
        questionRequest.setTitle("How to use Streams?");
        questionRequest.setBody("I want to learn how to use Java Streams...");
        questionRequest.setCategoryIds(new ArrayList<>(List.of(1L)));
    }

    private void mockSecurityContext(String username) {
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn(username);
        when(securityContext.getAuthentication()).thenReturn(authentication);
    }

    private void stubAnswerCount() {
        when(answerRepository.countByParentPostId(any())).thenReturn(0);
    }

    @Test
    @DisplayName("Should successfully create a new question")
    void testCreateQuestion_Success() {
        mockSecurityContext("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(questionRepository.save(any(Question.class))).thenAnswer(inv -> {
            Question q = inv.getArgument(0);
            q.setId(1L);
            return q;
        });
        stubAnswerCount();

        QuestionResponse response = questionService.create(questionRequest);

        assertNotNull(response);
        assertEquals("How to use Streams?", response.getTitle());
        assertEquals("testuser", response.getOwnerUsername());
        verify(questionRepository, times(1)).save(any(Question.class));
    }

    @Test
    @DisplayName("Should retrieve all questions")
    void testGetAllQuestions_Success() {
        when(questionRepository.findAll()).thenReturn(List.of(question));
        stubAnswerCount();

        List<QuestionResponse> responses = questionService.getAll();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("How to use Streams?", responses.get(0).getTitle());
    }

    @Test
    @DisplayName("Should retrieve question by ID")
    void testGetQuestionById_Success() {
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        stubAnswerCount();

        QuestionResponse response = questionService.getById(1L);

        assertNotNull(response);
        assertEquals("How to use Streams?", response.getTitle());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when question not found")
    void testGetQuestionByIdNotFound_ThrowsException() {
        when(questionRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> questionService.getById(999L));
    }

    @Test
    @DisplayName("Should search questions by keyword in title")
    void testSearchQuestionsByTitle_Success() {
        when(questionRepository.findByTitleContainingIgnoreCase("Streams"))
                .thenReturn(List.of(question));
        stubAnswerCount();

        List<QuestionResponse> responses = questionService.search("Streams");

        assertNotNull(responses);
        assertEquals(1, responses.size());
    }

    @Test
    @DisplayName("Should update question successfully by owner")
    void testUpdateQuestion_Success() {
        mockSecurityContext("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(questionRepository.save(any(Question.class))).thenAnswer(inv -> inv.getArgument(0));
        stubAnswerCount();

        questionRequest.setTitle("Updated Title");
        QuestionResponse response = questionService.update(1L, questionRequest);

        assertNotNull(response);
        assertEquals("Updated Title", response.getTitle());
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when non-owner tries to update")
    void testUpdateQuestionUnauthorized_ThrowsException() {
        mockSecurityContext("otheruser");
        when(userRepository.findByUsername("otheruser")).thenReturn(Optional.of(otherUser));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));

        assertThrows(UnauthorizedException.class,
                () -> questionService.update(1L, questionRequest));
    }

    @Test
    @DisplayName("Should delete question successfully by owner")
    void testDeleteQuestion_Success() {
        mockSecurityContext("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));

        questionService.delete(1L);

        verify(questionRepository, times(1)).delete(question);
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when non-owner tries to delete")
    void testDeleteQuestionUnauthorized_ThrowsException() {
        mockSecurityContext("otheruser");
        when(userRepository.findByUsername("otheruser")).thenReturn(Optional.of(otherUser));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));

        assertThrows(UnauthorizedException.class,
                () -> questionService.delete(1L));

        verify(questionRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Should handle voting on question")
    void testVoteQuestion_Success() {
        mockSecurityContext("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(voteRepository.findByUser_IdAndPost_Id(1L, 1L)).thenReturn(Optional.empty());
        question.setVotes(5);
        when(questionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        stubAnswerCount();

        QuestionResponse response = questionService.vote(1L, 1);

        assertNotNull(response);
        assertEquals(6, response.getVotes());
    }

    @Test
    @DisplayName("Should get questions by category")
    void testGetQuestionsByCategory_Success() {
        when(questionRepository.findByCategoriesContaining(category))
                .thenReturn(List.of(question));
        stubAnswerCount();

        List<QuestionResponse> responses = questionService.getByCategory(category);

        assertNotNull(responses);
        assertEquals(1, responses.size());
    }

    @Test
    @DisplayName("Should return empty list when no questions match search")
    void testSearch_NoResults() {
        when(questionRepository.findByTitleContainingIgnoreCase("NonExistent"))
                .thenReturn(new ArrayList<>());

        List<QuestionResponse> responses = questionService.search("NonExistent");

        assertNotNull(responses);
        assertEquals(0, responses.size());
    }
}