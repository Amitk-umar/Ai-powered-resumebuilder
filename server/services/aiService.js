const OpenAI = require('openai');

/**
 * AI Service
 * Primary  : NVIDIA NIM — z-ai/glm-5.1 via direct fetch()
 *            (uses streaming + thinking mode exactly as the official sample)
 * Fallback : OpenRouter — google/gemini-2.0-flash-exp:free
 *            (free tier, OpenAI-compatible, already have the key)
 */
class AIService {
  constructor() {
    // Fallback via OpenRouter (OpenAI-compatible)
    this.openrouterClient = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY || 'missing-openrouter-key',
      baseURL: 'https://openrouter.ai/api/v1',
    });

    if (!process.env.NVIDIA_API_KEY) {
      console.warn('[AIService] WARNING: NVIDIA_API_KEY not set.');
    }
    if (!process.env.OPENROUTER_API_KEY) {
      console.warn('[AIService] WARNING: OPENROUTER_API_KEY not set — fallback unavailable.');
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

IMPORTANT: "score" MUST be an integer 0-100. Do NOT return 0.85 — return 85.

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
  // PRIMARY: GLM-5.1 via NVIDIA NIM
  // Uses native fetch() so chat_template_kwargs is NOT stripped.
  // This matches the official NVIDIA sample code exactly.
  // ─────────────────────────────────────────────────────────

  async _analyzeWithGLM(resumeText, jobDescription) {
    console.log('[AIService] Calling GLM-5.1 via NVIDIA NIM (native fetch, streaming)...');

    const controller = new AbortController();
    // 120 s — thinking mode needs extra time
    const timer = setTimeout(() => controller.abort(), 120_000);

    let response;
    try {
      response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          model: 'z-ai/glm-5.1',
          messages: [
            { role: 'system', content: AIService.buildSystemPrompt() },
            { role: 'user',   content: AIService.buildUserPrompt(resumeText, jobDescription) },
          ],
          temperature: 1,
          top_p: 1,
          max_tokens: 16384,
          // chat_template_kwargs sent directly — no SDK stripping
          chat_template_kwargs: { enable_thinking: true, clear_thinking: true },
          stream: true,
        }),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timer);
      if (fetchErr.name === 'AbortError') throw new Error('GLM-5.1 timed out after 120 s');
      throw fetchErr;
    }

    clearTimeout(timer);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('[AIService] NVIDIA API HTTP error:', response.status, errText.slice(0, 300));
      throw new Error(`NVIDIA API returned ${response.status}: ${errText.slice(0, 200)}`);
    }

    // Parse SSE stream — collect only content tokens (not reasoning_content)
    const rawBody = await response.text();
    let content = '';
    for (const line of rawBody.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') break;
      try {
        const chunk = JSON.parse(data);
        content += chunk.choices?.[0]?.delta?.content || '';
      } catch {
        // skip malformed lines
      }
    }

    console.log('[AIService] GLM-5.1 stream complete. Content length:', content.length);
    if (!content.trim()) throw new Error('GLM-5.1 returned empty content');
    return content;
  }

  // ─────────────────────────────────────────────────────────
  // FALLBACK: OpenRouter — free Gemini model
  // (OpenAI-compatible, uses the OPENROUTER_API_KEY already in .env)
  // ─────────────────────────────────────────────────────────

  async _analyzeWithOpenRouter(resumeText, jobDescription) {
    console.log('[AIService] Using OpenRouter fallback (gemini-2.0-flash-exp:free)...');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90_000);

    try {
      const completion = await this.openrouterClient.chat.completions.create(
        {
          model: 'google/gemini-2.0-flash-exp:free',
          messages: [
            { role: 'system', content: AIService.buildSystemPrompt() },
            { role: 'user',   content: AIService.buildUserPrompt(resumeText, jobDescription) },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        },
        { signal: controller.signal }
      );
      clearTimeout(timer);

      const text = completion.choices?.[0]?.message?.content || '';
      console.log('[AIService] OpenRouter response length:', text.length);
      return text;

    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        throw new Error('OpenRouter timed out after 90 s');
      }
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
      console.warn('[AIService] GLM-5.1 failed:', glmErr.message, '→ trying OpenRouter fallback...');
      try {
        raw = await this._analyzeWithOpenRouter(resumeText, jobDescription);
      } catch (orErr) {
        console.error('[AIService] Both providers failed.', orErr.message);
        throw new Error(
          'AI analysis failed on all providers. Please try again later. (' + orErr.message + ')'
        );
      }
    }

    // Parse + normalize
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
  // Public: rewriteText  (Pro/Premium)
  // ─────────────────────────────────────────────────────────

  async rewriteText(text, tone = 'professional') {
    const systemPrompt = `You are an expert resume writer. Rewrite the bullet point to be more impactful.
TONE: ${tone}
RULES: Start with action verb. Quantify if possible. 1-2 sentences max. No fabricated numbers. Return ONLY the rewritten text.`;

    // Try GLM-5.1
    try {
      console.log('[AIService] Rewrite — calling GLM-5.1...');
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 45_000);

      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
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
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (response.ok) {
        const rawBody = await response.text();
        let content = '';
        for (const line of rawBody.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') break;
          try { content += JSON.parse(data).choices?.[0]?.delta?.content || ''; } catch {}
        }
        if (content.trim()) return content.trim();
      }
    } catch (glmErr) {
      console.warn('[AIService] GLM-5.1 rewrite failed:', glmErr.message);
    }

    // OpenRouter fallback
    console.log('[AIService] Rewrite — using OpenRouter fallback...');
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30_000);
      const completion = await this.openrouterClient.chat.completions.create(
        {
          model: 'google/gemini-2.0-flash-exp:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: text },
          ],
          temperature: 0.5,
          max_tokens: 200,
        },
        { signal: controller.signal }
      );
      clearTimeout(timer);
      return (completion.choices?.[0]?.message?.content || '').trim();
    } catch (orErr) {
      console.error('[AIService] Both rewrite providers failed:', orErr.message);
      throw new Error('Failed to rewrite text: ' + orErr.message);
    }
  }
}

module.exports = new AIService();
