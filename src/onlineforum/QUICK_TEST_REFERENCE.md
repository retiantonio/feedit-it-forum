# Quick Test Reference

## 🚀 Most Common Commands

### Run All Tests

```bash
cd src/onlineforum
mvn test
```

### Run & See All Output

```bash
mvn test -X
```

### Run Single Test Class

```bash
mvn test -Dtest=AuthServiceTest
mvn test -Dtest=QuestionServiceTest
mvn test -Dtest=AnswerServiceTest
mvn test -Dtest=CategoryServiceTest
mvn test -Dtest=ReportServiceTest
mvn test -Dtest=ModeratorServiceTest
```

### Run Single Test Method

```bash
mvn test -Dtest=AuthServiceTest#testRegisterNewRegularUser_Success
```

### Run All Service Tests

```bash
mvn test -Dtest=*ServiceTest
```

### Run Controller Tests

```bash
mvn test -Dtest=*Controller*
```

### Run Repository Tests

```bash
mvn test -Dtest=RepositoryIntegrationTests
```

### Generate Coverage Report

```bash
mvn test jacoco:report
# Open in browser: target/site/jacoco/index.html
```

### Skip Tests During Build

```bash
mvn clean install -DskipTests
```

### Parallel Test Execution (Faster)

```bash
mvn test -Dparallelism=4
```

## 📊 Test Organization

### Service Layer Tests (102 tests total)

- AuthServiceTest (10)
- QuestionServiceTest (13)
- AnswerServiceTest (13)
- CategoryServiceTest (12)
- ReportServiceTest (12)
- VoteAndActivityLogServiceTest (14)
- ModeratorServiceTest (18)

### Controller Tests (25+)

- AuthController
- QuestionController
- AnswerController
- CategoryController
- VoteController
- ReportController
- ModeratorController

### Repository Tests (25+)

- UserRepository
- QuestionRepository
- AnswerRepository
- CategoryRepository
- VoteRepository
- ReportRepository

### Exception Tests (9)

- ResourceNotFoundException
- UnauthorizedException
- AlreadyExistsException
- AccountSuspendedException

## 🎯 Test Coverage by Feature

### Authentication

```bash
mvn test -Dtest=AuthServiceTest
```

### Questions (CRUD, Search)

```bash
mvn test -Dtest=QuestionServiceTest
mvn test -Dtest=QuestionController*
```

### Answers (Nested replies, Voting)

```bash
mvn test -Dtest=AnswerServiceTest
mvn test -Dtest=AnswerController*
```

### Categories

```bash
mvn test -Dtest=CategoryServiceTest
mvn test -Dtest=CategoryController*
```

### Reports & Moderation

```bash
mvn test -Dtest=ReportServiceTest
mvn test -Dtest=ModeratorServiceTest
mvn test -Dtest=ModeratorController*
```

### Voting & Activity

```bash
mvn test -Dtest=VoteAndActivityLogServiceTest
mvn test -Dtest=VoteController*
```

## 📁 Test File Locations

```
Tests Directory: src/onlineforum/src/test/java/com/retiantonio/onlineforum/

service/
  ├── AuthServiceTest.java
  ├── QuestionServiceTest.java
  ├── AnswerServiceTest.java
  ├── CategoryServiceTest.java
  ├── ReportServiceTest.java
  ├── VoteAndActivityLogServiceTest.java
  └── ModeratorServiceTest.java

controller/
  └── ControllerIntegrationTests.java

repository/
  └── RepositoryIntegrationTests.java

exception/
  └── ExceptionHandlingTests.java

util/
  └── TestDataBuilder.java

Documentation:
  ├── TESTING_GUIDE.md
  └── TEST_GENERATION_SUMMARY.md
```

## 🔍 IDE Integration

### VS Code / Intellij IDEA

- Right-click on test class → Run Tests
- Right-click on test method → Run Test
- Use built-in Test Explorer

### Maven from IDE

1. Open Terminal
2. Run: `mvn test`

## 📈 Expected Results

Successful test run output:

```
[INFO] -------------------------------------------------------
[INFO] T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.retiantonio.onlineforum.service.AuthServiceTest
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.retiantonio.onlineforum.service.QuestionServiceTest
[INFO] Tests run: 13, Failures: 0, Errors: 0, Skipped: 0
...
[INFO] -------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] Total time: 15.234 s
```

## 🐛 Troubleshooting

### Tests won't compile

```bash
mvn clean
mvn test
```

### Port already in use

- WebMvcTest doesn't start a server, so this shouldn't happen

### Out of memory

```bash
export MAVEN_OPTS="-Xmx1024m"
mvn test
```

### Need to update dependencies

```bash
mvn clean install
mvn test
```

## 📊 Performance Targets

- Average test: ~60ms
- Fastest: ~5ms (unit tests)
- Slowest: ~500ms (integration tests)
- Total suite: 5-10 seconds

## 🎓 Test Naming Pattern

All tests follow: `test[Feature]_[Scenario]`

Examples:

- `testRegisterNewRegularUser_Success`
- `testGetQuestionById_Success`
- `testUpdateAnswerUnauthorized_ThrowsException`
- `testDeleteCategoryWithQuestions_ThrowsException`

## 📖 Documentation Files

1. **TESTING_GUIDE.md** - Complete testing documentation
2. **TEST_GENERATION_SUMMARY.md** - Generation summary
3. **This file** - Quick reference

## 💡 Tips

- Use Mockito for mocking services
- Use MockMvc for testing REST endpoints
- Use @DataJpaTest for repository testing
- Check test data builder for consistent test objects
- All tests are independent and can run in any order

## 🔧 Build Profile

Tests use default Spring Boot test profile. To use custom profile:

```bash
mvn test -Dspring.profiles.active=test
```

## 📞 Support

For detailed information:

- See TESTING_GUIDE.md
- Check individual test classes
- Review TestDataBuilder.java for test object creation
- Consult Spring Boot Testing documentation
