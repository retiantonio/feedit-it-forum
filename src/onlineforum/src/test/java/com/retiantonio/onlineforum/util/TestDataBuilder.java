package com.retiantonio.onlineforum.util;

import com.retiantonio.onlineforum.model.*;
import net.bytebuddy.asm.Advice;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Test Data Builder - Utility class for creating test data objects
 * Provides factory methods and builders for consistent test data creation
 */
public class TestDataBuilder {

    // User Builders
    public static RegularUserBuilder regularUser() {
        return new RegularUserBuilder();
    }

    public static ModeratorBuilder moderator() {
        return new ModeratorBuilder();
    }

    // Post Builders
    public static QuestionBuilder question() {
        return new QuestionBuilder();
    }

    public static AnswerBuilder answer() {
        return new AnswerBuilder();
    }

    // Entity Builders
    public static CategoryBuilder category() {
        return new CategoryBuilder();
    }

    public static VoteBuilder vote() {
        return new VoteBuilder();
    }

    public static ReportBuilder report() {
        return new ReportBuilder();
    }

    public static ActivityLogBuilder activityLog() {
        return new ActivityLogBuilder();
    }

    // Regular User Builder
    public static class RegularUserBuilder {
        private Long id = 1L;
        private String username = "testuser";
        private String email = "test@example.com";
        private String password = "hashedPassword";
        private LocalDateTime suspendedUntil = null;

        public RegularUserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public RegularUserBuilder username(String username) {
            this.username = username;
            return this;
        }

        public RegularUserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public RegularUserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public RegularUserBuilder suspendedUntil(LocalDateTime suspendedUntil) {
            this.suspendedUntil = suspendedUntil;
            return this;
        }

        public RegularUser build() {
            RegularUser user = new RegularUser();
            user.setId(id);
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(password);
            if (suspendedUntil != null) {
                user.setSuspendedUntil(suspendedUntil);
            }
            return user;
        }
    }

    // Moderator Builder
    public static class ModeratorBuilder {
        private Long id = 1L;
        private String username = "moderator";
        private String email = "mod@example.com";
        private String password = "hashedPassword";

        public ModeratorBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ModeratorBuilder username(String username) {
            this.username = username;
            return this;
        }

        public ModeratorBuilder email(String email) {
            this.email = email;
            return this;
        }

        public ModeratorBuilder password(String password) {
            this.password = password;
            return this;
        }

        public Moderator build() {
            Moderator mod = new Moderator();
            mod.setId(id);
            mod.setUsername(username);
            mod.setEmail(email);
            mod.setPassword(password);
            return mod;
        }
    }

    // Question Builder
    public static class QuestionBuilder {
        private Long id = 1L;
        private String title = "Test Question";
        private String body = "Test body";
        private UserAbstract owner = regularUser().build();
        private int votes = 0;
        private boolean flagged = false;
        private List<Category> categories = new ArrayList<>();
        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt = LocalDateTime.now();

        public QuestionBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public QuestionBuilder title(String title) {
            this.title = title;
            return this;
        }

        public QuestionBuilder body(String body) {
            this.body = body;
            return this;
        }

        public QuestionBuilder owner(UserAbstract owner) {
            this.owner = owner;
            return this;
        }

        public QuestionBuilder votes(int votes) {
            this.votes = votes;
            return this;
        }

        public QuestionBuilder flagged(boolean flagged) {
            this.flagged = flagged;
            return this;
        }

        public QuestionBuilder categories(List<Category> categories) {
            this.categories = categories;
            return this;
        }

        public QuestionBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public QuestionBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Question build() {
            Question question = new Question();
            question.setId(id);
            question.setTitle(title);
            question.setBody(body);
            question.setOwner(owner);
            question.setVotes(votes);
            question.setFlagged(flagged);
            question.setCategories(categories);
            question.setCreatedAt(createdAt);
            question.setUpdatedAt(updatedAt);
            return question;
        }
    }

    // Answer Builder
    public static class AnswerBuilder {
        private Long id = 1L;
        private String body = "Test answer";
        private UserAbstract owner = regularUser().build();
        private PostAbstract parentPost;
        private int votes = 0;
        private boolean flagged = false;
        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt = LocalDateTime.now();

        public AnswerBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AnswerBuilder body(String body) {
            this.body = body;
            return this;
        }

        public AnswerBuilder owner(UserAbstract owner) {
            this.owner = owner;
            return this;
        }

        public AnswerBuilder parentPost(PostAbstract parentPost) {
            this.parentPost = parentPost;
            return this;
        }

        public AnswerBuilder votes(int votes) {
            this.votes = votes;
            return this;
        }

