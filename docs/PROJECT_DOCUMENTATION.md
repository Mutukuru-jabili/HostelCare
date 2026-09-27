# HostelCare — End-to-End Project Documentation

## 1. Project overview

HostelCare is a web-based hostel and PG complaint management system. It connects students who report maintenance issues with administrators who coordinate the work and track each complaint through to resolution.

The project is implemented as a React single-page application backed by a Spring Boot REST API and a MySQL relational database.

## 2. Problem statement

Hostel maintenance requests are often reported informally through calls, messages, or face-to-face conversations. These channels make it difficult to keep a reliable record, identify the responsible student and room, prioritize urgent issues, assign staff, or tell whether a request has been resolved.

HostelCare provides one place to submit, store, search, and manage those requests. It keeps complaint information associated with the student who submitted it and gives administrators a view of current operational workload.

## 3. Objectives

- Let students register and sign in with a student account.
- Capture maintenance complaints with a category, room, priority, description, and optional image.
- Give students access to their own complaint history and status.
- Give administrators a consolidated complaint list, useful student contact details, filters, and statistics.
- Let administrators assign staff and update complaint priority and lifecycle status.
- Persist user and complaint records in MySQL so records remain available after application restarts.

## 4. Technology stack

| Area | Technology |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| Backend | Java 21, Spring Boot, Spring Web |
| Persistence | Spring Data JPA, Hibernate |
| Database | MySQL |
| Validation | Jakarta Bean Validation |
| Password hashing | Spring Security `PasswordEncoder` / BCrypt |
| Image storage | Local filesystem upload directory, image URL served by backend |

## 5. Repository structure

```text
HostelComplaintManagement/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Shared layout and navigation
│   │   ├── context/          # Current browser session state
│   │   ├── pages/            # Student, administrator, login, and register screens
│   │   ├── routes/           # Role-aware frontend route guard
│   │   ├── services/         # Axios API client and endpoint methods
│   │   ├── App.jsx           # Route table
│   │   └── index.css         # Shared application styles
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/main/java/com/hostelcare/
│   │   ├── config/           # Security, CORS/static files, and seed data
│   │   ├── controller/      # HTTP endpoints
│   │   ├── dto/             # Request and response types
│   │   ├── entity/          # JPA User and Complaint entities
│   │   ├── exception/       # API error handling
│   │   ├── repository/      # Spring Data JPA persistence queries
│   │   └── service/         # Authentication and complaint business logic
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── application-mysql.properties
│   │   └── application-h2.properties
│   └── pom.xml
├── docs/
│   └── PROJECT_DOCUMENTATION.md
└── README.md
```

## 6. Functional modules

### Authentication and registration

The registration form collects a student's name, email, password, phone number, hostel/PG, and room. The backend validates required values, normalizes the email, hashes the password, and always creates a `STUDENT` role; users cannot register themselves as administrators. Login checks the email and BCrypt password hash and returns the authenticated user's profile.

### Student operations

- View a student dashboard and complaint history.
- Submit a complaint with a title, description, category, room, priority, and optional JPG/PNG/WEBP image.
- View complaint details and status.
- Access profile information.

### Administrator operations

- View total, pending, assigned, in-progress, and resolved complaint counts.
- Browse all complaints and filter by text, status, and priority.
- See the student's name, email, phone, hostel/PG, and registered room alongside each complaint.
- Open a complaint to see its description, image, student information, and current assignment.
- Assign maintenance staff and change status and priority.

Complaint status values are `PENDING`, `ASSIGNED`, `IN_PROGRESS`, and `RESOLVED`. Categories include electrical, plumbing, cleaning, Wi-Fi, furniture, water, room maintenance, and other. Priorities are `LOW`, `MEDIUM`, `HIGH`, and `URGENT`.

### Complaint image uploads

Images are optional. The backend accepts JPG, PNG, and WEBP images up to 5 MB, stores them in the configured upload directory, and exposes their paths through the static `/uploads/**` route.

## 7. Database design

Hibernate creates or updates the tables from the JPA entities at backend startup (`spring.jpa.hibernate.ddl-auto=update`).

### `users`

Stores student and administrator accounts. Important fields include the generated ID, full name, unique email, BCrypt password hash, phone, hostel name, room number, role, and creation timestamp. The password is excluded from JSON responses.

### `complaints`

Stores the complaint title, description, category, room, priority, status, optional image path, assigned staff, creation/update timestamps, and a `student_id` foreign key.

### Relationship

One user can submit many complaints (`User` one-to-many `Complaint`). Each complaint belongs to exactly one student (`Complaint` many-to-one `User`). Admin complaint queries fetch the associated student so the UI can display registration contact details.

## 8. API operations

All API paths are rooted at `/api`.

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/auth/register` | Register a student |
| `POST` | `/auth/login` | Authenticate a student or administrator |
| `POST` | `/complaints?studentId={id}` | Create a complaint (multipart form; optional image) |
| `GET` | `/complaints/student/{studentId}` | List one student's complaints |
| `GET` | `/complaints/{id}?studentId={id}` | Read a complaint (student access is checked when student ID is supplied) |
| `GET` | `/admin/complaints` | List all complaints with student information |
| `GET` | `/admin/statistics` | Get complaint counts by status |
| `PUT` | `/admin/complaints/{id}/status?status={value}` | Change complaint status |
| `PUT` | `/admin/complaints/{id}/priority?priority={value}` | Change complaint priority |
| `PUT` | `/admin/complaints/{id}/assign?assignedStaff={name}` | Assign staff |

Responses use a common object containing a success flag, message, timestamp, and data.

## 9. End-to-end workflow

1. **Start MySQL.** The configured MySQL account must be permitted to create/use the `hostelcare` schema and create tables.
2. **Start the backend.** Spring Boot uses the MySQL profile by default, connects to the `hostelcare` schema, updates the JPA schema, seeds the demo admin, and inserts sample complaints only when no complaints exist.
3. **Start the frontend.** Vite serves the application and Axios sends requests to `http://localhost:8909/api` by default.
4. **Register a student.** The user submits their profile; the API validates the fields, hashes the password, and persists the `users` row.
5. **Log in.** The API verifies the credentials and returns the role/profile. The frontend routes administrators and students to their respective dashboards.
6. **Submit a complaint.** The student submits maintenance details. The API associates the complaint with their `users` row and saves the complaint (and optional image).
7. **Review and resolve.** The admin sees the complaint and linked student details, assigns staff, adjusts priority/status, and marks the work resolved.
8. **Track progress.** The student can revisit their complaint history to see the latest status.

