# JobTrack - Full-Stack Job Application & Preparation Tracker

JobTrack is a complete, production-ready full-stack web application tailored for software engineering graduates and freshers. It streamlines the job-hunting journey by tracking job applications across hiring stages, scheduling interview rounds, alerting on recruiter follow-ups, logging daily technical study hours (Core Java, SQL, JDBC, Spring Boot), and presenting real-time performance analytics.

---

## 1. Problem Statement

Job seekers often struggle with:
- Managing multiple applications across LinkedIn, Naukri, and career portals on messy spreadsheets.
- Losing track of recruiter follow-up dates and interview rounds.
- Lacking visibility into their daily technical preparation consistency.
- Having no centralized metric dashboard showing active pipeline health.

**JobTrack** solves this by providing a dedicated, single-user dashboard with real-time MySQL persistence, clean RESTful APIs, and an intuitive light-theme UI.

---

## 2. Key Features

- **Real-Time Dashboard**:
  - Live metric cards (Total Applications, Applied This Week, In Interview, Offers Received, Follow-ups Due, Prep Hours).
  - Status distribution chart & weekly submission trends.
  - Follow-up alert banners (Overdue & Due Today).
  - Recent 5 applications and upcoming interview rounds.
- **Job Applications Management**:
  - Full CRUD: Create, read, edit, and delete job applications with confirmation dialogs.
  - Comprehensive attributes: Company, role, status, work mode (On-site, Hybrid, Remote), employment type, CTC range, recruiter contact, and prep notes.
  - Instant client search, multi-attribute filtering, and date sorting.
- **Interview Scheduling**:
  - Link interviews directly to specific applications.
  - Categorize by round: Online Assessment, Technical, HR, Managerial, Final, or Other.
  - Track mode (Online video, In-person, Phone), meeting URLs, locations, and preparation notes.
  - Categorized tabs: Upcoming, Past, and All rounds.
- **Recruiter Follow-up Management**:
  - Automated grouping: Overdue, Due Today, Upcoming, and Completed.
  - One-click toggle completion and timestamped note appending.
- **Preparation & Study Tracker**:
  - Log daily study sessions for freshers: Core Java, OOP, Data Structures, SQL, JDBC, Spring Boot, etc.
  - Automatic conversion between internal minutes and human-readable durations (e.g. `1 hr 30 mins`).
  - Total and weekly preparation hours tracking.
- **Analytics & Insights**:
  - Interactive charts (Recharts) visualizing pipeline share, monthly submission volume, and hours spent per technical subject.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18+ (Vite)
- **Styling**: Tailwind CSS (Tailwind v4) with light-theme SaaS palette
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios with centralized error interceptor

