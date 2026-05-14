import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FloatingOrbs from '../components/FloatingOrbs';
import {
  HiUpload, HiDocumentText, HiSearch, HiChartBar,
  HiLightningBolt, HiCheckCircle, HiExclamationCircle,
  HiXCircle, HiInformationCircle
} from 'react-icons/hi';
import './ResumeScreener.css';

/**
 * Extract text from a PDF file using pdfjs-dist
 */
async function extractPdfText(file) {
  const pdfjsLib = await import('pdfjs-dist');
  const workerSrc = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc.default;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

/**
 * Extract keywords from job description text
 */
function extractJDKeywords(jdText) {
  const jdLower = jdText.toLowerCase();

  // Multi-word phrases MUST be checked first (longer phrases before shorter ones)
  const multiWordKeywords = [
    'machine learning', 'deep learning', 'artificial intelligence',
    'natural language processing', 'computer vision',
    'version control', 'source control',
    'rest api', 'restful api', 'web api', 'api gateway', 'api development',
    'front end', 'frontend development', 'back end', 'backend development',
    'full stack', 'full-stack',
    'data structures', 'data science', 'data analysis', 'data engineering',
    'big data', 'data visualization', 'data modeling',
    'cloud computing', 'cloud services', 'cloud infrastructure',
    'ci/cd', 'ci cd', 'continuous integration', 'continuous deployment',
    'unit testing', 'integration testing', 'test driven', 'test automation',
    'project management', 'product management',
    'system design', 'software architecture', 'design patterns',
    'object oriented', 'functional programming',
    'responsive design', 'web design', 'ui design', 'ux design', 'ui/ux',
    'user experience', 'user interface',
    'mobile development', 'cross platform',
    'react native', 'react.js', 'reactjs',
    'node.js', 'nodejs', 'next.js', 'nextjs', 'vue.js', 'vuejs',
    'asp.net', '.net core', '.net framework',
    'spring boot', 'ruby on rails',
    'google cloud', 'google cloud platform',
    'power bi', 'scikit-learn', 'scikit learn',
    'problem solving', 'critical thinking', 'time management',
    'team collaboration', 'cross functional',
    'software development', 'web development', 'app development',
    'agile methodology', 'scrum master',
    'database management', 'database design',
    'network security', 'information security', 'cyber security',
    'operating systems', 'distributed systems',
    'content management', 'search engine optimization',
  ];

  // Single-word tech keywords (only real tech terms, no generic English words)
  const singleKeywords = [
    // Languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby',
    'golang', 'rust', 'swift', 'kotlin', 'php', 'scala', 'perl',
    'r', 'matlab', 'dart', 'lua', 'haskell', 'elixir',
    // Frontend
    'react', 'angular', 'vue', 'svelte', 'jquery', 'webpack', 'vite',
    'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less',
    'tailwind', 'bootstrap', 'chakra',
    // Backend
    'express', 'django', 'flask', 'fastapi', 'spring', 'laravel',
    'rails', 'sinatra', 'graphql', 'grpc',
    // Databases
    'mongodb', 'postgresql', 'postgres', 'mysql', 'redis', 'firebase',
    'dynamodb', 'sql', 'nosql', 'elasticsearch', 'sqlite', 'oracle',
    'cassandra', 'couchdb', 'mariadb', 'supabase',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'k8s',
    'jenkins', 'terraform', 'ansible', 'puppet', 'chef',
    'linux', 'unix', 'nginx', 'apache', 'heroku', 'vercel', 'netlify',
    'cloudflare', 'digitalocean',
    // Tools
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence',
    'figma', 'sketch', 'postman', 'swagger', 'grafana', 'prometheus',
    'kibana', 'splunk', 'datadog', 'sentry',
    // AI/ML
    'tensorflow', 'pytorch', 'keras', 'pandas', 'numpy', 'opencv',
    'tableau', 'hadoop', 'spark', 'kafka', 'airflow', 'dbt',
    // Mobile
    'android', 'ios', 'flutter', 'xamarin', 'ionic', 'cordova',
    // Concepts (only specific tech concepts)
    'microservices', 'serverless', 'devops', 'blockchain', 'web3',
    'solidity', 'oauth', 'jwt', 'websocket', 'graphql',
    'redis', 'rabbitmq', 'celery', 'socket.io',
    // Methodologies
    'agile', 'scrum', 'kanban',
  ];

  const matched = new Set();

  // Step 1: Check multi-word phrases first
  multiWordKeywords.forEach(phrase => {
    if (jdLower.includes(phrase)) {
      matched.add(phrase);
    }
  });

  // Step 2: Check single keywords, but skip if already covered by a multi-word phrase
  singleKeywords.forEach(keyword => {
    if (jdLower.includes(keyword)) {
      // Don't add "react" if "react native" already matched, etc.
      const alreadyCovered = [...matched].some(m => m.includes(keyword) && m !== keyword);
      if (!alreadyCovered) {
        matched.add(keyword);
      }
    }
  });

  return [...matched];
}

/**
 * Perform REAL analysis comparing resume text against job description
 */
function analyzeResumeVsJD(resumeText, jobDescription) {
  const resumeLower = resumeText.toLowerCase();
  const jdKeywords = extractJDKeywords(jobDescription);

  const matched = [];
  const missing = [];

  jdKeywords.forEach(keyword => {
    if (resumeLower.includes(keyword)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  // Calculate keyword match score
  const keywordScore = jdKeywords.length > 0
    ? (matched.length / jdKeywords.length) * 100
    : 0;

  // Formatting analysis
  let formatScore = 100;
  const formatIssues = [];

  const sections = ['experience', 'education', 'skills'];
  sections.forEach(s => {
    if (!resumeLower.includes(s)) {
      formatScore -= 10;
      formatIssues.push(`Missing standard section: "${s}" — ATS systems look for this heading`);
    }
  });

  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 100) {
    formatScore -= 15;
    formatIssues.push('Resume text is very short. Ensure your PDF is text-based, not a scanned image.');
  }

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (!emailRegex.test(resumeText)) {
    formatScore -= 10;
    formatIssues.push('No email address detected in resume.');
  }

  const actionVerbs = ['led', 'developed', 'implemented', 'designed', 'managed', 'built',
    'created', 'improved', 'achieved', 'delivered', 'increased', 'reduced'];
  if (!actionVerbs.some(v => resumeLower.includes(v))) {
    formatScore -= 10;
    formatIssues.push('Use action verbs (Led, Developed, Implemented) to describe achievements.');
  }

  if (formatIssues.length === 0) {
    formatIssues.push('Good formatting! Your resume follows ATS best practices.');
  }

  // Overall score (70% keyword match, 30% formatting)
  const overallScore = Math.round(keywordScore * 0.7 + Math.max(formatScore, 0) * 0.3);

  // Generate suggestions
  const suggestions = [];
  if (missing.length > 0) {
    suggestions.push(`Add these missing keywords to your resume: ${missing.slice(0, 5).join(', ')}`);
  }
  if (missing.length > matched.length) {
    suggestions.push('Your resume has low keyword overlap with this job. Tailor it more closely.');
  }
  if (wordCount < 300) {
    suggestions.push('Your resume seems short. Add more details about your experience and projects.');
  }
  if (!resumeLower.includes('summary') && !resumeLower.includes('objective') && !resumeLower.includes('profile')) {
    suggestions.push('Add a Professional Summary section tailored to this specific role.');
  }
  suggestions.push('Use bullet points with quantifiable achievements (numbers, percentages, metrics).');
  suggestions.push('Ensure your resume is saved as a text-based PDF (not scanned image) for ATS parsing.');

  return {
    score: Math.min(Math.max(overallScore, 0), 100),
    matchedKeywords: matched,
    missingKeywords: missing,
    suggestions: suggestions.slice(0, 6),
    formatting: {
      score: Math.max(formatScore, 0),
      issues: formatIssues
    },
    details: {
      totalKeywords: jdKeywords.length,
      matchedCount: matched.length,
      missingCount: missing.length,
      resumeWordCount: wordCount
    }
  };
}

export default function ResumeScreener() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (f) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(f.type)) {
      alert('Please upload a PDF or DOCX file.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }
    setFile(f);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
  };

  const analyzeResume = async () => {
    if (!file || !jobDescription.trim()) {
      alert('Please upload a resume and enter a job description.');
      return;
    }

    setAnalyzing(true);
    setResults(null);

    try {
      // Step 1: Extract text from PDF on client side
      let resumeText = '';
      if (file.type === 'application/pdf') {
        resumeText = await extractPdfText(file);
      } else {
        resumeText = await file.text();
      }

      if (!resumeText || resumeText.trim().length < 20) {
        alert('Could not extract text from your resume. Make sure it is a text-based PDF (not a scanned image).');
        setAnalyzing(false);
        return;
      }

      // Step 2: Try backend first
      try {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        const response = await api.post('/screen', formData);

        if (response.ok) {
          const data = await response.json();
          setResults(data);
          await saveScreening(file.name, data);
          setAnalyzing(false);
          return;
        }
      } catch (backendErr) {
        console.log('Backend unavailable, using client-side analysis');
      }

      // Step 3: Client-side analysis with REAL resume text
      const analysisResults = analyzeResumeVsJD(resumeText, jobDescription);
      setResults(analysisResults);
      await saveScreening(file.name, analysisResults);
    } catch (err) {
      console.error('Analysis error:', err);
      alert('Error analyzing resume: ' + err.message);
    }

    setAnalyzing(false);
  };

  // Save screening result to MongoDB via API
  const saveScreening = async (fileName, data) => {
    try {
      await api.post('/screenings', {
        fileName,
        score: data.score,
        matchedKeywords: data.matchedKeywords || [],
        missingKeywords: data.missingKeywords || [],
        matchedCount: data.matchedKeywords?.length || 0,
        missingCount: data.missingKeywords?.length || 0,
        suggestions: data.suggestions || [],
        formatting: data.formatting || { score: 0, issues: [] },
      });
    } catch (err) {
      console.error('Could not save screening to server:', err);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Poor';
  };

  const circumference = 2 * Math.PI * 52;

  return (
    <div className="page screener-page">
      <FloatingOrbs />
      <div className="container">
        <div className="page-header fade-in-up">
          <h1>AI Resume <span className="gradient-text">Screener</span></h1>
          <p>Upload a resume and job description to get an instant ATS compatibility analysis</p>
        </div>

        <div className="screener-content">
          {/* Input Section */}
          <div className="screener-input fade-in-up delay-1">
            {/* Upload */}
            <div className="upload-section glass-card">
              <h3><HiDocumentText /> Upload Resume</h3>
              <div
                className={`upload-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  hidden
                />
                {file ? (
                  <div className="file-info">
                    <HiCheckCircle className="file-check" />
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <HiUpload className="upload-icon" />
                    <p>Drag & drop your resume here</p>
                    <span>or click to browse (PDF, DOCX • Max 5MB)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="jd-section glass-card">
              <h3><HiSearch /> Job Description</h3>
              <textarea
                className="form-input form-textarea jd-textarea"
                rows="8"
                placeholder="Paste the job description here...&#10;&#10;Example: We are looking for a Full Stack Developer with experience in React, Node.js, MongoDB..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary btn-lg analyze-btn"
              onClick={analyzeResume}
              disabled={!file || !jobDescription.trim() || analyzing}
            >
              {analyzing ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <HiLightningBolt /> Analyze Resume
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="screener-results fade-in-up">
              {/* Score */}
              <div className="score-section glass-card">
                <h3><HiChartBar /> ATS Compatibility Score</h3>
                <div className="score-display">
                  <div className="score-ring">
                    <svg viewBox="0 0 120 120" width="120" height="120">
                      <circle className="ring-bg" cx="60" cy="60" r="52" />
                      <circle
                        className={`ring-fill ${getScoreColor(results.score)}`}
                        cx="60" cy="60" r="52"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (results.score / 100) * circumference}
                      />
                    </svg>
                    <div className="score-value">
                      <span className="number">{results.score}</span>
                      <span className="label">{getScoreLabel(results.score)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="keywords-section glass-card">
                <h3><HiCheckCircle style={{ color: 'var(--success)' }} /> Matched Keywords</h3>
                <div className="keyword-tags">
                  {results.matchedKeywords.map((kw, i) => (
                    <span key={i} className="keyword-tag matched">{kw}</span>
                  ))}
                </div>
              </div>

              <div className="keywords-section glass-card">
                <h3><HiExclamationCircle style={{ color: 'var(--warning)' }} /> Missing Keywords</h3>
                <div className="keyword-tags">
                  {results.missingKeywords.map((kw, i) => (
                    <span key={i} className="keyword-tag missing">{kw}</span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="suggestions-section glass-card">
                <h3><HiInformationCircle style={{ color: 'var(--accent-primary)' }} /> Improvement Suggestions</h3>
                <ul className="suggestions-list">
                  {results.suggestions.map((s, i) => (
                    <li key={i}>
                      <HiLightningBolt className="suggestion-icon" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formatting */}
              {results.formatting && (
                <div className="formatting-section glass-card">
                  <h3>Formatting Score: <span className={`badge badge-${getScoreColor(results.formatting.score)}`}>{results.formatting.score}/100</span></h3>
                  <ul className="suggestions-list">
                    {results.formatting.issues.map((issue, i) => (
                      <li key={i}>
                        <HiInformationCircle className="suggestion-icon" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
