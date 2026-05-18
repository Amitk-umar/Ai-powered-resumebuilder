const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI Service
 * Primary  : NVIDIA NIM — z-ai/glm-5.1  (streaming + thinking mode)
 * Fallback : Google Gemini 2.0 Flash
 */
class AIService {
  constructor() {
    // ── Primary: NVIDIA NIM / GLM-5.1 ──────────────────────
    this.nvidiaClient = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY || 'missing-nvidia-key',
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    // ── Fallback: Google Gemini 2.0 Flash ──────────────────
    this.genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY || 'missing-gemini-key'
    );
    // gemini-2.0-flash is the current stable model (1.5-flash is deprecated in v1beta)
    this.geminiModel = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    if (!process.env.NVIDIA_API_KEY) {
      console.warn('[AIService] WARNING: NVIDIA_API_KEY not set.');
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
  // Shared prompts
  // ─────────────────────────────────────────────────────────

  static buildSystemPrompt() {
    return `You are a professional ATS (Applicant Tracking System) resume analyzer and career coach.

SCORING INSTRUCTIONS — follow exactly:
Calculate "score" as an INTEGER from 0 to 100 based on:
  1. Keyword Match (40%): % of key technical skills, tools, role-specific terms from JD in resume.
  2. Semantic Relevance (25%): Experience, role titles, domain match holistically.
  3. Section Completeness (20%): Summary/Objective, Work Experience, Skills, Education, Projects/Certifications present.
  4. Formatting & ATS-Readiness (15%): Clean structure, action verbs, quantified results, no tables/images.

Score guide: 85-100=Excellent, 70-84=Good, 50-69=Moderate, 30-49=Low, 0-29=Poor.

IMPORTANT: "score" MUST be an integer 0-100. Do NOT return 0.85, return 85.

Respond with ONLY a raw JSON object — no markdown, no code fences, no explanation.
Schema:
{
  "score": <integer 0-100>,
  "matchedKeywords": [<strings>],
  "missingKeywords": [<strings>],
  "analysis": {
    "skills": "<technical and soft skills alignment>",
    "education": "<education match>",
    "experience": "<experience relevance>",
    "certifications": "<certifications assessment>",
    "projects": "<projects relevance>",
    "overallQuality": "<overall resume quality and ATS readiness>"
  },
  "careerGuidance": {
    "coachingSuggestions": [<actionable tips>],
    "improvementAreas": [<areas to improve>],
    "missingSkills": [<skills to acquire>],
    "enhancementStrategies": [<resume enhancement strategies>],
    "industryGuidance": "<industry-specific career path guidance>"
  },
  "jobRecommendations": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "opportunity": "<why good fit>",
      "qualifications": [<strings>],
      "skills": [<strings>],
      "eligibility": "<criteria>",
      "applicationUrl": "<URL>"
    }
  ],
  "formatting": {
    "score": <integer 0-100>,
    "issues": [<strings>]
  }
}`;
  }

  static buildUserPrompt(resumeText, jobDescription) {
    return `Analyze this resume against the job description. Return raw JSON only — no markdown, no code fences.

===RESUME===
${resumeText}

===JOB DESCRIPTION===
${jobDescription}`;
  }

  // ─────────────────────────────────────────────────────────
  // GLM-5.1 via NVIDIA NIM  (PRIMARY)
  // Uses streaming + thinking mode exactly as per official sample
  // chat_template_kwargs passed via `body` option so OpenAI SDK doesn't strip it
  // ─────────────────────────────────────────────────────────

  async _analyzeWithGLM(resumeText, jobDescription) {
    console.log('[AIService] Calling GLM-5.1 via NVIDIA NIM (streaming + thinking)...');

    const controller = new AbortController();
    // 120 s — thinking mode takes longer but gives much better analysis
    const timer = setTimeout(() => controller.abort(), 120_000);

    try {
      const stream = await this.nvidiaClient.chat.completions.create(
        {
          model: 'z-ai/glm-5.1',
          messages: [
            { role: 'system', content: AIService.buildSystemPrompt() },
            { role: 'user',   content: AIService.buildUserPrompt(resumeText, jobDescription) },
          ],
          temperature: 1,
          top_p: 1,
          max_tokens: 16384,
          stream: true,
        },
        {
          signal: controller.signal,
          // IMPORTANT: chat_template_kwargs must be passed here in `body` because
          // the OpenAI SDK strips unknown top-level params from the main object.
          // Passing via `body` merges it directly into the HTTP request payload.
          body: {
            chat_template_kwargs: { enable_thinking: true, clear_thinking: true },
          },
        }
      );

      // Collect streamed content chunks
      let content = '';
      for await (const chunk of stream) {
        content += chunk.choices[0]?.delta?.content || '';
      }

      clearTimeout(timer);
      console.log('[AIService] GLM-5.1 stream complete. Content length:', content.length);

      if (!content.trim()) {
        throw new Error('GLM-5.1 returned empty content');
      }
      return content;

    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        throw new Error('GLM-5.1 timed out after 120 s');
      }
      // Log the detailed NVIDIA error for debugging
      console.error('[AIService] GLM-5.1 error details:', err?.status, err?.message, err?.error);
      throw err;
    }
  }

