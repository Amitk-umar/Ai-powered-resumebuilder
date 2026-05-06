# Directive: Resume CRUD Operations

## Goal
Create, read, update, and delete resumes for authenticated users via the REST API.

## Inputs
- Firebase ID token (Authorization header: `Bearer <token>`)
- Resume payload (JSON matching the Resume mongoose schema)

## Tools / Scripts
- `execution/resume_crud.py` — batch create/read/delete via API

## API Endpoints
| Method | Path                   | Description              |
|--------|------------------------|--------------------------|
| GET    | /api/resumes           | List all user's resumes  |
| POST   | /api/resumes           | Create a new resume      |
| GET    | /api/resumes/:id       | Get single resume        |
| PUT    | /api/resumes/:id       | Update resume            |
| DELETE | /api/resumes/:id       | Delete resume            |

## Outputs
- JSON resume document(s) with `_id`, `userId`, `title`, `sections`, `createdAt`, `updatedAt`

## Edge Cases
- All routes require a valid Firebase token → 401 if missing/invalid
- `userId` is extracted from the verified token, never trusted from client body
- Large resume payloads: server accepts up to 10 MB (express.json limit)

## Notes
- Always verify the user owns the resume before update/delete (check `userId` field)
