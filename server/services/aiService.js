const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[AIService] WARNING: GEMINI_API_KEY is not set. AI features will fail.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || 'missing-key');
    // gemini-1.5-flash: fast, generous free quota, great at structured JSON output
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Helper to ensure score is an integer between 0 and 100
   */
  static normalizeScore(score) {
    if (score === undefined || score === null) return 0;
    let normalized = score;
    // Guard against AI returning decimal (0-1) instead of integer (0-100)
    if (normalized > 0 && normalized <= 1) {
      normalized = Math.round(normalized * 100);
    } else {
      normalized = Math.min(100, Math.max(0, Math.round(normalized)));
    }
    return normalized;
  }

  /**
   * Analyze a resume against a job description and return a structured JSON report.
   */
  async analyzeResumeVsJD(resumeText, jobDescription) {
    const prompt = `You are a professional ATS (Applicant Tracking System) resume analyzer and career coach.

SCORING INSTRUCTIONS — follow exactly:
Calculate "score" as an INTEGER from 0 to 100 based on these weighted criteria:
  1. Keyword Match (40%): What % of key technical skills, tools, and role-specific terms from the JD appear in the resume?
  2. Semantic Relevance (25%): Does the resume's experience, role titles, and domain match the job requirements holistically?
  3. Section Completeness (20%): Does the resume have: Summary/Objective, Work Experience, Skills, Education, Projects/Certifications?
  4. Formatting & ATS-Readiness (15%): Clean structure, action verbs, quantified results (numbers/%), no tables or images that ATS can't parse?

Score guide: 85-100 = Excellent match, 70-84 = Good match, 50-69 = Moderate (needs tailoring), 30-49 = Low match, 0-29 = Poor match.

IMPORTANT: "score" MUST be an integer between 0 and 100. Do NOT return a decimal like 0.85. Return 85, not 0.85.

You MUST respond with ONLY a raw JSON object — no markdown, no code fences, no explanation.
The JSON must match this exact schema:
{
  "score": <integer 0-100>,
  "matchedKeywords": [<strings>],
  "missingKeywords": [<strings>],
  "analysis": {
    "skills": "<assessment of technical and soft skills alignment>",
    "education": "<education match assessment>",
    "experience": "<experience relevance assessment>",
    "certifications": "<certifications/courses assessment>",
    "projects": "<projects relevance assessment>",
    "overallQuality": "<overall resume quality and ATS readiness summary>"
  },
  "careerGuidance": {
    "coachingSuggestions": [<actionable string tips>],
    "improvementAreas": [<specific areas to improve>],
    "missingSkills": [<skills to acquire>],
    "enhancementStrategies": [<resume enhancement strategies>],
    "industryGuidance": "<industry-specific career path guidance>"
  },
  "jobRecommendations": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "opportunity": "<why this is a good fit>",
      "qualifications": [<required qualification strings>],
      "skills": [<required skill strings>],
      "eligibility": "<eligibility criteria>",
      "applicationUrl": "<google search URL or direct job link>"
    }
  ],
  "formatting": {
    "score": <integer 0-100>,
    "issues": [<formatting issue or tip strings>]
  }
}

===RESUME===
${resumeText}

===JOB DESCRIPTION===
${jobDescription}`;

    console.log('[AIService] Starting Gemini analysis...');

    try {
      // Add a 60-second timeout so the request never hangs forever
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      let content;
      try {
        const result = await this.model.generateContent(prompt, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        content = result.response.text();
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        if (fetchErr.name === 'AbortError') {
          throw new Error('AI request timed out after 60 seconds. Please try again.');
        }
        throw fetchErr;
      }

      console.log('[AIService] Gemini raw response length:', content?.length);

      // Strip any markdown code fences the model might add despite instructions
      content = (content || '').trim();
      if (content.startsWith('```')) {
        content = content.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
      }

      // Extract JSON object if there's surrounding text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }

      const parsed = JSON.parse(content);

      // Normalize scores to be strictly 0-100 integers
      parsed.score = AIService.normalizeScore(parsed.score);
      if (parsed.formatting) {
        parsed.formatting.score = AIService.normalizeScore(parsed.formatting.score);
      }

      console.log('[AIService] Analysis complete. Score:', parsed.score);
      return parsed;

    } catch (error) {
      console.error('[AIService] Error:', error?.message || error);
      throw new Error('Failed to analyze resume with AI: ' + (error?.message || String(error)));
    }
  }

  /**
   * Rewrite a resume bullet point to be more impactful.
   */
  async rewriteText(text, tone = 'professional') {
    const prompt = `You are an expert resume writer. Rewrite the following resume bullet point to be more impactful, professional, and results-oriented.

TONE: ${tone}

RULES:
1. Start with a strong action verb.
2. Quantify results where possible (if the original implies metrics, emphasize them).
3. Keep it concise (1-2 sentences maximum).
4. Do not add made-up numbers if none exist or aren't implied.
5. Return ONLY the rewritten text — no explanations, no quotes, no formatting.

ORIGINAL TEXT:
${text}`;

    console.log('[AIService] Starting Gemini rewrite...');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      let content;
      try {
        const result = await this.model.generateContent(prompt, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        content = result.response.text();
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        if (fetchErr.name === 'AbortError') {
          throw new Error('Rewrite request timed out. Please try again.');
        }
        throw fetchErr;
      }

      return (content || '').trim();
    } catch (error) {
      console.error('[AIService] Rewrite Error:', error?.message || error);
      throw new Error('Failed to rewrite text: ' + (error?.message || String(error)));
    }
  }
}

module.exports = new AIService();
