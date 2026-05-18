import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FloatingOrbs from '../components/FloatingOrbs';
import {
  HiUpload, HiDocumentText, HiSearch, HiChartBar,
  HiLightningBolt, HiCheckCircle, HiExclamationCircle,
  HiInformationCircle, HiBriefcase, HiAcademicCap, HiFolder,
  HiExternalLink, HiShieldCheck, HiStar, HiTrendingUp,
  HiClipboardCheck, HiCog, HiGlobe
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

export default function ResumeScreener() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [planLimits, setPlanLimits] = useState({ reached: false, message: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) loadPlan();
  }, [user]);

  const loadPlan = async () => {
    try {
      const res = await api.get('/plans/me');
      if (!res.ok) return;
      const data = await res.json();
      
      const currentScans = data.userPlan?.screeningsCount || user?.screeningsCount || 0;
      const maxScans = data.plan?.maxAtsScans || 3;
      
      if (currentScans >= maxScans) {
        setPlanLimits({ 
          reached: true, 
          message: `ATS Scan limit reached (${currentScans}/${maxScans}). Upgrade your plan to scan more resumes.` 
        });
      }
    } catch (error) {
      console.log('Plan load skipped:', error.message);
    }
  };

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

      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);
      formData.append('resumeText', resumeText);

      const response = await api.post('/screen', formData);

      if (response.ok) {
        const data = await response.json();
        // Normalize score on frontend too (guard against AI returning 0-1 decimal)
        if (data.score !== undefined && data.score > 0 && data.score <= 1) {
          data.score = Math.round(data.score * 100);
        }
        if (data.score !== undefined) {
          data.score = Math.min(100, Math.max(0, Math.round(data.score)));
        }
        if (data.formatting?.score !== undefined && data.formatting.score > 0 && data.formatting.score <= 1) {
          data.formatting.score = Math.round(data.formatting.score * 100);
        }
        setResults(data);
        await saveScreening(file.name, data);
        loadPlan(); // Reload plan to update counts
      } else {
        const errData = await response.json();
        alert('Analysis failed: ' + (errData.error || 'Unknown error'));
        if (response.status === 403 && errData.error.includes('limit')) {
          loadPlan();
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
      alert('Error analyzing resume: Please check your network or try again.');
    }

    setAnalyzing(false);
  };

  const saveScreening = async (fileName, data) => {
    try {
      await api.post('/screenings', {
        fileName,
        score: data.score,
        matchedKeywords: data.matchedKeywords || [],
        missingKeywords: data.missingKeywords || [],
        matchedCount: data.matchedKeywords?.length || 0,
        missingCount: data.missingKeywords?.length || 0,
        analysis: data.analysis || {},
        careerGuidance: data.careerGuidance || {},
        jobRecommendations: data.jobRecommendations || [],
        formatting: data.formatting || { score: 0, issues: [] },
      });
    } catch (err) {
      console.error('Could not save screening to server:', err);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'average';
    return 'poor';
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    if (score >= 50) return 'Moderate Match';
    if (score >= 30) return 'Low Match';
    return 'Poor Match';
  };

  const getScoreEmoji = (score) => {
    if (score >= 85) return '🎯';
    if (score >= 70) return '✅';
    if (score >= 50) return '⚡';
    return '⚠️';
  };

  const getKeywordMatchRate = () => {
    const total = (results?.matchedKeywords?.length || 0) + (results?.missingKeywords?.length || 0);
    if (total === 0) return 0;
    return Math.round((results.matchedKeywords.length / total) * 100);
  };

  const circumference = 2 * Math.PI * 56;

  return (
    <div className="page screener-page">
      <FloatingOrbs />
      <div className="container">

        {/* ── Hero ──────────────────────────── */}
        <div className="screener-hero">
          <div className="screener-hero-badge">
            <HiLightningBolt /> AI-Powered Analysis
          </div>
          <h1>Resume <span className="gradient-text">Screener & Coach</span></h1>
          <p className="screener-hero-desc">
            Upload your resume against any job description to get deep ATS analysis,
            keyword matching, career coaching, and personalized job recommendations.
          </p>
        </div>

        {/* ── Input Grid ───────────────────── */}
        <div className="screener-input-grid">

          {/* Upload Card */}
          <div className="screener-card">
            <div className="screener-card-header">
              <div className="screener-card-icon upload"><HiDocumentText /></div>
              <span className="screener-card-title">Upload Resume</span>
            </div>
            <div className="screener-card-body">
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
                    <div className="upload-icon-wrap">
                      <HiUpload />
                    </div>
                    <p>Drag & drop your resume</p>
                    <span>or click to browse · PDF, DOCX · Max 5MB</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Description Card */}
          <div className="screener-card">
            <div className="screener-card-header">
              <div className="screener-card-icon jd"><HiSearch /></div>
              <span className="screener-card-title">Job Description</span>
            </div>
            <div className="screener-card-body">
              <textarea
                className="jd-textarea"
                rows="8"
                placeholder={"Paste the job description here...\n\nExample: We are looking for a Full Stack Developer with experience in React, Node.js, MongoDB..."}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Analyze Button ───────────────── */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <button
            className="analyze-btn"
            onClick={analyzeResume}
            disabled={!file || !jobDescription.trim() || analyzing || planLimits.reached}
            id="analyze-resume-btn"
          >
            {analyzing ? (
              <>
                <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span>
                Analyzing via AI…
              </>
            ) : (
              <>
                <HiLightningBolt /> Analyze with AI
              </>
            )}
          </button>
          
          {planLimits.reached && (
            <div className="text-red-400 text-sm font-medium bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 flex items-center gap-2">
              <HiExclamationCircle className="w-5 h-5" />
              {planLimits.message}
            </div>
          )}
        </div>

        {/* ── Results ──────────────────────── */}
        {results && (
          <div className="screener-results">

            <div className="results-divider">
              <span className="results-divider-text">Analysis Results</span>
            </div>

            {/* ── Score Panel ─── */}
            <div className="score-panel result-animate delay-1">
              <div className="score-ring-wrap">
                <svg viewBox="0 0 128 128" width="140" height="140">
                  <circle className="ring-bg" cx="64" cy="64" r="56" />
                  <circle
                    className={`ring-fill ${getScoreColor(results.score)}`}
                    cx="64" cy="64" r="56"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (results.score / 100) * circumference}
                  />
                </svg>
                <div className="score-ring-value">
                  <span className="score-num">{results.score}</span>
                  <span className="score-pct">/ 100</span>
                  <span className="score-label">{getScoreLabel(results.score)}</span>
                </div>
              </div>

              <div className="score-details">
                <div className="score-title">
                  {getScoreEmoji(results.score)} ATS Match Score
                </div>
                <div className="score-subtitle">
                  Scored using keyword match (40%), semantic relevance (25%), section completeness (20%), and formatting (15%).
                </div>

                {/* Score breakdown bars */}
                <div className="score-breakdown">
                  <div className="breakdown-row">
                    <span className="breakdown-label">Keyword Match</span>
                    <div className="breakdown-bar-wrap">
                      <div className="breakdown-bar" style={{ width: `${getKeywordMatchRate()}%` }} />
                    </div>
                    <span className="breakdown-pct">{getKeywordMatchRate()}%</span>
                  </div>
                  {results.formatting && (
                    <div className="breakdown-row">
                      <span className="breakdown-label">ATS Formatting</span>
                      <div className="breakdown-bar-wrap">
                        <div className="breakdown-bar formatting" style={{ width: `${results.formatting.score || 0}%` }} />
                      </div>
                      <span className="breakdown-pct">{results.formatting.score || 0}%</span>
                    </div>
                  )}
                </div>

                <div className="score-stats-row">
                  <div className="score-mini-stat">
                    <span className="sms-value matched">{results.matchedKeywords?.length || 0}</span>
                    <span className="sms-label">Keywords Matched</span>
                  </div>
                  <div className="score-mini-stat">
                    <span className="sms-value missing">{results.missingKeywords?.length || 0}</span>
                    <span className="sms-label">Keywords Missing</span>
                  </div>
                  <div className="score-mini-stat">
                    <span className="sms-value format">{getKeywordMatchRate()}%</span>
                    <span className="sms-label">Match Rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Keywords ─── */}
            <div className="keywords-grid result-animate delay-2">
              <div className="keywords-panel matched-panel">
                <div className="keywords-panel-header">
                  <div className="kw-icon matched"><HiCheckCircle /></div>
                  <span className="kw-title">Matched Keywords</span>
                  <span className="kw-count matched">{results.matchedKeywords?.length || 0}</span>
                </div>
                <div className="keywords-body">
                  {results.matchedKeywords?.map((kw, i) => (
                    <span key={i} className="kw-tag matched">{kw}</span>
                  ))}
                  {(!results.matchedKeywords || results.matchedKeywords.length === 0) && (
                    <span className="kw-empty">No matches found</span>
                  )}
                </div>
              </div>

              <div className="keywords-panel missing-panel">
                <div className="keywords-panel-header">
                  <div className="kw-icon missing"><HiExclamationCircle /></div>
                  <span className="kw-title">Missing Keywords</span>
                  <span className="kw-count missing">{results.missingKeywords?.length || 0}</span>
                </div>
                <div className="keywords-body">
                  {results.missingKeywords?.map((kw, i) => (
                    <span key={i} className="kw-tag missing">{kw}</span>
                  ))}
                  {(!results.missingKeywords || results.missingKeywords.length === 0) && (
                    <span className="kw-empty">None missing — great job! 🎉</span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Deep Analysis ─── */}
            {results.analysis && (
              <div className="analysis-panel result-animate delay-3">
                <div className="analysis-panel-header">
                  <div className="a-icon"><HiDocumentText /></div>
                  <span className="a-title">Deep Resume Analysis</span>
                  <span className="a-badge">AI Powered</span>
                </div>
                <div className="analysis-grid">
                  {results.analysis.skills && (
                    <div className="analysis-cell">
                      <div className="analysis-cell-header">
                        <div className="analysis-cell-icon skills"><HiLightningBolt /></div>
                        <h4>Skills Assessment</h4>
                      </div>
                      <p>{results.analysis.skills}</p>
                    </div>
                  )}
                  {results.analysis.experience && (
                    <div className="analysis-cell">
                      <div className="analysis-cell-header">
                        <div className="analysis-cell-icon experience"><HiBriefcase /></div>
                        <h4>Experience Review</h4>
                      </div>
                      <p>{results.analysis.experience}</p>
                    </div>
                  )}
                  {results.analysis.education && (
                    <div className="analysis-cell">
                      <div className="analysis-cell-header">
                        <div className="analysis-cell-icon education"><HiAcademicCap /></div>
                        <h4>Education</h4>
                      </div>
                      <p>{results.analysis.education}</p>
                    </div>
                  )}
                  {results.analysis.projects && (
                    <div className="analysis-cell">
                      <div className="analysis-cell-header">
                        <div className="analysis-cell-icon projects"><HiFolder /></div>
                        <h4>Projects</h4>
                      </div>
                      <p>{results.analysis.projects}</p>
                    </div>
                  )}
                  {results.analysis.certifications && (
                    <div className="analysis-cell">
                      <div className="analysis-cell-header">
                        <div className="analysis-cell-icon certs"><HiShieldCheck /></div>
                        <h4>Certifications</h4>
                      </div>
                      <p>{results.analysis.certifications}</p>
                    </div>
                  )}
                  {results.analysis.overallQuality && (
                    <div className="analysis-cell full-width highlight">
                      <div className="analysis-cell-header">
                        <div className="analysis-cell-icon overall"><HiChartBar /></div>
                        <h4>Overall Quality Assessment</h4>
                      </div>
                      <p>{results.analysis.overallQuality}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Formatting Analysis ─── */}
            {results.formatting && (
              <div className="formatting-panel result-animate delay-4">
                <div className="formatting-panel-header">
                  <div className="f-icon"><HiClipboardCheck /></div>
                  <span className="f-title">ATS Formatting Score</span>
                  <span className={`f-score-badge ${getScoreColor(results.formatting.score)}`}>
                    {results.formatting.score}%
                  </span>
                </div>
                <div className="formatting-body">
                  <div className="formatting-progress-wrap">
                    <div className="formatting-progress-bar">
                      <div
                        className={`formatting-progress-fill ${getScoreColor(results.formatting.score)}`}
                        style={{ width: `${results.formatting.score}%` }}
                      />
                    </div>
                    <span className="formatting-progress-label">
                      {results.formatting.score >= 80 ? 'ATS-Optimized' :
                       results.formatting.score >= 60 ? 'Mostly Compatible' :
                       results.formatting.score >= 40 ? 'Needs Improvement' :
                       'Poor ATS Compatibility'}
                    </span>
                  </div>
                  {results.formatting.issues?.length > 0 && (
                    <ul className="formatting-issues">
                      {results.formatting.issues.map((issue, i) => (
                        <li key={i} className="formatting-issue-item">
                          <span className="formatting-issue-icon">
                            {issue.toLowerCase().includes('great') || issue.toLowerCase().includes('good')
                              ? <HiCheckCircle className="issue-ok" />
                              : <HiExclamationCircle className="issue-warn" />}
                          </span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* ── Career Guidance ─── */}
            {results.careerGuidance && (
              <div className="guidance-panel result-animate delay-5">
                <div className="guidance-panel-header">
                  <div className="g-icon"><HiTrendingUp /></div>
                  <span className="g-title">AI Career Guidance</span>
                  <span className="g-badge">Personalized</span>
                </div>
                <div className="guidance-sections">
                  {results.careerGuidance.coachingSuggestions?.length > 0 && (
                    <div className="guidance-block">
                      <div className="guidance-block-title">
                        <HiStar className="guidance-block-icon coaching" />
                        Coaching Suggestions
                      </div>
                      <ul className="guidance-list">
                        {results.careerGuidance.coachingSuggestions.map((s, i) => (
                          <li key={i} className="guidance-list-item">{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {results.careerGuidance.improvementAreas?.length > 0 && (
                    <div className="guidance-block">
                      <div className="guidance-block-title">
                        <HiTrendingUp className="guidance-block-icon improve" />
                        Areas to Improve
                      </div>
                      <ul className="guidance-list">
                        {results.careerGuidance.improvementAreas.map((s, i) => (
                          <li key={i} className="guidance-list-item">{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {results.careerGuidance.missingSkills?.length > 0 && (
                    <div className="guidance-block">
                      <div className="guidance-block-title">
                        <HiCog className="guidance-block-icon skills" />
                        Missing Skills
                      </div>
                      <div className="missing-skills-tags">
                        {results.careerGuidance.missingSkills.map((s, i) => (
                          <span key={i} className="missing-skill-tag">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {results.careerGuidance.enhancementStrategies?.length > 0 && (
                    <div className="guidance-block">
                      <div className="guidance-block-title">
                        <HiLightningBolt className="guidance-block-icon strategy" />
                        Enhancement Strategies
                      </div>
                      <ul className="guidance-list">
                        {results.careerGuidance.enhancementStrategies.map((s, i) => (
                          <li key={i} className="guidance-list-item">{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {results.careerGuidance.industryGuidance && (
                    <div className="guidance-block industry-block">
                      <div className="guidance-block-title">
                        <HiGlobe className="guidance-block-icon industry" />
                        Industry Guidance
                      </div>
                      <p className="industry-guidance-text">{results.careerGuidance.industryGuidance}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Job Recommendations ─── */}
            {results.jobRecommendations?.length > 0 && (
              <div className="jobs-panel result-animate delay-6">
                <div className="jobs-panel-header">
                  <div className="j-icon"><HiBriefcase /></div>
                  <span className="j-title">Job Recommendations & Opportunities</span>
                  <span className="j-count">{results.jobRecommendations.length} roles</span>
                </div>
                <div className="jobs-grid">
                  {results.jobRecommendations.map((job, i) => (
                    <div key={i} className="job-card">
                      <div className="job-card-top">
                        <div className="job-card-number">{String(i + 1).padStart(2, '0')}</div>
                        <div className="job-card-info">
                          <div className="job-role">{job.role}</div>
                          <div className="job-company">{job.company}</div>
                        </div>
                      </div>

                      {job.opportunity && (
                        <p className="job-opportunity">{job.opportunity}</p>
                      )}

                      {job.eligibility && (
                        <div className="job-eligibility">
                          <span className="job-meta-label">Eligibility</span>
                          <span className="job-meta-value">{job.eligibility}</span>
                        </div>
                      )}

                      {job.qualifications?.length > 0 && (
                        <div className="job-qualifications">
                          <span className="job-meta-label">Qualifications</span>
                          <ul className="job-qual-list">
                            {job.qualifications.map((q, j) => (
                              <li key={j}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {job.skills?.length > 0 && (
                        <div className="job-skills-section">
                          <span className="job-meta-label">Required Skills</span>
                          <div className="job-skills">
                            {job.skills.map((s, j) => (
                              <span key={j} className="job-skill-tag">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        className="job-apply-btn"
                        onClick={() => window.open(job.applicationUrl || `https://www.google.com/search?q=${encodeURIComponent(job.role + ' ' + job.company + ' jobs')}`, '_blank')}
                      >
                        <HiExternalLink /> Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