**Important distinction:** registering a student creates an account, not a complaint. A student appears in **All Complaints** when they have submitted a complaint; their registration details are displayed with that complaint.

## 10. Local setup and run

### Prerequisites

- MySQL Server running on the configured host/port.
- Java 21 and Maven.
- Node.js and npm.

### Backend

From the project root:

```powershell
cd backend
mvn spring-boot:run
```

Backend API: `http://localhost:8909/api`.

The default profile is `mysql`. Database URL, username, and password are configured in `backend/src/main/resources/application-mysql.properties`; adjust them for the local MySQL installation. The JDBC URL includes `createDatabaseIfNotExist=true`. The configured MySQL account still needs database privileges.

For an explicitly disposable in-memory H2 run, start with:

```powershell
mvn spring-boot:run "-Dspring-boot.run.profiles=h2"
```

H2 data is temporary and should not be used when data must persist or be shared with the MySQL database.

### Frontend

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`. Set `VITE_API_BASE_URL` if the backend API is hosted at a different URL.

### Demo admin

- Email: `admin@hostelcare.com`
- Password: `admin123`

Change the demo password and database credentials before deploying outside a local demonstration environment.

## 11. Troubleshooting data visibility

- Confirm the backend log says the active profile is `mysql` and shows a JDBC URL for MySQL (not `jdbc:h2:mem:`).
- Confirm the backend connects to the intended MySQL host, port, and `hostelcare` schema.
- Confirm `users` and `complaints` exist in that schema; check that `complaints.student_id` references `users.id`.
- Ensure the frontend calls the same backend host/port and the backend process has been restarted after configuration changes.
- A student's registration appears in the users table. To see that student's information in the admin complaint list, the student must also submit at least one complaint.
- Data previously saved only to an in-memory H2 database is not automatically copied into MySQL. Register again and re-submit any complaint that needs to be retained, or perform a deliberate data migration before discarding the old H2 process.

## 12. Interview questions and sample answers

1. **What problem does HostelCare solve?**  
   It replaces informal maintenance reporting with a traceable workflow linking a student, room, complaint, assignee, priority, and resolution status.

2. **Why split the system into a React frontend and Spring Boot API?**  
   The API centralizes validation and business operations, while the frontend can evolve independently and communicate through standard HTTP/JSON endpoints.

3. **How does a complaint relate to a student?**  
   `Complaint` has a many-to-one JPA relationship with `User`, stored as the `student_id` foreign key. A user can have multiple complaints.

4. **How are passwords stored?**  
   The backend stores BCrypt hashes using Spring Security's `PasswordEncoder`; it compares a submitted password against the hash at login.

5. **How does the admin list include student details?**  
   The complaint repository fetches each complaint's associated student, and the API serializes safe profile fields while omitting the password.

6. **How are complaint states represented?**  
   An enum (`PENDING`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`) limits values to known lifecycle stages and supports dashboard counts and filters.

7. **How are uploaded images handled?**  
   The browser sends a multipart request. The service validates media type and size, creates a unique file name, writes the file to disk, and stores its URL path on the complaint.

8. **What does `ddl-auto=update` do?**  
   Hibernate compares entity mappings with the configured database schema and creates/updates required tables and columns. It is convenient for development; production deployments should use versioned migrations.

9. **Why use MySQL instead of in-memory H2 here?**  
   MySQL preserves records across backend restarts and allows the student registration and admin complaint views to read the same durable data store. H2 is retained only as an explicit temporary profile.

10. **How does validation work?**  
    Jakarta validation annotations enforce required values, email format, password length, and phone format at the API boundary; service methods handle domain checks such as duplicate email.

11. **How could this project be made production-ready?**  
    Add server-enforced authentication/authorization, migrate to JWT or secure sessions, configure role-based endpoint access, externalize secrets, use schema migrations, add audit logging and automated integration tests, and store uploads in managed object storage.

12. **What is the next useful enhancement?**  
    Add notifications and an audit timeline so students are informed of each state change and admins can review who made an update and when.

## 13. Current limitations and future improvements

- Frontend route guards improve navigation but are not a substitute for backend authorization. Admin and student API permissions must be enforced server-side before production use.
- File uploads currently use local disk; use managed/object storage for a multi-instance deployment.
- Schema updates are automatic for development; use a migration tool such as Flyway or Liquibase for production.
- Add endpoint tests for registration, complaint ownership, admin updates, validation, and persistence across restarts.
- Add pagination for large complaint lists and audit records for administrative actions.

## 14. Conclusion

HostelCare demonstrates an end-to-end complaint workflow from student registration through maintenance resolution. React provides role-oriented interfaces, Spring Boot exposes validated REST operations, and MySQL stores linked users and complaints durably. Students can submit and track issues; administrators can see the associated student details and coordinate assignments, priorities, and status changes. With server-side authorization, database migrations, and production-grade file storage added, the project can progress from a functional demonstration to a deployable service.