        public AnswerBuilder flagged(boolean flagged) {
            this.flagged = flagged;
            return this;
        }

        public Answer build() {
            Answer answer = new Answer();
            answer.setId(id);
            answer.setBody(body);
            answer.setOwner(owner);
            answer.setParentPost(parentPost);
            answer.setVotes(votes);
            answer.setFlagged(flagged);
            answer.setCreatedAt(createdAt);
            answer.setUpdatedAt(updatedAt);
            return answer;
        }
    }

    // Category Builder
    public static class CategoryBuilder {
        private Long id = 1L;
        private String name = "Java";
        private String color = "#FF5733";

        public CategoryBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CategoryBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CategoryBuilder color(String color) {
            this.color = color;
            return this;
        }

        public Category build() {
            Category category = new Category();
            category.setId(id);
            category.setName(name);
            category.setColor(color);
            return category;
        }
    }

    // Vote Builder
    public static class VoteBuilder {
        private Long id = 1L;
        private UserAbstract user = regularUser().build();
        private PostAbstract post;
        private int direction = 1;

        public VoteBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public VoteBuilder user(UserAbstract user) {
            this.user = user;
            return this;
        }

        public VoteBuilder post(PostAbstract post) {
            this.post = post;
            return this;
        }

        public VoteBuilder direction(int direction) {
            this.direction = direction;
            return this;
        }

        public Vote build() {
            Vote vote = new Vote();
            vote.setId(id);
            vote.setUser(user);
            vote.setPost(post);
            vote.setDirection(direction);
            return vote;
        }
    }

    // Report Builder
    public static class ReportBuilder {
        private Long id = 1L;
        private PostAbstract reportedPost;
        private UserAbstract reporter = regularUser().build();
        private String reason = "Inappropriate content";
        private boolean resolved = false;
        private LocalDateTime reportedAt = LocalDateTime.now();

        public ReportBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ReportBuilder reportedPost(PostAbstract reportedPost) {
            this.reportedPost = reportedPost;
            return this;
        }

        public ReportBuilder reporter(UserAbstract reporter) {
            this.reporter = reporter;
            return this;
        }

        public ReportBuilder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public ReportBuilder resolved(boolean resolved) {
            this.resolved = resolved;
            return this;
        }

        public ReportBuilder reportedAt(LocalDateTime reportedAt) {
            this.reportedAt = reportedAt;
            return this;
        }

        public Report build() {
            Report report = new Report();
            report.setId(id);
            report.setReportedPost(reportedPost);
            report.setReporter(reporter);
            report.setReason(reason);
            report.setResolved(resolved);
            report.setReportedAt(reportedAt);
            return report;
        }
    }

    // Activity Log Builder
    public static class ActivityLogBuilder {
        private Long id = 1L;
        private Moderator owner = moderator().build();
        private String action = "DELETED_POST";
        private String targetType = "Question";
        private Long targetId = 1L;
        private LocalDateTime timestamp = LocalDateTime.now();

        public ActivityLogBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ActivityLogBuilder owner(Moderator owner) {
            this.owner = owner;
            return this;
        }

        public ActivityLogBuilder action(String action) {
            this.action = action;
            return this;
        }

        public ActivityLogBuilder targetType(String targetType) {
            this.targetType = targetType;
            return this;
        }

        public ActivityLogBuilder targetId(Long targetId) {
            this.targetId = targetId;
            return this;
        }

        public ActivityLogBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public ActivityLog build() {
            ActivityLog log = new ActivityLog();
            log.setId(id);
            log.setOwner(owner);
            log.setAction(action);
            log.setTargetType(targetType);
            log.setTargetId(targetId);
            log.setTimestamp(timestamp);
            return log;
        }
    }

    // Convenient factory methods for common scenarios
    public static List<Question> createQuestionList(int count) {
        List<Question> questions = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            questions.add(question()
                .id((long) i)
                .title("Question " + i)
                .build());
        }
        return questions;
    }

    public static List<Answer> createAnswerList(int count, PostAbstract parent) {
        List<Answer> answers = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            answers.add(answer()
                .id((long) i)
                .body("Answer " + i)
                .parentPost(parent)
                .build());
        }
        return answers;
    }

    public static List<Category> createCategoryList(int count) {
        List<Category> categories = new ArrayList<>();
        String[] names = {"Java", "Python", "JavaScript", "C++", "Go"};
        String[] colors = {"#FF5733", "#0066FF", "#33FF57", "#FF33F5", "#FFD700"};
        for (int i = 0; i < count && i < names.length; i++) {
            categories.add(category()
                .id((long) (i + 1))
                .name(names[i])
                .color(colors[i])
                .build());
        }
        return categories;
    }
}
