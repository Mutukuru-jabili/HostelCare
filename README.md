# HostelCare

HostelCare is a full-stack hostel complaint management application. Students register, create maintenance complaints, and track progress. Administrators review complaints, assign maintenance staff, change priority and status, and see operational statistics.

## Project folders

- `frontend/` — React and Vite user interface
- `backend/` — Spring Boot REST API and MySQL persistence
- `docs/PROJECT_DOCUMENTATION.md` — end-to-end project explanation, workflow, modules, setup, and interview questions

## Run locally

1. Start MySQL Server and ensure the configured MySQL account can create/use the `hostelcare` database. The JDBC URL in `backend/src/main/resources/application-mysql.properties` creates the database if needed. Update that file's connection settings if your MySQL username, password, or port differs.
2. Start the backend:

   ```powershell
   cd backend
   mvn spring-boot:run
   ```

   By default the backend uses the MySQL profile and listens at `http://localhost:8909`.
3. In another terminal, start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Open `http://localhost:5173`.

The first backend startup creates/updates the `users` and `complaints` tables and seeds a demo admin plus sample complaints if the database has none.

## Demo admin

- Email: `admin@hostelcare.com`
- Password: `admin123`

For a complete project walkthrough, schema and API overview, user/admin operations, workflow, interview questions, and conclusion, see [the project documentation](docs/PROJECT_DOCUMENTATION.md).
