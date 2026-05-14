const OpenAI = require('openai');
const pdfParse = require('pdf-parse');

class AIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY || '',
      baseURL: 'https://openrouter.ai/api/v1',
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
    try {
      const response = await this.client.chat.completions.create({
        model: 'google/gemini-2.0-flash-001', 
        messages: [
          {
            role: 'system',
            content: `You are an expert AI Resume Screener, Career Coach, and Technical Recruiter.
            Analyze the provided resume against the job description and return a structured JSON response.
            
            For jobRecommendations, provide a realistic 'applicationUrl' which could be a Google Search link for the role at that company or a direct link if known.
            
            JSON Schema:
            {
              "score": number,
              "matchedKeywords": string[],
              "missingKeywords": string[],
              "analysis": {
                "skills": string,
                "education": string,
                "experience": string,
                "certifications": string,
                "projects": string,
                "overallQuality": string
              },
              "careerGuidance": {
                "coachingSuggestions": string[],
                "improvementAreas": string[],
                "missingSkills": string[],
                "enhancementStrategies": string[],
                "industryGuidance": string
              },
              "jobRecommendations": [
                {
                  "company": string,
                  "role": string,
                  "opportunity": string,
                  "jd": string,
                  "qualifications": string[],
                  "skills": string[],
                  "eligibility": string,
                  "applicationUrl": string
                }
              ],
              "formatting": {
                "score": number,
                "issues": string[]
              }
            }`
          },
          {
            role: 'user',
            content: `Resume Text:
            ${resumeText}
            
            Job Description:
            ${jobDescription}`
          }
        ],
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);

    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to analyze resume with AI: ' + error.message);
    }
  }
}

module.exports = new AIService();
