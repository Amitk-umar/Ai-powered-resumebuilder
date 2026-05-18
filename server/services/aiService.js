const OpenAI = require('openai');

/**
 * AI Service
 * Primary  : OpenRouter — deepseek/deepseek-v4-flash:free (Excellent at structured JSON)
 * Fallback : OpenRouter — meta-llama/llama-3.3-70b-instruct:free (Robust, large model)
 */
class AIService {
  constructor() {
    // OpenRouter client (OpenAI-compatible)
    this.openrouterClient = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY || 'missing-openrouter-key',
      baseURL: 'https://openrouter.ai/api/v1',
    });

    if (!process.env.OPENROUTER_API_KEY) {
      console.warn('[AIService] WARNING: OPENROUTER_API_KEY not set — AI features will fail.');
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
    if (!raw) return '{}';
    
    // Find the first '{' and the last '}' in the entire string
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      // Extract exactly the JSON object, ignoring all markdown, <think> tags, or conversational text
      return raw.substring(firstBrace, lastBrace + 1);
    }
    
    // If no braces found, return as is (will likely fail JSON.parse, but nothing else we can do)
    return raw;
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
  // OpenRouter Execution
  // ─────────────────────────────────────────────────────────

  async _analyzeWithOpenRouter(model, resumeText, jobDescription) {
    console.log(`[AIService] OpenRouter analyzing with: ${model}...`);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90_000);

    try {
      const completion = await this.openrouterClient.chat.completions.create(
        {
          model,
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
      console.log(`[AIService] OpenRouter (${model}) response length:`, text.length);
      if (!text.trim()) throw new Error(`${model} returned empty content`);
      return text;

    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        throw new Error(`OpenRouter ${model} timed out after 90 s`);
      }
      throw err;
    }
  }

  // ─────────────────────────────────────────────────────────
  // Public: analyzeResumeVsJD
  // ─────────────────────────────────────────────────────────

  async analyzeResumeVsJD(resumeText, jobDescription) {
    let raw = '';

    // 1. Try DeepSeek V4 Flash (Primary)
    try {
      raw = await this._analyzeWithOpenRouter(
        'deepseek/deepseek-v4-flash:free', resumeText, jobDescription
      );
    } catch (dsErr) {
      console.warn('[AIService] DeepSeek V4 Flash failed:', dsErr.message);

      // 2. Try Llama 3.3 70B (Fallback)
      try {
        raw = await this._analyzeWithOpenRouter(
          'meta-llama/llama-3.3-70b-instruct:free', resumeText, jobDescription
        );
      } catch (llamaErr) {
        console.error('[AIService] All providers failed:', llamaErr.message);
        throw new Error(
          'AI analysis failed on all providers. Please try again later. (' + llamaErr.message + ')'
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
      console.error('[AIService] JSON parse failed. Raw snippet:', raw?.slice(0, 500));
      throw new Error('AI returned an invalid response format. Please try again.');
    }
  }

  // ─────────────────────────────────────────────────────────
  // Public: rewriteText  (Pro/Premium bullet rewriter)
  // ─────────────────────────────────────────────────────────

  async rewriteText(text, tone = 'professional') {
    const systemPrompt = `You are an expert resume writer. Rewrite the bullet point to be more impactful.
TONE: ${tone}
RULES: Start with a strong action verb. Quantify if possible. 1-2 sentences max. No fabricated numbers. Return ONLY the rewritten text — no explanation.`;

    // 1. Try DeepSeek V4 Flash
    try {
      console.log('[AIService] Rewrite — using OpenRouter DeepSeek...');
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30_000);
      
      const completion = await this.openrouterClient.chat.completions.create(
        {
          model: 'deepseek/deepseek-v4-flash:free',
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
      
      const result = (completion.choices?.[0]?.message?.content || '').trim();
      if (result) return result;
      throw new Error("Empty response");
      
    } catch (dsErr) {
      console.warn('[AIService] DeepSeek rewrite failed:', dsErr.message);
      
      // 2. Fallback to Llama
      try {
        console.log('[AIService] Rewrite — using OpenRouter Llama fallback...');
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 30_000);
        
        const completion = await this.openrouterClient.chat.completions.create(
          {
            model: 'meta-llama/llama-3.3-70b-instruct:free',
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
      } catch (llamaErr) {
        console.error('[AIService] Both rewrite providers failed:', llamaErr.message);
        throw new Error('Failed to rewrite text: ' + llamaErr.message);
      }
    }
  }
}

module.exports = new AIService();