### Backend
- **Language**: Java 21 (LTS)
- **Framework**: Spring Boot 3.3.5
- **ORM / Persistence**: Spring Data JPA with Hibernate
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Min`, etc.)
- **Database Driver**: MySQL Connector/J (`com.mysql:mysql-connector-j`)
- **Architecture**: Layered architecture (Controller &rarr; Service &rarr; Repository &rarr; Database) with constructor injection

### Database
- **Engine**: MySQL / MariaDB (e.g., XAMPP or MySQL Server)
- **Database Name**: `jobtrack_db`
- **Port**: 3306

### Automated Testing
- **Unit & Integration Tests**: JUnit 5, Mockito, Spring Boot Test (`@SpringBootTest`, `MockMvc`)
- **In-Memory Test Database**: H2 Database (`MODE=MySQL`) for isolated test execution

---

## 4. Project Directory Structure

```
JobTrack/
├── .gitignore
├── README.md
├── LEARNING_GUIDE.md
├── backend/
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   ├── application.properties.example
│   └── src/
│       ├── main/
│       │   ├── java/com/jobtrack/
│       │   │   ├── JobTrackApplication.java
│       │   │   ├── config/
│       │   │   │   └── WebConfig.java
│       │   │   ├── controller/
│       │   │   │   ├── JobApplicationController.java
│       │   │   │   ├── InterviewController.java
│       │   │   │   ├── StudySessionController.java
│       │   │   │   ├── DashboardController.java
│       │   │   │   └── AnalyticsController.java
│       │   │   ├── dto/
│       │   │   │   ├── JobApplicationRequest.java
│       │   │   │   ├── JobApplicationResponse.java
│       │   │   │   ├── InterviewRequest.java
│       │   │   │   ├── InterviewResponse.java
│       │   │   │   ├── StudySessionRequest.java
│       │   │   │   ├── StudySessionResponse.java
│       │   │   │   ├── DashboardSummaryResponse.java
│       │   │   │   └── AnalyticsOverviewResponse.java
│       │   │   ├── entity/
│       │   │   │   ├── JobApplication.java
│       │   │   │   ├── Interview.java
│       │   │   │   └── StudySession.java
│       │   │   ├── enums/
│       │   │   │   ├── ApplicationStatus.java
│       │   │   │   ├── WorkMode.java
│       │   │   │   ├── EmploymentType.java
│       │   │   │   ├── InterviewRound.java
│       │   │   │   ├── InterviewStatus.java
│       │   │   │   └── InterviewMode.java
│       │   │   ├── exception/
│       │   │   │   ├── ResourceNotFoundException.java
│       │   │   │   └── GlobalExceptionHandler.java
│       │   │   ├── repository/
│       │   │   │   ├── JobApplicationRepository.java
│       │   │   │   ├── InterviewRepository.java
│       │   │   │   └── StudySessionRepository.java
│       │   │   └── service/
│       │   │       ├── JobApplicationService.java
│       │   │       ├── InterviewService.java
│       │   │       ├── StudySessionService.java
│       │   │       ├── DashboardService.java
│       │   │       └── AnalyticsService.java
│       │   └── resources/
│       │       └── application.properties
│       └── test/
│           ├── java/com/jobtrack/
│           │   ├── JobTrackApplicationTests.java
│           │   ├── JobApplicationServiceTest.java
│           │   ├── InterviewServiceTest.java
│           │   ├── StudySessionServiceTest.java
│           │   └── JobApplicationIntegrationTest.java
│           └── resources/
│               └── application-test.properties
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env
    ├── .env.example
    └── src/
        ├── index.css
        ├── main.jsx
        ├── App.jsx
        ├── services/
        │   ├── api.js
        │   ├── applicationService.js
        │   ├── interviewService.js
        │   ├── studyService.js
        │   └── dashboardService.js
        ├── components/
        │   ├── common/
        │   │   ├── StatusBadge.jsx
        │   │   ├── MetricCard.jsx
        │   │   ├── Modal.jsx
        │   │   ├── LoadingSpinner.jsx
        │   │   ├── EmptyState.jsx
        │   │   ├── AlertMessage.jsx
        │   │   └── ConfirmDialog.jsx
        │   ├── layout/
        │   │   ├── Header.jsx
        │   │   ├── Sidebar.jsx
        │   │   └── AppLayout.jsx
        │   ├── applications/
        │   │   ├── ApplicationModal.jsx
        │   │   ├── ApplicationDetailModal.jsx
        │   │   └── ApplicationFilters.jsx
        │   ├── interviews/
        │   │   └── InterviewModal.jsx
        │   └── preparation/
        │       └── StudySessionModal.jsx
        └── pages/
            ├── DashboardPage.jsx
            ├── ApplicationsPage.jsx
            ├── InterviewsPage.jsx
            ├── FollowUpsPage.jsx
            ├── PreparationPage.jsx
            └── AnalyticsPage.jsx
```

---

## 5. Prerequisites

Before running the project, make sure you have:
1. **Java Development Kit (JDK 21 or 17+)** installed:
   ```bash
   java -version
   ```
2. **Node.js (v18+) & npm**:
   ```bash
   node -v
   npm -v
   ```
3. **MySQL Server / XAMPP**:
   - Ensure MySQL is listening on port `3306`.

---

## 6. Database Setup (MySQL)

1. Start MySQL (e.g. from the XAMPP Control Panel or MySQL service).
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS jobtrack_db;
   ```
