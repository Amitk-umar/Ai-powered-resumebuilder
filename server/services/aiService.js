const OpenAI = require('openai');
const pdfParse = require('pdf-parse');

class AIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY || 'missing-key-prevent-crash',
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });
  }

  static async extractText(buffer) {
    try {
      const parse = typeof pdfParse === 'function' ? pdfParse : (pdfParse.PDFParse || pdfParse.default);
      if (typeof parse !== 'function') {
        throw new Error('pdf-parse is not a function');
      }
      const data = await parse(buffer);
      return data.text;
    } catch (error) {
      console.error('PDF parsing error:', error.message);
      return '';
    }
  }

  async analyzeResumeVsJD(resumeText, jobDescription) {
    const systemPrompt = `You are a professional ATS (Applicant Tracking System) resume analyzer and career coach.

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
}`;

    const userPrompt = `Analyze this resume against the job description below. Return a raw JSON object only — no markdown, no code fences.

===RESUME===
${resumeText}

===JOB DESCRIPTION===
${jobDescription}`;

    try {
      console.log('Calling GLM-5.1 via NVIDIA NIM...');

      const completion = await this.client.chat.completions.create({
        model: 'z-ai/glm-5.1',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 4096,
        stream: false,
      });

      let content = completion.choices[0]?.message?.content || '';
      console.log('GLM-5.1 raw response length:', content.length);

      // Strip any markdown code fences the model might add despite instructions
      content = content.trim();
      if (content.startsWith('```')) {
        content = content.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
      }

      // Extract JSON object if there's surrounding text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }

      const parsed = JSON.parse(content);

      // Normalize score: guard against AI returning decimal (0-1) instead of integer (0-100)
      if (parsed.score !== undefined) {
        if (parsed.score > 0 && parsed.score <= 1) {
          parsed.score = Math.round(parsed.score * 100);
        } else {
          parsed.score = Math.min(100, Math.max(0, Math.round(parsed.score)));
        }
      }

      // Normalize formatting score
      if (parsed.formatting?.score !== undefined) {
        if (parsed.formatting.score > 0 && parsed.formatting.score <= 1) {
          parsed.formatting.score = Math.round(parsed.formatting.score * 100);
        } else {
          parsed.formatting.score = Math.min(100, Math.max(0, Math.round(parsed.formatting.score)));
        }
      }

      console.log('Analysis complete. Score:', parsed.score);
      return parsed;

    } catch (error) {
      console.error('AI Service Error:', error?.message || error);
      throw new Error('Failed to analyze resume with AI: ' + (error?.message || error));
    }
  }

  async rewriteText(text, tone = 'professional') {
    const systemPrompt = `You are an expert resume writer. Your task is to rewrite the provided resume bullet point or text to be more impactful, professional, and results-oriented.
    
    TONE: ${tone}
    
    RULES:
    1. Start with a strong action verb.
    2. Quantify results where possible (if the original implies metrics, emphasize them).
    3. Keep it concise (1-2 sentences maximum).
    4. Do not add made-up numbers if none exist or aren't implied.
    5. Return ONLY the rewritten text, no explanations, no quotes, no formatting.`;

    try {
      console.log('Calling GLM-5.1 for Rewrite...');
      const completion = await this.client.chat.completions.create({
        model: 'z-ai/glm-5.1',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        temperature: 0.5,
        max_tokens: 200,
        stream: false,
      });

      let content = completion.choices[0]?.message?.content || '';
      return content.trim();
    } catch (error) {
      console.error('AI Rewrite Error:', error?.message || error);
      throw new Error('Failed to rewrite text: ' + (error?.message || error));
    }
  }
}

module.exports = new AIService();
