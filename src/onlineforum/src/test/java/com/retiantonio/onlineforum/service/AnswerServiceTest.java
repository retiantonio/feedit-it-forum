package com.retiantonio.onlineforum.service;

import com.retiantonio.onlineforum.dtos.request.AnswerRequest;
import com.retiantonio.onlineforum.dtos.response.AnswerResponse;
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
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AnswerService Tests")
class AnswerServiceTest {

    @Mock private AnswerRepository answerRepository;
    @Mock private PostAbstractRepository postAbstractRepository;
    @Mock private UserRepository userRepository;
    @Mock private VoteRepository voteRepository;
    @Mock private SecurityContext securityContext;
    @Mock private Authentication authentication;

    @InjectMocks private AnswerService answerService;

    private Answer answer;
    private Question parentQuestion;
    private RegularUser user;
    private RegularUser otherUser;
    private AnswerRequest answerRequest;

    @BeforeEach
    void setUp() {
        user = new RegularUser();
        user.setId(1L);
        user.setUsername("testuser");

        otherUser = new RegularUser();
        otherUser.setId(2L);
        otherUser.setUsername("otheruser");

        parentQuestion = new Question();
        parentQuestion.setId(1L);
        parentQuestion.setTitle("How to use Streams?");
        parentQuestion.setOwner(user);

        answer = new Answer();
        answer.setId(1L);
        answer.setBody("You can use Streams like this...");
        answer.setOwner(user);
        answer.setParentPost(parentQuestion);
        answer.setVotes(2);
        answer.setCreatedAt(LocalDateTime.now());
        answer.setUpdatedAt(LocalDateTime.now());

        answerRequest = new AnswerRequest();
        answerRequest.setBody("You can use Streams like this...");
    }

    private void mockSecurityContext(String username) {
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn(username);
        when(securityContext.getAuthentication()).thenReturn(authentication);
    }

    private void stubReplyCount() {
        when(answerRepository.countByParentPostId(any())).thenReturn(0);
    }

    @Test
    @DisplayName("Should successfully create a new answer to a question")
    void testCreateAnswerToQuestion_Success() {
        mockSecurityContext("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(postAbstractRepository.findById(1L)).thenReturn(Optional.of(parentQuestion));
        when(answerRepository.save(any(Answer.class))).thenAnswer(inv -> {
            Answer a = inv.getArgument(0);
            a.setId(1L);
            return a;
        });
        stubReplyCount();

        AnswerResponse response = answerService.create(1L, answerRequest);

        assertNotNull(response);
        assertEquals("You can use Streams like this...", response.getBody());
        assertEquals("testuser", response.getOwnerUsername());
        verify(answerRepository, times(1)).save(any(Answer.class));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when parent post not found")
    void testCreateAnswerParentNotFound_ThrowsException() {
        // no mockSecurityContext needed if postRepository is checked first
        when(postAbstractRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> answerService.create(999L, answerRequest));
    }

    @Test
    @DisplayName("Should retrieve all answers for a parent post")
    void testGetAnswersByParentPost_Success() {
        when(answerRepository.findByParentPost_Id(1L)).thenReturn(List.of(answer));
        stubReplyCount();

        List<AnswerResponse> responses = answerService.getByParentPost(1L);

        assertNotNull(responses);
        assertEquals(1, responses.size());
    }

    @Test
    @DisplayName("Should successfully update an answer by owner")
    void testUpdateAnswer_Success() {
        mockSecurityContext("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(answerRepository.findById(1L)).thenReturn(Optional.of(answer));
        when(answerRepository.save(any(Answer.class))).thenAnswer(inv -> inv.getArgument(0));
        stubReplyCount();

        answerRequest.setBody("Updated answer content here.");
        AnswerResponse response = answerService.update(1L, answerRequest);

        assertNotNull(response);
        assertEquals("Updated answer content here.", response.getBody());
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when non-owner tries to update")
    void testUpdateAnswerUnauthorized_ThrowsException() {
        mockSecurityContext("otheruser");
        when(userRepository.findByUsername("otheruser")).thenReturn(Optional.of(otherUser));
        when(answerRepository.findById(1L)).thenReturn(Optional.of(answer));

        assertThrows(UnauthorizedException.class,
                () -> answerService.update(1L, answerRequest));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when updating non-existent answer")
    void testUpdateAnswerNotFound_ThrowsException() {
        // no mockSecurityContext needed if findById is checked first
        when(answerRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> answerService.update(999L, answerRequest));
    }

    @Test
    @DisplayName("Should successfully delete an answer by owner")
    void testDeleteAnswer_Success() {
        mockSecurityContext("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(answerRepository.findById(1L)).thenReturn(Optional.of(answer));

        answerService.delete(1L);

        verify(answerRepository, times(1)).delete(answer); // delete(entity) not deleteById
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when non-owner tries to delete")
    void testDeleteAnswerUnauthorized_ThrowsException() {
        mockSecurityContext("otheruser");
        when(userRepository.findByUsername("otheruser")).thenReturn(Optional.of(otherUser));
        when(answerRepository.findById(1L)).thenReturn(Optional.of(answer));

        assertThrows(UnauthorizedException.class,
                () -> answerService.delete(1L));

        verify(answerRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Should handle voting on answer — new vote")
    void testVoteAnswer_Success() {
        mockSecurityContext("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(answerRepository.findById(1L)).thenReturn(Optional.of(answer));
        when(voteRepository.findByUser_IdAndPost_Id(1L, 1L)).thenReturn(Optional.empty());
        answer.setVotes(2);
        when(answerRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        stubReplyCount();

        AnswerResponse response = answerService.vote(1L, 1);

        assertNotNull(response);
        assertEquals(3, response.getVotes()); // 2 + 1
    }

    @Test
    @DisplayName("Should remove vote when voting same direction again")
    void testRemoveVote_Success() {
        mockSecurityContext("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(answerRepository.findById(1L)).thenReturn(Optional.of(answer));

        Vote existingVote = new Vote();
        existingVote.setDirection(1);
        when(voteRepository.findByUser_IdAndPost_Id(1L, 1L))
                .thenReturn(Optional.of(existingVote));

        answer.setVotes(2);
        when(answerRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        stubReplyCount();

        AnswerResponse response = answerService.vote(1L, 1);

        assertNotNull(response);
        assertEquals(1, response.getVotes()); // 2 - 1 (cancelled)
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when voting on non-existent answer")
    void testVoteAnswerNotFound_ThrowsException() {
        mockSecurityContext("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(answerRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> answerService.vote(999L, 1));
    }
}