import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FloatingOrbs from '../components/FloatingOrbs';
import {
  HiUser, HiAcademicCap, HiBriefcase, HiCode,
  HiFolder, HiArrowRight, HiArrowLeft, HiDownload,
  HiSave, HiEye, HiTemplate, HiPlus, HiTrash
} from 'react-icons/hi';
import './ResumeBuilder.css';

const STEPS = [
  { id: 'personal', label: 'Personal Info', icon: <HiUser /> },
  { id: 'education', label: 'Education', icon: <HiAcademicCap /> },
  { id: 'experience', label: 'Experience', icon: <HiBriefcase /> },
  { id: 'skills', label: 'Skills', icon: <HiCode /> },
  { id: 'projects', label: 'Projects', icon: <HiFolder /> },
];

const TEMPLATES = ['Modern', 'Professional', 'Minimal'];

const emptyResume = {
  personal: { name: '', email: '', phone: '', location: '', summary: '', linkedin: '', website: '' },
  education: [{ institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }],
  experience: [{ company: '', position: '', startDate: '', endDate: '', current: false, description: '' }],
  skills: { technical: '', soft: '', languages: '', tools: '' },
  projects: [{ name: '', description: '', technologies: '', link: '' }],
};

export default function ResumeBuilder() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState('Modern');
  const [planTemplates, setPlanTemplates] = useState(TEMPLATES);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(() => new URLSearchParams(window.location.search).get('preview') === '1');
  const [data, setData] = useState({ ...emptyResume });
  const previewRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadPlan();
      loadResumeFromServer();
    }
  }, [user]);

  const toFormData = (resume) => ({
    personal: resume.personalInfo || emptyResume.personal,
    education: resume.education?.length ? resume.education : emptyResume.education,
    experience: resume.experience?.length ? resume.experience : emptyResume.experience,
    skills: resume.skills || emptyResume.skills,
    projects: resume.projects?.length ? resume.projects : emptyResume.projects
  });

  const loadPlan = async () => {
    try {
      const res = await api.get('/plans/me');
      if (!res.ok) return;
      const info = await res.json();
      setPlanTemplates(info.plan?.templates || TEMPLATES);
    } catch (error) {
      console.log('Plan load skipped:', error.message);
    }
  };

  const loadResumeFromServer = async () => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id || id.length < 20) return;
    try {
      const res = await api.get(`/resumes/${id}`);
      if (!res.ok) return;
      const resume = await res.json();
      setTemplate(resume.template || 'Modern');
      setData(toFormData(resume));
    } catch (error) {
      console.log('Resume load skipped:', error.message);
    }
  };

  const updatePersonal = (field, value) => {
    setData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const addItem = (section) => {
    const empty = section === 'education'
      ? { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }
      : section === 'experience'
        ? { company: '', position: '', startDate: '', endDate: '', current: false, description: '' }
        : { name: '', description: '', technologies: '', link: '' };
    setData(prev => ({ ...prev, [section]: [...prev[section], empty] }));
  };

  const removeItem = (section, index) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const updateItem = (section, index, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateSkills = (field, value) => {
    setData(prev => ({ ...prev, skills: { ...prev.skills, [field]: value } }));
  };

  const saveResume = async () => {
    const params = new URLSearchParams(window.location.search);
    const existingId = params.get('id');
    setSaving(true);
    const payload = {
      title: data.personal.name ? `${data.personal.name}'s Resume` : 'Untitled Resume',
      template,
      personalInfo: data.personal,
      education: data.education,
      experience: data.experience,
      skills: data.skills,
      projects: data.projects
    };

    try {
      const isServerId = existingId && existingId.length >= 20;
      const res = isServerId
        ? await api.put(`/resumes/${existingId}`, payload)
        : await api.post('/resumes', payload);
      const saved = await res.json();
      if (!res.ok) {
        alert(saved.error || 'Could not save resume.');
        setSaving(false);
        return;
      }
      window.history.replaceState({}, '', `/builder?id=${saved._id}`);
      alert('Resume saved successfully!');
    } catch (error) {
      console.log('Server save failed:', error.message);
      alert('Could not save resume. Please ensure you are logged in and try again.');
    } finally {
      setSaving(false);
    }
  };

  const exportPDF = async () => {
    if (!previewRef.current) return;
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 0,
        filename: `${data.personal.name || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(previewRef.current).save();
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Error exporting PDF. Please try again.');
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="page builder-page">
      <FloatingOrbs />
      <div className="container">
        <div className="builder-header fade-in-up">
          <div>
            <h1>Resume <span className="gradient-text">Builder</span></h1>
            <p>Create your ATS-friendly resume step by step</p>
          </div>
          <div className="builder-header-actions">
            <div className="template-selector">
              {planTemplates.map(t => (
                <button
                  key={t}
                  className={`template-btn ${template === t ? 'active' : ''}`}
                  onClick={() => setTemplate(t)}
                >
                  <HiTemplate /> {t}
                </button>
              ))}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowPreview(!showPreview)}>
              <HiEye /> {showPreview ? 'Editor' : 'Preview'}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="builder-progress fade-in-up delay-1">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-steps">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                className={`progress-step ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
                onClick={() => setStep(i)}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="builder-content">
          {/* Form */}
          <div className={`builder-form ${showPreview ? 'hidden-mobile' : ''}`}>
            <div className="form-card glass-card fade-in-up delay-2">
              {/* Step: Personal */}
              {step === 0 && (
                <div className="form-step">
                  <h2>Personal Information</h2>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" placeholder="John Doe" value={data.personal.name} onChange={e => updatePersonal('name', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input className="form-input" type="email" placeholder="john@example.com" value={data.personal.email} onChange={e => updatePersonal('email', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" placeholder="+1 234 567 890" value={data.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input className="form-input" placeholder="City, Country" value={data.personal.location} onChange={e => updatePersonal('location', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">LinkedIn</label>
                      <input className="form-input" placeholder="linkedin.com/in/johndoe" value={data.personal.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Website / Portfolio</label>
                      <input className="form-input" placeholder="johndoe.com" value={data.personal.website} onChange={e => updatePersonal('website', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Professional Summary</label>
                    <textarea className="form-input form-textarea" rows="4" placeholder="Brief summary of your professional background..." value={data.personal.summary} onChange={e => updatePersonal('summary', e.target.value)} />
                  </div>
                </div>
              )}

              {/* Step: Education */}
              {step === 1 && (
                <div className="form-step">
                  <div className="step-header-row">
                    <h2>Education</h2>
                    <button className="btn btn-ghost btn-sm" onClick={() => addItem('education')}><HiPlus /> Add</button>
                  </div>
                  {data.education.map((edu, i) => (
                    <div key={i} className="repeatable-section">
                      <div className="repeatable-header">
                        <span className="repeatable-badge">#{i + 1}</span>
                        {data.education.length > 1 && (
                          <button className="btn btn-ghost btn-sm" onClick={() => removeItem('education', i)}><HiTrash /></button>
                        )}
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Institution *</label>
                          <input className="form-input" placeholder="University Name" value={edu.institution} onChange={e => updateItem('education', i, 'institution', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Degree *</label>
                          <input className="form-input" placeholder="B.Tech / M.Sc" value={edu.degree} onChange={e => updateItem('education', i, 'degree', e.target.value)} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Field of Study</label>
                          <input className="form-input" placeholder="Computer Science" value={edu.field} onChange={e => updateItem('education', i, 'field', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">GPA</label>
                          <input className="form-input" placeholder="3.8/4.0" value={edu.gpa} onChange={e => updateItem('education', i, 'gpa', e.target.value)} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Start Date</label>
                          <input className="form-input" type="month" value={edu.startDate} onChange={e => updateItem('education', i, 'startDate', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">End Date</label>
                          <input className="form-input" type="month" value={edu.endDate} onChange={e => updateItem('education', i, 'endDate', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step: Experience */}
              {step === 2 && (
                <div className="form-step">
                  <div className="step-header-row">
                    <h2>Work Experience</h2>
                    <button className="btn btn-ghost btn-sm" onClick={() => addItem('experience')}><HiPlus /> Add</button>
                  </div>
                  {data.experience.map((exp, i) => (
                    <div key={i} className="repeatable-section">
                      <div className="repeatable-header">
                        <span className="repeatable-badge">#{i + 1}</span>
                        {data.experience.length > 1 && (
                          <button className="btn btn-ghost btn-sm" onClick={() => removeItem('experience', i)}><HiTrash /></button>
                        )}
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Company *</label>
                          <input className="form-input" placeholder="Company Name" value={exp.company} onChange={e => updateItem('experience', i, 'company', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Position *</label>
                          <input className="form-input" placeholder="Software Engineer" value={exp.position} onChange={e => updateItem('experience', i, 'position', e.target.value)} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Start Date</label>
                          <input className="form-input" type="month" value={exp.startDate} onChange={e => updateItem('experience', i, 'startDate', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">End Date</label>
                          <input className="form-input" type="month" value={exp.endDate} onChange={e => updateItem('experience', i, 'endDate', e.target.value)} disabled={exp.current} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={exp.current} onChange={e => updateItem('experience', i, 'current', e.target.checked)} />
                          <span>Currently working here</span>
                        </label>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-input form-textarea" rows="4" placeholder="• Led a team of 5 engineers...&#10;• Increased performance by 40%..." value={exp.description} onChange={e => updateItem('experience', i, 'description', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step: Skills */}
              {step === 3 && (
                <div className="form-step">
                  <h2>Skills</h2>
                  <div className="form-group">
                    <label className="form-label">Technical Skills</label>
                    <textarea className="form-input form-textarea" rows="3" placeholder="JavaScript, React, Node.js, Python, SQL..." value={data.skills.technical} onChange={e => updateSkills('technical', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Soft Skills</label>
                    <textarea className="form-input form-textarea" rows="2" placeholder="Leadership, Communication, Team Collaboration..." value={data.skills.soft} onChange={e => updateSkills('soft', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Languages</label>
                    <input className="form-input" placeholder="English (Fluent), Hindi (Native)..." value={data.skills.languages} onChange={e => updateSkills('languages', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tools & Technologies</label>
                    <input className="form-input" placeholder="Git, Docker, AWS, Figma..." value={data.skills.tools} onChange={e => updateSkills('tools', e.target.value)} />
                  </div>
                </div>
              )}

              {/* Step: Projects */}
              {step === 4 && (
                <div className="form-step">
                  <div className="step-header-row">
                    <h2>Projects</h2>
                    <button className="btn btn-ghost btn-sm" onClick={() => addItem('projects')}><HiPlus /> Add</button>
                  </div>
                  {data.projects.map((proj, i) => (
                    <div key={i} className="repeatable-section">
                      <div className="repeatable-header">
                        <span className="repeatable-badge">#{i + 1}</span>
                        {data.projects.length > 1 && (
                          <button className="btn btn-ghost btn-sm" onClick={() => removeItem('projects', i)}><HiTrash /></button>
                        )}
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Project Name *</label>
                          <input className="form-input" placeholder="Project Name" value={proj.name} onChange={e => updateItem('projects', i, 'name', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Link</label>
                          <input className="form-input" placeholder="github.com/project" value={proj.link} onChange={e => updateItem('projects', i, 'link', e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Technologies Used</label>
                        <input className="form-input" placeholder="React, Node.js, MongoDB" value={proj.technologies} onChange={e => updateItem('projects', i, 'technologies', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-input form-textarea" rows="3" placeholder="Brief description of the project..." value={proj.description} onChange={e => updateItem('projects', i, 'description', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="form-nav">
                <button className="btn btn-secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                  <HiArrowLeft /> Previous
                </button>
                <div className="form-nav-right">
                  <button className="btn btn-secondary" onClick={saveResume} disabled={saving}>
                    <HiSave /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  {step < STEPS.length - 1 ? (
                    <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
                      Next <HiArrowRight />
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={exportPDF}>
                      <HiDownload /> Export PDF
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className={`builder-preview ${showPreview ? 'show-mobile' : ''}`}>
            <div className="preview-wrapper glass-card fade-in-up delay-3">
              <div ref={previewRef} className={`resume-preview template-${getTemplateClass(template)}`}>
                <ResumePreviewContentV2 data={data} template={template} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTemplateClass(template) {
  return template.toLowerCase().replace(/\s+/g, '-');
}

function ResumePreviewContentV2({ data, template }) {
  const formatDate = (d) => {
    if (!d) return '';
    const [y, m] = d.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m) - 1]} ${y}`;
  };

  const skillList = (s) => s ? s.split(',').map(x => x.trim()).filter(Boolean) : [];
  const hasSkills = data.skills.technical || data.skills.soft || data.skills.tools || data.skills.languages;
  const isSkillsFirst = template === 'ATS Focused' || template === 'Technical';
  const isTechnical = template === 'Technical';

  const SectionTitle = ({ children }) => (
    <h2 className="preview-section-title">{children}</h2>
  );

  const SkillsSection = () => hasSkills && (
    <div className={`preview-section ${isSkillsFirst ? 'preview-priority-section' : ''}`}>
      <SectionTitle>{template === 'ATS Focused' ? 'Keyword Skills' : 'Skills'}</SectionTitle>
      <div className={isTechnical ? 'preview-skill-tags' : 'preview-skills'}>
        {data.skills.technical && (
          isTechnical ? skillList(data.skills.technical).map(skill => <span key={skill}>{skill}</span>) : (
            <div className="preview-skill-group">
              <strong>Technical:</strong> {data.skills.technical}
            </div>
          )
        )}
        {!isTechnical && data.skills.soft && (
          <div className="preview-skill-group">
            <strong>Soft Skills:</strong> {data.skills.soft}
          </div>
        )}
        {!isTechnical && data.skills.tools && (
          <div className="preview-skill-group">
            <strong>Tools:</strong> {data.skills.tools}
          </div>
        )}
        {!isTechnical && data.skills.languages && (
          <div className="preview-skill-group">
            <strong>Languages:</strong> {data.skills.languages}
          </div>
        )}
      </div>
      {isTechnical && (data.skills.tools || data.skills.languages || data.skills.soft) && (
        <div className="preview-skills technical-extra-skills">
          {data.skills.tools && <div className="preview-skill-group"><strong>Tools:</strong> {data.skills.tools}</div>}
          {data.skills.languages && <div className="preview-skill-group"><strong>Languages:</strong> {data.skills.languages}</div>}
          {data.skills.soft && <div className="preview-skill-group"><strong>Professional:</strong> {data.skills.soft}</div>}
        </div>
      )}
    </div>
  );

  const ExperienceSection = () => data.experience.some(e => e.company) && (
    <div className="preview-section">
      <SectionTitle>{template === 'Executive' ? 'Leadership Experience' : 'Work Experience'}</SectionTitle>
      {data.experience.filter(e => e.company).map((exp, i) => (
        <div key={i} className="preview-entry">
          <div className="preview-entry-header">
            <div>
              <strong>{exp.position}</strong>
              <span className="preview-company">{exp.company}</span>
            </div>
            <span className="preview-date">
              {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
            </span>
          </div>
          {exp.description && (
            <div className="preview-description">
              {exp.description.split('\n').map((line, j) => (
                <p key={j}>{line}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const EducationSection = () => data.education.some(e => e.institution) && (
    <div className="preview-section">
      <SectionTitle>Education</SectionTitle>
      {data.education.filter(e => e.institution).map((edu, i) => (
        <div key={i} className="preview-entry">
          <div className="preview-entry-header">
            <div>
              <strong>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</strong>
              <span className="preview-company">{edu.institution}</span>
            </div>
            <span className="preview-date">
              {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              {edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const ProjectsSection = () => data.projects.some(p => p.name) && (
    <div className="preview-section">
      <SectionTitle>{isTechnical ? 'Technical Projects' : 'Projects'}</SectionTitle>
      {data.projects.filter(p => p.name).map((proj, i) => (
        <div key={i} className="preview-entry">
          <div className="preview-entry-header">
            <div>
              <strong>{proj.name}</strong>
              {proj.technologies && <span className="preview-tech">{proj.technologies}</span>}
            </div>
            {proj.link && <span className="preview-date">{proj.link}</span>}
          </div>
          {proj.description && <p className="preview-description">{proj.description}</p>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="preview-content">
      <div className="preview-header">
        <h1 className="preview-name">{data.personal.name || 'Your Name'}</h1>
        <div className="preview-contact">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
          {data.personal.website && <span>{data.personal.website}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div className="preview-section">
          <SectionTitle>{template === 'Executive' ? 'Executive Profile' : 'Professional Summary'}</SectionTitle>
          <p className="preview-summary">{data.personal.summary}</p>
        </div>
      )}

      {isSkillsFirst && <SkillsSection />}
      <ExperienceSection />
      {isTechnical && <ProjectsSection />}
      {!isSkillsFirst && <SkillsSection />}
      <EducationSection />
      {!isTechnical && <ProjectsSection />}
    </div>
  );
}

/* Resume Preview Component */
function ResumePreviewContent({ data, template }) {
  const formatDate = (d) => {
    if (!d) return '';
    const [y, m] = d.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m) - 1]} ${y}`;
  };

  const skillList = (s) => s ? s.split(',').map(x => x.trim()).filter(Boolean) : [];

  return (
    <div className="preview-content">
      {/* Header */}
      <div className="preview-header">
        <h1 className="preview-name">{data.personal.name || 'Your Name'}</h1>
        <div className="preview-contact">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
          {data.personal.website && <span>{data.personal.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personal.summary && (
        <div className="preview-section">
          <h2 className="preview-section-title">Professional Summary</h2>
          <p className="preview-summary">{data.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.some(e => e.company) && (
        <div className="preview-section">
          <h2 className="preview-section-title">Work Experience</h2>
          {data.experience.filter(e => e.company).map((exp, i) => (
            <div key={i} className="preview-entry">
              <div className="preview-entry-header">
                <div>
                  <strong>{exp.position}</strong>
                  <span className="preview-company">{exp.company}</span>
                </div>
                <span className="preview-date">
                  {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.description && (
                <div className="preview-description">
                  {exp.description.split('\n').map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.some(e => e.institution) && (
        <div className="preview-section">
          <h2 className="preview-section-title">Education</h2>
          {data.education.filter(e => e.institution).map((edu, i) => (
            <div key={i} className="preview-entry">
              <div className="preview-entry-header">
                <div>
                  <strong>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</strong>
                  <span className="preview-company">{edu.institution}</span>
                </div>
                <span className="preview-date">
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  {edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(data.skills.technical || data.skills.soft || data.skills.tools) && (
        <div className="preview-section">
          <h2 className="preview-section-title">Skills</h2>
          <div className="preview-skills">
            {data.skills.technical && (
              <div className="preview-skill-group">
                <strong>Technical:</strong> {data.skills.technical}
              </div>
            )}
            {data.skills.soft && (
              <div className="preview-skill-group">
                <strong>Soft Skills:</strong> {data.skills.soft}
              </div>
            )}
            {data.skills.tools && (
              <div className="preview-skill-group">
                <strong>Tools:</strong> {data.skills.tools}
              </div>
            )}
            {data.skills.languages && (
              <div className="preview-skill-group">
                <strong>Languages:</strong> {data.skills.languages}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.some(p => p.name) && (
        <div className="preview-section">
          <h2 className="preview-section-title">Projects</h2>
          {data.projects.filter(p => p.name).map((proj, i) => (
            <div key={i} className="preview-entry">
              <div className="preview-entry-header">
                <div>
                  <strong>{proj.name}</strong>
                  {proj.technologies && <span className="preview-tech">{proj.technologies}</span>}
                </div>
                {proj.link && <span className="preview-date">{proj.link}</span>}
              </div>
              {proj.description && <p className="preview-description">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
