# Directive: AI Resume Enhancement

## Goal
Use Google Gemini to improve bullet points, summaries, and skill descriptions in a resume section.

## Inputs
- Section type: `summary` | `experience` | `skills` | `education`
- Raw text content from the user's resume section
- Optional: target job description (string) for tailoring

## Tools / Scripts
- `execution/enhance_resume_section.py` — calls Gemini API with a structured prompt

## Workflow
1. Read the section content from the resume (via GET /api/resumes/:id)
2. Run `execution/enhance_resume_section.py` with section type + raw text
3. Script returns enhanced text as JSON: `{ "enhanced": "..." }`
4. Optionally PUT the enhanced text back via /api/resumes/:id

## Prompt Strategy
- For `experience`: rewrite bullets using strong action verbs + quantifiable results
- For `summary`: 3-sentence professional summary tailored to job description
- For `skills`: group and prioritize skills relevant to target role
- Always instruct Gemini to return only the improved text, no explanation

## Outputs
- Enhanced section text (string) written to `.tmp/enhanced_section.json`

## Edge Cases
- Gemini rate limits: 60 req/min on free tier → add exponential backoff
- Empty input: skip enhancement, return original
- If job description provided: prepend it to prompt as context
- Token limit: truncate input to ~2000 tokens before sending

## Known Issues / Learnings
- (Update this section as you learn from real runs)
