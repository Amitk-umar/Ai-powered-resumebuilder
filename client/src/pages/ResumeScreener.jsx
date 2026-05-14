import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FloatingOrbs from '../components/FloatingOrbs';
import {
  HiUpload, HiDocumentText, HiSearch, HiChartBar,
  HiLightningBolt, HiCheckCircle, HiExclamationCircle,
  HiInformationCircle, HiBriefcase, HiAcademicCap, HiFolder
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
        setResults(data);
        await saveScreening(file.name, data);
      } else {
        const errData = await response.json();
        alert('Analysis failed: ' + (errData.error || 'Unknown error'));
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
          <h1>AI Resume <span className="gradient-text">Screener & Coach</span></h1>
          <p>Upload a resume and job description to get deep AI analysis and career recommendations</p>
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
                  Analyzing via AI...
                </>
              ) : (
                <>
                  <HiLightningBolt /> Analyze with AI
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="screener-results fade-in-up">
              {/* Score */}
              <div className="score-section glass-card">
                <h3><HiChartBar /> Overall ATS Match Score</h3>
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
              <div className="keywords-wrapper">
                <div className="keywords-section glass-card">
                  <h3><HiCheckCircle style={{ color: 'var(--success)' }} /> Matched Keywords</h3>
                  <div className="keyword-tags">
                    {results.matchedKeywords?.map((kw, i) => (
                      <span key={i} className="keyword-tag matched">{kw}</span>
                    ))}
                  </div>
                </div>

                <div className="keywords-section glass-card">
                  <h3><HiExclamationCircle style={{ color: 'var(--warning)' }} /> Missing Keywords</h3>
                  <div className="keyword-tags">
                    {results.missingKeywords?.map((kw, i) => (
                      <span key={i} className="keyword-tag missing">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deep Analysis */}
              {results.analysis && (
                <div className="analysis-section glass-card">
                  <h3><HiDocumentText style={{ color: 'var(--accent-primary)' }} /> Deep Resume Analysis</h3>
                  <div className="analysis-grid">
                    {results.analysis.skills && (
                      <div className="analysis-item">
                        <h4><HiLightningBolt /> Skills</h4>
                        <p>{results.analysis.skills}</p>
                      </div>
                    )}
                    {results.analysis.experience && (
                      <div className="analysis-item">
                        <h4><HiBriefcase /> Experience</h4>
                        <p>{results.analysis.experience}</p>
                      </div>
                    )}
                    {results.analysis.education && (
                      <div className="analysis-item">
                        <h4><HiAcademicCap /> Education</h4>
                        <p>{results.analysis.education}</p>
                      </div>
                    )}
                    {results.analysis.projects && (
                      <div className="analysis-item">
                        <h4><HiFolder /> Projects</h4>
                        <p>{results.analysis.projects}</p>
                      </div>
                    )}
                    {results.analysis.overallQuality && (
                      <div className="analysis-item full-width">
                        <h4>Overall Quality</h4>
                        <p>{results.analysis.overallQuality}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Career Guidance */}
              {results.careerGuidance && (
                <div className="guidance-section glass-card">
                  <h3><HiInformationCircle style={{ color: 'var(--accent-secondary)' }} /> AI Career Guidance</h3>
                  <div className="guidance-content">
                    {results.careerGuidance.coachingSuggestions?.length > 0 && (
                      <div className="guidance-block">
                        <h4>Coaching Suggestions</h4>
                        <ul>
                          {results.careerGuidance.coachingSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    {results.careerGuidance.improvementAreas?.length > 0 && (
                      <div className="guidance-block">
                        <h4>Areas to Improve</h4>
                        <ul>
                          {results.careerGuidance.improvementAreas.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    {results.careerGuidance.enhancementStrategies?.length > 0 && (
                      <div className="guidance-block">
                        <h4>Enhancement Strategies</h4>
                        <ul>
                          {results.careerGuidance.enhancementStrategies.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Job Recommendations & Direct Apply */}
              {results.jobRecommendations?.length > 0 && (
                <div className="jobs-section glass-card">
                  <h3><HiBriefcase style={{ color: 'var(--success)' }} /> Job Recommendations & Opportunities</h3>
                  <div className="jobs-grid">
                    {results.jobRecommendations.map((job, i) => (
                      <div key={i} className="job-card">
                        <h4>{job.role}</h4>
                        <h5>{job.company}</h5>
                        <p className="job-opportunity">{job.opportunity}</p>
                        <div className="job-details">
                          <strong>Required Skills:</strong>
                          <div className="job-skills">
                            {job.skills?.map((s, j) => <span key={j}>{s}</span>)}
                          </div>
                        </div>
                        <button 
                          className="btn btn-primary btn-sm direct-apply-btn"
                          onClick={() => window.open(job.applicationUrl || `https://www.google.com/search?q=${encodeURIComponent(job.role + ' ' + job.company + ' jobs')}`, '_blank')}
                        >
                          Direct Apply
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
    </div>
  );
}