3. Default credentials configured in `backend/src/main/resources/application.properties`:
   - Host: `localhost:3306`
   - Database: `jobtrack_db`
   - Username: `root`
   - Password: `` (blank by default for XAMPP)

> **Note**: To use custom database credentials, you can pass environment variables without editing code:
> ```bash
> set DB_USERNAME=myuser
> set DB_PASSWORD=mypassword
> ```

---

## 7. How to Run the Project

### Step 1: Start the Backend (Spring Boot)

Open a terminal in the `backend` folder:
```bash
cd backend

# Option A: Run directly using Maven Wrapper
.\mvnw.cmd spring-boot:run

# Option B: Run the pre-built JAR
java -jar target/backend-1.0.0.jar
```
The backend starts at: `http://localhost:8080` (API base: `http://localhost:8080/api`).

### Step 2: Start the Frontend (React + Vite)

Open a second terminal in the `frontend` folder:
```bash
cd frontend

# Install dependencies (only required the first time)
npm install

# Start Vite development server
npm run dev
```
Open your browser and navigate to: **`http://127.0.0.1:5173/`**

---

## 8. REST API Endpoints

### Job Applications (`/api/applications`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/applications` | Retrieve all applications (supports `search`, `status`, `workMode`, `startDate`, `endDate`, `sortBy`, `sortDir`) |
| `GET` | `/api/applications/{id}` | Retrieve application by ID |
| `POST` | `/api/applications` | Create a new application (`201 CREATED`) |
| `PUT` | `/api/applications/{id}` | Update existing application |
| `DELETE` | `/api/applications/{id}` | Delete application (`204 NO CONTENT`) |
| `PATCH` | `/api/applications/{id}/follow-up` | Update follow-up date and completion status |
| `GET` | `/api/applications/follow-ups` | List applications with follow-ups |

### Interviews (`/api/interviews`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/interviews` | Retrieve all interviews (optional `applicationId`) |
| `GET` | `/api/interviews/{id}` | Retrieve interview by ID |
| `GET` | `/api/interviews/upcoming` | Retrieve upcoming interview rounds |
| `GET` | `/api/interviews/past` | Retrieve past interview rounds |
| `POST` | `/api/interviews` | Schedule new interview round (`201 CREATED`) |
| `PUT` | `/api/interviews/{id}` | Update interview details |
| `PATCH` | `/api/interviews/{id}/status` | Update interview status (`COMPLETED`, `CANCELLED`, etc.) |
| `DELETE` | `/api/interviews/{id}` | Delete interview (`204 NO CONTENT`) |

### Study Sessions (`/api/study-sessions`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/study-sessions` | List sessions (optional `subject`, `startDate`, `endDate`) |
| `GET` | `/api/study-sessions/{id}` | Retrieve session by ID |
| `POST` | `/api/study-sessions` | Log new study session (`201 CREATED`) |
| `PUT` | `/api/study-sessions/{id}` | Update session |
| `PATCH` | `/api/study-sessions/{id}/toggle-complete` | Toggle completion status |
| `DELETE` | `/api/study-sessions/{id}` | Delete session (`204 NO CONTENT`) |
| `GET` | `/api/study-sessions/summary` | Get total and weekly study hours summary |

### Dashboard & Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/summary` | Real-time dashboard KPI metrics, recent submissions, upcoming interviews |
| `GET` | `/api/analytics/overview` | Pipeline conversion share, monthly trends, study hours by subject |

---

## 9. Testing & Verification

Run backend unit and integration tests:
```bash
cd backend
.\mvnw.cmd test
```
**Verification results**:
- `Tests run: 14, Failures: 0, Errors: 0, Skipped: 0`
- `BUILD SUCCESS`

Run frontend production bundle check:
```bash
cd frontend
npm run build
```
**Verification results**:
- Vite build completed in under 1 second with 0 errors.

---

## 10. Current Limitations & Future Improvements

- **Current Version**: Single-user local application designed for individual job seekers without multi-tenant authentication.
- **Future Improvements**:
  - JWT-based authentication for multi-user sign-up.
  - Resume attachment upload via AWS S3 / Local storage.
  - Email notification reminders via Spring Mail.
