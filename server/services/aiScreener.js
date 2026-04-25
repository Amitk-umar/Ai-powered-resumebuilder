const pdfParse = require('pdf-parse');

/**
 * AI Resume Screening Service
 * Analyzes resume text against job description for ATS compatibility
 */
class AIScreener {
  /**
   * Extract text from uploaded PDF buffer
   */
  static async extractText(buffer) {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      console.error('PDF parsing error:', error.message);
      return '';
    }
  }

  /**
   * Main screening function
   */
  static analyze(resumeText, jobDescription) {
    const resumeLower = resumeText.toLowerCase();
    const jdLower = jobDescription.toLowerCase();

    // Extract keywords from job description
    const jdKeywords = this.extractKeywords(jdLower);
    
    // Match keywords
    const matched = [];
    const missing = [];

    jdKeywords.forEach(keyword => {
      if (resumeLower.includes(keyword)) {
        matched.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    // Calculate score
    const keywordScore = jdKeywords.length > 0
      ? (matched.length / jdKeywords.length) * 100
      : 50;

    // Formatting analysis
    const formattingScore = this.analyzeFormatting(resumeText);

    // Overall score (70% keywords, 30% formatting)
    const overallScore = Math.round(keywordScore * 0.7 + formattingScore.score * 0.3);

    // Generate suggestions
    const suggestions = this.generateSuggestions(resumeText, jdLower, matched, missing);

    return {
      score: Math.min(overallScore, 100),
      matchedKeywords: matched,
      missingKeywords: missing,
      suggestions,
      formatting: formattingScore,
      details: {
        totalKeywords: jdKeywords.length,
        matchedCount: matched.length,
        missingCount: missing.length,
        keywordMatchRate: jdKeywords.length > 0
          ? Math.round((matched.length / jdKeywords.length) * 100)
          : 0
      }
    };
  }

  /**
   * Extract meaningful keywords from text
   */
  static extractKeywords(text) {
    // Common tech & business keywords to look for
    const keywordPatterns = [
      // Programming languages
      'javascript', 'typescript', 'python', 'java', 'c\\+\\+', 'c#', 'ruby', 'go', 'rust',
      'swift', 'kotlin', 'php', 'scala', 'r\\b',
      // Frontend
      'react', 'angular', 'vue', 'next\\.js', 'nextjs', 'html', 'css', 'sass', 'tailwind',
      'bootstrap', 'webpack', 'vite',
      // Backend
      'node\\.js', 'nodejs', 'express', 'django', 'flask', 'spring', 'fastapi',
      '.net', 'graphql', 'rest api', 'microservices',
      // Databases
      'mongodb', 'postgresql', 'mysql', 'redis', 'firebase', 'dynamodb', 'sql',
      'elasticsearch',
      // Cloud & DevOps
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'terraform',
      'linux', 'nginx',
      // Tools
      'git', 'github', 'jira', 'figma', 'postman', 'vs code',
      // Data & AI
      'machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch',
      'data analysis', 'data science', 'big data', 'hadoop', 'spark',
      // Soft skills & concepts
      'agile', 'scrum', 'leadership', 'communication', 'teamwork', 'problem solving',
      'project management', 'stakeholder', 'cross-functional',
      // Other common
      'testing', 'unit test', 'automation', 'security', 'performance', 'optimization',
      'deployment', 'monitoring', 'analytics', 'design patterns'
    ];

    const found = [];
    keywordPatterns.forEach(pattern => {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(text)) {
        found.push(pattern.replace(/\\\+/g, '+').replace(/\\\./g, '.').replace(/\\b/g, ''));
      }
    });

    // Also extract capitalized proper nouns and technical terms
    const words = text.split(/\s+/);
    const additionalTerms = new Set();
    words.forEach(word => {
      const clean = word.replace(/[^a-zA-Z0-9+#.]/g, '');
      if (clean.length >= 3 && clean.length <= 20) {
        // Look for common certification/degree patterns
        const certPatterns = ['pmp', 'aws', 'cpa', 'mba', 'phd', 'bsc', 'msc'];
        if (certPatterns.includes(clean.toLowerCase())) {
          additionalTerms.add(clean.toLowerCase());
        }
      }
    });

    return [...new Set([...found, ...additionalTerms])];
  }

  /**
   * Analyze resume formatting for ATS compatibility
   */
  static analyzeFormatting(text) {
    let score = 100;
    const issues = [];

    // Check for standard sections
    const requiredSections = ['experience', 'education', 'skills'];
    const optionalSections = ['summary', 'projects', 'certifications'];

    requiredSections.forEach(section => {
      const regex = new RegExp(section, 'i');
      if (!regex.test(text)) {
        score -= 10;
        issues.push(`Missing standard section: "${section}" — ATS systems look for this heading`);
      }
    });

    // Check length (should be 300-3000 words)
    const wordCount = text.split(/\s+/).length;
    if (wordCount < 150) {
      score -= 15;
      issues.push('Resume appears too short. Aim for at least 300 words for better ATS coverage.');
    } else if (wordCount > 3000) {
      score -= 5;
      issues.push('Resume may be too long. Keep it concise (1-2 pages) for optimal ATS parsing.');
    }

    // Check for contact info
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /[\d\s\-().+]{10,}/;
    if (!emailRegex.test(text)) {
      score -= 10;
      issues.push('No email address detected. Include your email for recruiters to contact you.');
    }
    if (!phoneRegex.test(text)) {
      score -= 5;
      issues.push('No phone number detected. Consider adding a contact number.');
    }

    // Check for action verbs
    const actionVerbs = ['led', 'developed', 'implemented', 'designed', 'managed', 'built',
      'created', 'improved', 'achieved', 'delivered', 'increased', 'reduced'];
    const hasActionVerbs = actionVerbs.some(v => text.toLowerCase().includes(v));
    if (!hasActionVerbs) {
      score -= 10;
      issues.push('Use action verbs (Led, Developed, Implemented) to describe achievements.');
    }

    // Check for quantifiable results
    const numberPattern = /\d+%|\d+\s*(users|customers|revenue|growth|increase|decrease)/i;
    if (!numberPattern.test(text)) {
      score -= 5;
      issues.push('Add quantifiable achievements (numbers, percentages) to strengthen your resume.');
    }

    if (issues.length === 0) {
      issues.push('Great formatting! Your resume follows ATS best practices.');
    }

    return {
      score: Math.max(score, 0),
      issues
    };
  }

  /**
   * Generate improvement suggestions
   */
  static generateSuggestions(resumeText, jdText, matched, missing) {
    const suggestions = [];

    if (missing.length > 0) {
      suggestions.push(
        `Add these missing keywords from the job description: ${missing.slice(0, 5).join(', ')}`
      );
    }

    if (missing.length > matched.length) {
      suggestions.push(
        'Your resume has a low keyword match rate. Tailor it more closely to the job description.'
      );
    }

    // General suggestions
    suggestions.push(
      'Use bullet points to describe achievements — ATS systems parse these better than paragraphs'
    );

    if (!resumeText.toLowerCase().includes('summary') && !resumeText.toLowerCase().includes('objective')) {
      suggestions.push(
        'Add a Professional Summary at the top of your resume to immediately capture attention'
      );
    }

    suggestions.push(
      'Ensure your resume is saved as a clean PDF (not scanned image) for optimal ATS parsing'
    );

    if (matched.length < 5) {
      suggestions.push(
        'Consider adding a dedicated Skills section that mirrors the job requirements'
      );
    }

    return suggestions.slice(0, 6); // Return max 6 suggestions
  }
}

module.exports = AIScreener;
