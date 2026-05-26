# 📚 Softawre Design - 2026

# Project: Mini-StackOverflow

## 👤 Student Information

- **Name:** Reti Antonio
- **GitHub Username:** @retiantonio
- **Group:** 30232

---

## 📈 Submission Table

- Update this table before each assignment submission.

| Milestone                    | Tag    | Submission Date |    Status    |
| :--------------------------- | :----- | :-------------- | :----------: |
| Project Deliverable 1        | `v1.0` | 30/03/2026      | 🟢 Submitted |
| Project Deliverable 2        | `v2.0` | 20/04/2026      | 🟢 Submitted |
| Project Deliverable 3        | `v3.0` | 10/05/2026      | 🟢 Submitted |
| Project Final Implementation | `v4.0` | 26/05/2026      | 🟢 Submitted |

> **Note:** To submit, make sure your work is pushed on the main branch, and create a tag

- `git tag -a v1.0 -m "project deliverable 1 completed"`
- `git push origin v1.0`
- Go to your repository on GitHub, click on the "Tags" tab. If you see v1.0, your submission is successful.

## 1. Project Description

**Mini-StackOverflow** is a full-stack web application that replicates core features of StackOverflow. It provides a platform where users can post questions, answer questions, vote on content, and moderators can manage the community by resolving reports and suspending users.

### Core Features:

- **User Authentication** - Secure registration and login with JWT tokens
- **Questions & Answers** - Users can create questions with categories and reply with answers (threaded replies)
- **Voting System** - Upvote/downvote questions and answers to highlight quality content
- **Reporting System** - Users can report inappropriate posts for moderation review
- **Moderation Dashboard** - Moderators can:
  - View pending and resolved reports with post content
  - Delete reported posts
  - Suspend users for specific durations
  - Manage activity logs
  - Create and manage post categories
- **Unified Search** - Search questions by keyword (title, body) or by category name
- **Answer Threading** - Nested replies with cascade deletion
- **Responsive UI** - Dark-themed, modern interface with smooth animations

## 2. Technologies Used

- **Backend:**
  - Java 17 with Spring Boot 3.x
  - Spring Security with JWT authentication
  - Spring Data JPA with Hibernate
  - PostgreSQL database
- **Frontend:**
  - React 18 with Vite
  - React Router for navigation
  - Axios for HTTP requests
  - Lucide React for icons
  - CSS with custom styling
- **Tools:**
  - Maven for backend build
  - npm for frontend dependencies
  - Git for version control
  - Docker (optional for deployment)

## 3. Setup and Installation

### Prerequisites:

- Java 17 or higher
- Node.js 16+ and npm
- PostgreSQL 12+
- Maven 3.8+
- Git

### Installation:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/retiantonio/project-retiantonio.git
   cd project-retiantonio
   ```

2. **Backend Setup:**

   ```bash
   cd src/onlineforum
   # Update application.properties with your PostgreSQL credentials
   mvn clean install
   mvn spring-boot:run
   ```

   Backend runs on `http://localhost:8080`

3. **Frontend Setup:**

   ```bash
   cd src/react-frontend/forum-client-frontend
   npm install
   npm run dev
   ```

   Frontend runs on `http://localhost:5173`

4. **Database Setup:**
   - Create a PostgreSQL database: `onlineforum`
   - Schema will be auto-created by Hibernate on first run
   - Default connection: `localhost:5432/onlineforum`

## 4. Execution

1. **Start the Backend:**

   ```bash
   cd src/onlineforum
   mvn spring-boot:run
   ```

   Wait for: `Started OnlineforumApplication` message

2. **Start the Frontend:**

   ```bash
   cd src/react-frontend/forum-client-frontend
   npm run dev
   ```

   Navigate to `http://localhost:5173` in your browser

3. **Create an Account:**
   - Click "Sign Up" on the homepage
   - Enter username and password
   - Login with your credentials

4. **Test Features:**
   - Create a question in a category
   - View the question feed with filters
   - Search for questions by keyword or category
   - Post answers to questions
   - Vote on questions/answers
   - Report inappropriate content (if moderator, visit `/moderator` to manage reports)

## 5. Execution Screenshots

The application features a dark-themed, modern UI with the following pages:

- **Home Page** - Question feed with search and filters by category
- **Question Page** - Detailed view with answers, voting, and threading
- **Auth Pages** - Login and registration forms
- **Moderator Dashboard** - Reports management, user suspension, category management
- **Activity Logs** - Moderation action tracking

Screenshots can be added by placing images in `docs/screenshots/` directory.

## 6. Known Issues & Future Improvements

### Known Issues:

- Real-time notifications not yet implemented
- No email verification for new accounts
- Search results limited to 100 results
- No pagination on large result sets

### Future Improvements:

- WebSocket integration for real-time notifications and chat
- Email verification and password reset
- User reputation system
- Advanced search with filters (date, author, upvotes)
- Markdown support in question/answer text
- Bulk moderation actions
- User profile pages with stats
- Answer acceptance system
- Question bounty system
