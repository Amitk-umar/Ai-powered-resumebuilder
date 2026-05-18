const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI Service
 * Primary  : NVIDIA NIM — z-ai/glm-5.1  (with thinking mode enabled)
 * Fallback : Google Gemini 1.5 Flash    (if NVIDIA fails / times out)
 */
class AIService {
  constructor() {
    // ── Primary: NVIDIA NIM / GLM-5.1 ──────────────────────
    this.nvidiaClient = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY || 'missing-nvidia-key',
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    // ── Fallback: Google Gemini ─────────────────────────────
    this.genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY || 'missing-gemini-key'
    );
    this.geminiModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    if (!process.env.NVIDIA_API_KEY) {
      console.warn('[AIService] WARNING: NVIDIA_API_KEY not set — will use Gemini fallback.');
    }
  }

  // ─────────────────────────────────────────────────────────
  // Utilities
  // ─────────────────────────────────────────────────────────

  static normalizeScore(score) {
    if (score == null) return 0;
    let v = score;
    if (v > 0 && v <= 1) v = Math.round(v * 100);
    return Math.min(100, Math.max(0, Math.round(v)));
  }

  static cleanJSON(raw) {
    let s = (raw || '').trim();
    if (s.startsWith('```')) {
      s = s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    }
    const m = s.match(/\{[\s\S]*\}/);
    return m ? m[0] : s;
  }

  // ─────────────────────────────────────────────────────────
  // Shared prompt
  // ─────────────────────────────────────────────────────────

  static buildScreeningSystemPrompt() {
    return `You are a professional ATS (Applicant Tracking System) resume analyzer and career coach.

SCORING INSTRUCTIONS — follow exactly:
Calculate "score" as an INTEGER from 0 to 100 based on these weighted criteria:
  1. Keyword Match (40%): What % of key technical skills, tools, and role-specific terms from the JD appear in the resume?
  2. Semantic Relevance (25%): Does the resume experience, role titles, and domain match the job requirements holistically?
  3. Section Completeness (20%): Does the resume have: Summary/Objective, Work Experience, Skills, Education, Projects/Certifications?
  4. Formatting & ATS-Readiness (15%): Clean structure, action verbs, quantified results (numbers/%), no tables or images that ATS cannot parse?

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
}`;
  }

  static buildScreeningUserPrompt(resumeText, jobDescription) {
    return `Analyze this resume against the job description below. Return a raw JSON object only — no markdown, no code fences.

===RESUME===
${resumeText}

===JOB DESCRIPTION===
${jobDescription}`;
  }

  // ─────────────────────────────────────────────────────────
  // GLM-5.1 via NVIDIA NIM  (streaming + thinking mode)
  // ─────────────────────────────────────────────────────────

  async _analyzeWithGLM(resumeText, jobDescription) {
    console.log('[AIService] Calling GLM-5.1 (NVIDIA NIM) with thinking mode...');

    const controller = new AbortController();
    // 120 s — thinking mode takes longer but produces much better analysis
    const timer = setTimeout(() => controller.abort(), 120_000);

    try {
      const stream = await this.nvidiaClient.chat.completions.create(
        {
          model: 'z-ai/glm-5.1',
          messages: [
            { role: 'system', content: AIService.buildScreeningSystemPrompt() },
            { role: 'user',   content: AIService.buildScreeningUserPrompt(resumeText, jobDescription) },
          ],
          temperature: 1,
          top_p: 1,
          max_tokens: 16384,
          // Enable GLM-5.1 thinking (reasoning) mode for higher accuracy.
          // clear_thinking: true strips the internal reasoning so we receive only clean JSON.
          chat_template_kwargs: { enable_thinking: true, clear_thinking: true },
          stream: true,
        },
        { signal: controller.signal }
      );

      // Collect all content chunks from the stream
      let content = '';
      for await (const chunk of stream) {
        content += chunk.choices[0]?.delta?.content || '';
      }

      clearTimeout(timer);
      console.log('[AIService] GLM-5.1 stream complete. Content length:', content.length);
      return content;

    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        throw new Error('GLM-5.1 request timed out after 120 s');
      }
      throw err;
    }
  }

  // ─────────────────────────────────────────────────────────
  // Gemini 1.5 Flash  (fallback)
  // ─────────────────────────────────────────────────────────

  async _analyzeWithGemini(resumeText, jobDescription) {
    console.log('[AIService] Using Gemini 1.5 Flash fallback...');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60_000);

    try {
      const fullPrompt =
        AIService.buildScreeningSystemPrompt() +
        '\n\n' +
        AIService.buildScreeningUserPrompt(resumeText, jobDescription);

      const result = await this.geminiModel.generateContent(fullPrompt, {
        signal: controller.signal,
      });
      clearTimeout(timer);
      return result.response.text();
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') throw new Error('Gemini request timed out after 60 s');
      throw err;
    }
  }

  // ─────────────────────────────────────────────────────────
  // Public: analyzeResumeVsJD
  // ─────────────────────────────────────────────────────────

  async analyzeResumeVsJD(resumeText, jobDescription) {
    let raw = '';

    // Try GLM-5.1 first; silently fall back to Gemini on any error
    try {
      raw = await this._analyzeWithGLM(resumeText, jobDescription);
    } catch (glmErr) {
      console.warn('[AIService] GLM-5.1 failed:', glmErr.message, '— switching to Gemini fallback.');
      try {
        raw = await this._analyzeWithGemini(resumeText, jobDescription);
      } catch (geminiErr) {
        console.error('[AIService] Both providers failed:', geminiErr.message);
        throw new Error(
          'AI analysis failed on all providers. Please try again later. (' +
            geminiErr.message + ')'
        );
      }
    }

    // Parse + normalize scores
    try {
      const cleaned = AIService.cleanJSON(raw);
      const parsed = JSON.parse(cleaned);
      parsed.score = AIService.normalizeScore(parsed.score);
      if (parsed.formatting) {
        parsed.formatting.score = AIService.normalizeScore(parsed.formatting.score);
      }
      console.log('[AIService] Analysis complete. Score:', parsed.score);
      return parsed;
    } catch (parseErr) {
      console.error('[AIService] JSON parse failed. Raw snippet:', raw?.slice(0, 400));
      throw new Error('AI returned an invalid response format. Please try again.');
    }
  }

  // ─────────────────────────────────────────────────────────
  // Public: rewriteText  (Pro/Premium — bullet rewriter)
  // ─────────────────────────────────────────────────────────

  async rewriteText(text, tone = 'professional') {
    const systemPrompt = `You are an expert resume writer. Rewrite the following bullet point to be more impactful and results-oriented.
TONE: ${tone}
RULES:
1. Start with a strong action verb.
2. Quantify results where possible.
3. Keep it concise (1-2 sentences max).
4. Do not fabricate numbers.
5. Return ONLY the rewritten text — no explanations, no quotes.`;

    // Try GLM-5.1 first
    try {
      console.log('[AIService] Rewrite — calling GLM-5.1...');
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 45_000);

      const stream = await this.nvidiaClient.chat.completions.create(
        {
          model: 'z-ai/glm-5.1',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: text },
          ],
          temperature: 1,
          top_p: 1,
          max_tokens: 512,
          chat_template_kwargs: { enable_thinking: true, clear_thinking: true },
          stream: true,
        },
        { signal: controller.signal }
      );

      let content = '';
      for await (const chunk of stream) {
        content += chunk.choices[0]?.delta?.content || '';
      }
      clearTimeout(timer);
      return content.trim();

    } catch (glmErr) {
      console.warn('[AIService] GLM-5.1 rewrite failed:', glmErr.message, '— switching to Gemini.');
    }

    // Gemini fallback
    try {
      console.log('[AIService] Rewrite — using Gemini fallback...');
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30_000);

      const result = await this.geminiModel.generateContent(
        `${systemPrompt}\n\nORIGINAL TEXT:\n${text}`,
        { signal: controller.signal }
      );
      clearTimeout(timer);
      return (result.response.text() || '').trim();

    } catch (geminiErr) {
      console.error('[AIService] Both rewrite providers failed:', geminiErr.message);
      throw new Error('Failed to rewrite text: ' + geminiErr.message);
    }
  }
}

module.exports = new AIService();