  // ─────────────────────────────────────────────────────────
  // Gemini 2.0 Flash  (FALLBACK)
  // ─────────────────────────────────────────────────────────

  async _analyzeWithGemini(resumeText, jobDescription) {
    console.log('[AIService] Using Gemini 2.0 Flash fallback...');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60_000);

    try {
      const fullPrompt =
        AIService.buildSystemPrompt() + '\n\n' + AIService.buildUserPrompt(resumeText, jobDescription);

      const result = await this.geminiModel.generateContent(fullPrompt, {
        signal: controller.signal,
      });
      clearTimeout(timer);

      const text = result.response.text();
      console.log('[AIService] Gemini response length:', text?.length);
      return text;

    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') throw new Error('Gemini timed out after 60 s');
      throw err;
    }
  }

  // ─────────────────────────────────────────────────────────
  // Public: analyzeResumeVsJD
  // ─────────────────────────────────────────────────────────

  async analyzeResumeVsJD(resumeText, jobDescription) {
    let raw = '';

    // Try GLM-5.1 first
    try {
      raw = await this._analyzeWithGLM(resumeText, jobDescription);
    } catch (glmErr) {
      console.warn('[AIService] GLM-5.1 failed:', glmErr.message, '→ trying Gemini fallback...');
      try {
        raw = await this._analyzeWithGemini(resumeText, jobDescription);
      } catch (geminiErr) {
        console.error('[AIService] Both providers failed:', geminiErr.message);
        throw new Error(
          'AI analysis failed on all providers. Please try again later. (' + geminiErr.message + ')'
        );
      }
    }

    // Parse & normalize
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
      console.error('[AIService] JSON parse failed. Raw snippet:', raw?.slice(0, 500));
      throw new Error('AI returned an invalid response format. Please try again.');
    }
  }

  // ─────────────────────────────────────────────────────────
  // Public: rewriteText  (Pro/Premium — bullet rewriter)
  // ─────────────────────────────────────────────────────────

  async rewriteText(text, tone = 'professional') {
    const systemPrompt = `You are an expert resume writer. Rewrite the following resume bullet point to be more impactful and results-oriented.
TONE: ${tone}
RULES:
1. Start with a strong action verb.
2. Quantify results where possible.
3. Keep it concise (1-2 sentences max).
4. Do not fabricate numbers.
5. Return ONLY the rewritten text — no explanations, no quotes.`;

    // Try GLM-5.1
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
          stream: true,
        },
        {
          signal: controller.signal,
          body: { chat_template_kwargs: { enable_thinking: true, clear_thinking: true } },
        }
      );

      let content = '';
      for await (const chunk of stream) {
        content += chunk.choices[0]?.delta?.content || '';
      }
      clearTimeout(timer);
      return content.trim();

    } catch (glmErr) {
      console.warn('[AIService] GLM-5.1 rewrite failed:', glmErr.message, '→ Gemini fallback...');
    }

    // Gemini fallback
    try {
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
