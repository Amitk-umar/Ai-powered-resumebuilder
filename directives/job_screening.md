# Directive: Job Screening Workflow

## Goal
Run an AI-powered screening of a resume against a job description and store the result.

## Inputs
- Resume ID (MongoDB ObjectId)
- Job description (plain text, up to ~3000 chars)
- Firebase ID token

## Tools / Scripts
- `execution/run_screening.py` — POSTs to /api/screen and writes result to .tmp/

## Workflow
1. Fetch resume via GET /api/resumes/:id
2. Run `execution/run_screening.py` with resumeId + job description
3. Script POSTs to POST /api/screen → Gemini evaluates fit score, gaps, suggestions
4. Server stores result in Screening collection (GET /api/screenings to retrieve)
5. Script writes response to `.tmp/screening_result_{resumeId}.json`

## API Contract
**POST /api/screen**
```json
Request:  { "resumeId": "...", "jobDescription": "..." }
Response: { "score": 82, "gaps": [...], "suggestions": [...], "matchedSkills": [...] }
```

## Outputs
- Screening result JSON saved to `.tmp/screening_result_{resumeId}.json`
- Result persisted in MongoDB via server

## Edge Cases
- Invalid resumeId → 404 from server → script exits with error message
- Missing auth token → 401 → script exits with error message
- Gemini timeout (>30s): retry once, then fail gracefully
- Job description > 3000 chars: truncate with a warning log

## Known Issues / Learnings
- (Update as you encounter real API behavior)
