'use strict';

/* ─── Storage keys ───────────────────────────────────────────────────────── */
const PASS_KEY    = 'adm_ph';
const CONTENT_KEY = 'adm_ct';

/* ─── SVG assets ─────────────────────────────────────────────────────────── */
const SVG = {
  github:   `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`,
  arrow:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>`,
  email:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
  send:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>`,
};

const PROJECT_ICONS = {
  cloud:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
  clipboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
  chat:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>`,
  code:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`,
  database:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>`,
  globe:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>`,
  server:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>`,
};

/* ─── Default content (mirrors current index.html) ──────────────────────── */
const DEFAULTS = {
  hero: {
    greeting:   "Hey, I'm",
    name:       'Daniel Madera.',
    tagline:    'Technical Success Manager | Aspiring Cloud Architect — bridging complex engineering systems and client-driven solutions, with a focus on scalable AWS infrastructure.',
    typedWords: ['cloud solutions', 'business value', 'scalable systems'],
  },
  about: {
    bio: [
      "I'm a Technical Success Manager with a background in software engineering and sales, uniquely positioned at the intersection of complex technical systems and client-driven solutions. My career is defined by the ability to translate technical architecture into clear, actionable value for stakeholders — whether troubleshooting engineering challenges or refining sales strategies, I focus on building efficient, scalable processes that help organizations thrive.",
      "Currently, I'm transitioning my focus toward cloud architecture, leveraging my foundation in full-stack development to design robust, high-performance cloud environments. I'm actively deepening my expertise in AWS infrastructure and automation to move into a full-time role as a Cloud Architect — combining technical acumen with a strategic mindset to help teams build scalable cloud solutions that solve complex, real-world problems.",
    ],
    location:  'Las Vegas, NV',
    status:    'Open to opportunities',
    focus:     'Cloud Architecture',
    resumeUrl: '#',
    available: true,
  },
  projects: [
    {
      title:     'Book Review API',
      desc:      'A serverless REST API for managing books and user reviews. Built as an event-driven portfolio piece featuring CRUD operations, NoSQL data modeling with Global Secondary Indexes, and automated infrastructure via AWS-managed services.',
      tags:      ['Node.js 22.x', 'AWS Lambda', 'DynamoDB', 'API Gateway', 'REST API'],
      githubUrl: 'https://github.com/dmadera0',
      demoUrl:   'https://example.com',
      icon:      'cloud',
    },
    {
      title:     'TaskFlow API',
      desc:      'A high-performance RESTful task management API supporting multi-tenant workspaces, JWT auth, and real-time push notifications. Handles 50k+ requests/day in production.',
      tags:      ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
      githubUrl: 'https://github.com',
      demoUrl:   'https://example.com',
      icon:      'clipboard',
    },
    {
      title:     'SentimentLens',
      desc:      'An NLP-powered social media sentiment analysis tool that aggregates and classifies public opinion in real time across Twitter and Reddit using a fine-tuned BERT model.',
      tags:      ['Python', 'FastAPI', 'PyTorch', 'React', 'AWS ECS'],
      githubUrl: 'https://github.com',
      demoUrl:   'https://example.com',
      icon:      'chat',
    },
  ],
  experience: [
    {
      role:       'Software Engineer II',
      company:    'Acme Corp',
      companyUrl: 'https://example.com',
      period:     'Jan 2023 — Present',
      bullets:    [
        'Architected and shipped a microservices migration reducing API p99 latency by 40% for 2M+ daily users.',
        'Led a 4-engineer team to redesign the data pipeline, cutting ETL processing time from 6 hours to 45 minutes.',
        'Implemented blue/green CI/CD deployment strategy on AWS ECS, achieving 99.98% uptime over 12 months.',
        'Mentored two junior engineers through code reviews, architecture discussions, and pair programming sessions.',
      ],
      tags: ['TypeScript', 'AWS', 'Node.js', 'PostgreSQL'],
    },
    {
      role:       'Software Engineer I',
      company:    'TechStart Inc.',
      companyUrl: 'https://example.com',
      period:     'Jul 2021 — Dec 2022',
      bullets:    [
        'Built and maintained 12+ customer-facing React features used by 500k+ monthly active users.',
        'Developed a Python ETL pipeline to ingest and normalize third-party data sources into a central data warehouse.',
        'Reduced front-end bundle size by 38% through code-splitting, lazy loading, and dependency audit.',
      ],
      tags: ['React', 'Python', 'Redis', 'Docker'],
    },
    {
      role:       'Software Engineering Intern',
      company:    'BigCo Technologies',
      companyUrl: 'https://example.com',
      period:     'May 2020 — Aug 2020',
      bullets:    [
        'Developed an internal tooling dashboard that automated manual reporting, saving the team ~8 hours/week.',
        'Contributed 15+ pull requests to core platform services during a 3-month internship.',
      ],
      tags: ['Java', 'Spring Boot', 'MySQL'],
    },
  ],
  contact: {
    lead:         "I'm currently open to new opportunities — whether it's a full-time role, contract project, or just a conversation. My inbox is always open.",
    email:        'dmadera0@gmail.com',
    linkedinUrl:  'https://www.linkedin.com/in/dmadera0/',
    linkedinLabel:'linkedin.com/in/dmadera0',
    githubUrl:    'https://github.com/dmadera0',
    githubLabel:  'github.com/dmadera0',
  },
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function loadContent() {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    return raw ? JSON.parse(raw) : structuredClone(DEFAULTS);
  } catch {
    return structuredClone(DEFAULTS);
  }
}

function saveContent(data) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(data));
}

/* ─── Auth ───────────────────────────────────────────────────────────────── */
(function initAuth() {
  const loginScreen = document.getElementById('admin-login');
  const app         = document.getElementById('admin-app');
  const form        = document.getElementById('login-form');
  const input       = document.getElementById('password-input');
  const subtitle    = document.getElementById('login-subtitle');
  const errEl       = document.getElementById('login-error');
  const logoutBtn   = document.getElementById('logout-btn');

  const stored = localStorage.getItem(PASS_KEY);
  const isSetup = !stored;

  if (isSetup) {
    subtitle.textContent = 'Create an admin password to get started.';
    document.querySelector('label[for="password-input"]').textContent = 'New password';
    form.querySelector('[type="submit"]').textContent = 'Create Password';
  }

  if (sessionStorage.getItem('adm_ok') === '1') {
    show();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = input.value;
    if (!pw) return;

    const hash = await sha256(pw);

    if (isSetup) {
      localStorage.setItem(PASS_KEY, hash);
      sessionStorage.setItem('adm_ok', '1');
      show();
    } else {
      if (hash === stored) {
        sessionStorage.setItem('adm_ok', '1');
        show();
      } else {
        errEl.textContent = 'Incorrect password.';
        errEl.hidden = false;
        input.value = '';
        input.focus();
        setTimeout(() => { errEl.hidden = true; }, 3000);
      }
    }
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('adm_ok');
    location.reload();
  });

  function show() {
    loginScreen.hidden = true;
    app.hidden = false;
    initEditor();
  }
})();

/* ─── Tab navigation ─────────────────────────────────────────────────────── */
function initTabs() {
  const tabs   = document.querySelectorAll('.admin-tab');
  const panels = document.querySelectorAll('.admin-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.hidden = true);
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.tab).hidden = false;
    });
  });
}

/* ─── Form builders ──────────────────────────────────────────────────────── */
function buildHeroPanel(data) {
  const h = data.hero;
  return `
    <h2 class="admin-panel__title">Hero</h2>
    <div class="admin-field">
      <label>Greeting line</label>
      <input type="text" name="hero.greeting" value="${esc(h.greeting)}">
    </div>
    <div class="admin-field">
      <label>Name</label>
      <input type="text" name="hero.name" value="${esc(h.name)}">
    </div>
    <div class="admin-field">
      <label>Tagline</label>
      <textarea name="hero.tagline" rows="3">${esc(h.tagline)}</textarea>
    </div>
    <div class="admin-field">
      <label>Typed words <span class="admin-hint">(comma-separated)</span></label>
      <input type="text" name="hero.typedWords" value="${esc(h.typedWords.join(', '))}">
    </div>`;
}

function buildAboutPanel(data) {
  const a = data.about;
  return `
    <h2 class="admin-panel__title">About</h2>
    <div class="admin-field">
      <label>Bio — paragraph 1</label>
      <textarea name="about.bio.0" rows="5">${esc(a.bio[0])}</textarea>
    </div>
    <div class="admin-field">
      <label>Bio — paragraph 2</label>
      <textarea name="about.bio.1" rows="5">${esc(a.bio[1])}</textarea>
    </div>
    <div class="admin-row">
      <div class="admin-field">
        <label>Location</label>
        <input type="text" name="about.location" value="${esc(a.location)}">
      </div>
      <div class="admin-field">
        <label>Status</label>
        <input type="text" name="about.status" value="${esc(a.status)}">
      </div>
      <div class="admin-field">
        <label>Focus</label>
        <input type="text" name="about.focus" value="${esc(a.focus)}">
      </div>
    </div>
    <div class="admin-field">
      <label>Résumé URL</label>
      <input type="text" name="about.resumeUrl" value="${esc(a.resumeUrl)}">
    </div>
    <div class="admin-field admin-field--inline">
      <label>
        <input type="checkbox" name="about.available" ${a.available ? 'checked' : ''}>
        Show "Available for work" badge
      </label>
    </div>`;
}

function buildProjectCard(p, i) {
  const iconOptions = Object.keys(PROJECT_ICONS).map(k =>
    `<option value="${k}" ${p.icon === k ? 'selected' : ''}>${k}</option>`
  ).join('');
  return `
    <div class="admin-card" data-index="${i}">
      <div class="admin-card__header">
        <span class="admin-card__num">Project ${i + 1}</span>
        <div class="admin-card__actions">
          <button type="button" class="admin-btn admin-btn--sm admin-btn--danger" data-remove="project" data-index="${i}">Remove</button>
        </div>
      </div>
      <div class="admin-field">
        <label>Title</label>
        <input type="text" name="projects.${i}.title" value="${esc(p.title)}">
      </div>
      <div class="admin-field">
        <label>Description</label>
        <textarea name="projects.${i}.desc" rows="3">${esc(p.desc)}</textarea>
      </div>
      <div class="admin-row">
        <div class="admin-field">
          <label>GitHub URL</label>
          <input type="url" name="projects.${i}.githubUrl" value="${esc(p.githubUrl)}">
        </div>
        <div class="admin-field">
          <label>Demo URL</label>
          <input type="url" name="projects.${i}.demoUrl" value="${esc(p.demoUrl)}">
        </div>
      </div>
      <div class="admin-row">
        <div class="admin-field">
          <label>Tags <span class="admin-hint">(comma-separated)</span></label>
          <input type="text" name="projects.${i}.tags" value="${esc(p.tags.join(', '))}">
        </div>
        <div class="admin-field admin-field--sm">
          <label>Icon</label>
          <select name="projects.${i}.icon">${iconOptions}</select>
        </div>
      </div>
    </div>`;
}

function buildProjectsPanel(data) {
  const cards = data.projects.map((p, i) => buildProjectCard(p, i)).join('');
  return `
    <h2 class="admin-panel__title">Projects</h2>
    <div id="projects-list">${cards}</div>
    <button type="button" class="admin-btn admin-btn--add" id="add-project">+ Add Project</button>`;
}

function buildExpCard(e, i) {
  return `
    <div class="admin-card" data-index="${i}">
      <div class="admin-card__header">
        <span class="admin-card__num">Experience ${i + 1}</span>
        <div class="admin-card__actions">
          <button type="button" class="admin-btn admin-btn--sm admin-btn--danger" data-remove="experience" data-index="${i}">Remove</button>
        </div>
      </div>
      <div class="admin-row">
        <div class="admin-field">
          <label>Role / Title</label>
          <input type="text" name="experience.${i}.role" value="${esc(e.role)}">
        </div>
        <div class="admin-field">
          <label>Company</label>
          <input type="text" name="experience.${i}.company" value="${esc(e.company)}">
        </div>
      </div>
      <div class="admin-row">
        <div class="admin-field">
          <label>Company URL</label>
          <input type="url" name="experience.${i}.companyUrl" value="${esc(e.companyUrl)}">
        </div>
        <div class="admin-field">
          <label>Period</label>
          <input type="text" name="experience.${i}.period" value="${esc(e.period)}" placeholder="Jan 2023 — Present">
        </div>
      </div>
      <div class="admin-field">
        <label>Bullet points <span class="admin-hint">(one per line)</span></label>
        <textarea name="experience.${i}.bullets" rows="5">${esc(e.bullets.join('\n'))}</textarea>
      </div>
      <div class="admin-field">
        <label>Tags <span class="admin-hint">(comma-separated)</span></label>
        <input type="text" name="experience.${i}.tags" value="${esc(e.tags.join(', '))}">
      </div>
    </div>`;
}

function buildExperiencePanel(data) {
  const cards = data.experience.map((e, i) => buildExpCard(e, i)).join('');
  return `
    <h2 class="admin-panel__title">Experience</h2>
    <div id="experience-list">${cards}</div>
    <button type="button" class="admin-btn admin-btn--add" id="add-experience">+ Add Experience</button>`;
}

function buildContactPanel(data) {
  const c = data.contact;
  return `
    <h2 class="admin-panel__title">Contact</h2>
    <div class="admin-field">
      <label>Lead paragraph</label>
      <textarea name="contact.lead" rows="3">${esc(c.lead)}</textarea>
    </div>
    <div class="admin-field">
      <label>Email</label>
      <input type="email" name="contact.email" value="${esc(c.email)}">
    </div>
    <div class="admin-row">
      <div class="admin-field">
        <label>LinkedIn URL</label>
        <input type="url" name="contact.linkedinUrl" value="${esc(c.linkedinUrl)}">
      </div>
      <div class="admin-field">
        <label>LinkedIn label</label>
        <input type="text" name="contact.linkedinLabel" value="${esc(c.linkedinLabel)}">
      </div>
    </div>
    <div class="admin-row">
      <div class="admin-field">
        <label>GitHub URL</label>
        <input type="url" name="contact.githubUrl" value="${esc(c.githubUrl)}">
      </div>
      <div class="admin-field">
        <label>GitHub label</label>
        <input type="text" name="contact.githubLabel" value="${esc(c.githubLabel)}">
      </div>
    </div>`;
}

/* ─── Read form data back into content object ────────────────────────────── */
function readForm(form, data) {
  const inputs = form.querySelectorAll('[name]');

  inputs.forEach(el => {
    const name  = el.name;
    const value = el.type === 'checkbox' ? el.checked : el.value.trim();
    const parts = name.split('.');

    if (parts[0] === 'hero') {
      if (parts[1] === 'typedWords') {
        data.hero.typedWords = value.split(',').map(s => s.trim()).filter(Boolean);
      } else {
        data.hero[parts[1]] = value;
      }
    } else if (parts[0] === 'about') {
      if (parts[1] === 'bio') {
        data.about.bio[parseInt(parts[2])] = value;
      } else if (parts[1] === 'available') {
        data.about.available = value;
      } else {
        data.about[parts[1]] = value;
      }
    } else if (parts[0] === 'projects') {
      const idx  = parseInt(parts[1]);
      const key  = parts[2];
      if (!data.projects[idx]) data.projects[idx] = {};
      if (key === 'tags') {
        data.projects[idx].tags = value.split(',').map(s => s.trim()).filter(Boolean);
      } else {
        data.projects[idx][key] = value;
      }
    } else if (parts[0] === 'experience') {
      const idx  = parseInt(parts[1]);
      const key  = parts[2];
      if (!data.experience[idx]) data.experience[idx] = {};
      if (key === 'bullets') {
        data.experience[idx].bullets = value.split('\n').map(s => s.trim()).filter(Boolean);
      } else if (key === 'tags') {
        data.experience[idx].tags = value.split(',').map(s => s.trim()).filter(Boolean);
      } else {
        data.experience[idx][key] = value;
      }
    } else if (parts[0] === 'contact') {
      data.contact[parts[1]] = value;
    }
  });

  return data;
}

/* ─── HTML generation ────────────────────────────────────────────────────── */
function generateHtml(content) {
  const h = content.hero;
  const a = content.about;
  const c = content.contact;

  const projectsHtml = content.projects.map((p, i) => {
    const icon     = PROJECT_ICONS[p.icon] || PROJECT_ICONS.cloud;
    const tagsHtml = p.tags.map(t => `                    <span class="tag">${esc(t)}</span>`).join('\n');
    return `
            <!-- PROJECT ${i + 1} -->
            <article class="project-card reveal">
              <div class="project-card__header">
                <div class="project-card__icon" aria-hidden="true">
                  ${icon}
                </div>
                <div class="project-card__links">
                  <a href="${esc(p.githubUrl)}" class="project-card__link" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
                    ${SVG.github}
                  </a>
                  <a href="${esc(p.demoUrl)}" class="project-card__link" target="_blank" rel="noopener noreferrer" aria-label="Live demo">
                    ${SVG.external}
                  </a>
                </div>
              </div>
              <h3 class="project-card__title">${esc(p.title)}</h3>
              <p class="project-card__desc">${esc(p.desc)}</p>
              <div class="project-card__tags">
${tagsHtml}
              </div>
            </article>`;
  }).join('\n');

  const expHtml = content.experience.map((e, i) => {
    const bulletsHtml = e.bullets.map(b => `                  <li>${esc(b)}</li>`).join('\n');
    const tagsHtml    = e.tags.map(t => `<span class="tag tag--sm">${esc(t)}</span>`).join('\n                  ');
    return `
            <!-- EXPERIENCE ${i + 1} -->
            <article class="timeline__item reveal">
              <div class="timeline__marker" aria-hidden="true"></div>
              <div class="timeline__content">
                <div class="timeline__meta">
                  <h3 class="timeline__role">${esc(e.role)}</h3>
                  <a href="${esc(e.companyUrl)}" class="timeline__company" target="_blank" rel="noopener noreferrer">${esc(e.company)}</a>
                  <span class="timeline__period">${esc(e.period)}</span>
                </div>
                <ul class="timeline__bullets" role="list">
${bulletsHtml}
                </ul>
                <div class="timeline__tags">
                  ${tagsHtml}
                </div>
              </div>
            </article>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Daniel Madera — Technical Success Manager</title>
    <meta
      name="description"
      content="Technical Success Manager and aspiring Cloud Architect bridging complex technical systems with client-driven solutions."
    />

    <!-- Open Graph / Social preview -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.danielmadera.dev/" />
    <meta property="og:title" content="Daniel Madera — Technical Success Manager" />
    <meta
      property="og:description"
      content="Technical Success Manager and aspiring Cloud Architect bridging complex technical systems with client-driven solutions."
    />

    <!-- Google Fonts: Outfit (headings) + Space Grotesk (body) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />

    <!-- Devicons for skill icons -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css"
    />

    <link rel="stylesheet" href="css/styles.css" />
  </head>

  <body>
    <!-- ─── NAVIGATION ──────────────────────────────────────────────────── -->
    <nav class="nav" id="nav" aria-label="Primary navigation">
      <div class="nav__inner">
        <a href="#hero" class="nav__logo" aria-label="Back to top">DM</a>

        <button
          class="nav__hamburger"
          id="nav-toggle"
          aria-expanded="false"
          aria-controls="nav-links"
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul class="nav__links" id="nav-links" role="list">
          <li><a href="#about" class="nav__link">About</a></li>
          <li><a href="#skills" class="nav__link">Skills</a></li>
          <li><a href="#projects" class="nav__link">Projects</a></li>
          <li><a href="#experience" class="nav__link">Experience</a></li>
          <li>
            <a href="#contact" class="nav__link nav__link--cta">Contact</a>
          </li>
        </ul>
      </div>
    </nav>

    <main>
      <!-- ─── HERO ──────────────────────────────────────────────────────── -->
      <section class="hero" id="hero" aria-label="Introduction">
        <canvas class="hero__canvas" id="hero-canvas" aria-hidden="true"></canvas>

        <div class="hero__orb hero__orb--1" aria-hidden="true"></div>
        <div class="hero__orb hero__orb--2" aria-hidden="true"></div>
        <div class="hero__orb hero__orb--3" aria-hidden="true"></div>

        <div class="hero__content">
          <p class="hero__greeting reveal">${esc(h.greeting)}</p>
          <h1 class="hero__name reveal">${esc(h.name)}</h1>
          <h2 class="hero__title reveal">
            Turning technical complexity into
            <span class="hero__title-highlight" id="typed-text"></span><span class="cursor" aria-hidden="true">|</span>
          </h2>
          <p class="hero__tagline reveal">
            ${esc(h.tagline)}
          </p>

          <div class="hero__cta reveal">
            <a href="#projects" class="btn btn--primary">View My Work</a>
            <a href="#contact" class="btn btn--ghost">Get In Touch</a>
          </div>

          <div class="hero__scroll" aria-hidden="true">
            <span class="hero__scroll-line"></span>
          </div>
        </div>
      </section>

      <!-- ─── ABOUT ─────────────────────────────────────────────────────── -->
      <section class="about section" id="about" aria-label="About me">
        <div class="container">
          <div class="section__header reveal">
            <span class="section__label">01 / About</span>
            <h2 class="section__title">A little about me</h2>
          </div>

          <div class="about__grid">
            <div class="about__photo-wrap reveal">
              <div class="about__photo-frame">
                <img src="assets/headshot.jpg" alt="Daniel Madera" class="about__photo-img" />
                <div class="about__photo-badge">${a.available ? 'Available for work' : 'Not currently available'}</div>
              </div>
            </div>

            <div class="about__content reveal">
              <p class="about__bio">
                ${esc(a.bio[0])}
              </p>
              <p class="about__bio">
                ${esc(a.bio[1])}
              </p>

              <div class="about__meta">
                <div class="about__meta-item">
                  <span class="about__meta-label">Location</span>
                  <span class="about__meta-value">${esc(a.location)}</span>
                </div>
                <div class="about__meta-item">
                  <span class="about__meta-label">Status</span>
                  <span class="about__meta-value${a.available ? ' about__meta-value--available' : ''}">${esc(a.status)}</span>
                </div>
                <div class="about__meta-item">
                  <span class="about__meta-label">Focus</span>
                  <span class="about__meta-value">${esc(a.focus)}</span>
                </div>
              </div>

              <a href="${esc(a.resumeUrl)}" class="btn btn--outline" download>Download Résumé</a>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── SKILLS ────────────────────────────────────────────────────── -->
      <section class="skills section" id="skills" aria-label="Skills and technologies">
        <div class="container">
          <div class="section__header reveal">
            <span class="section__label">02 / Skills</span>
            <h2 class="section__title">Technologies I work with</h2>
          </div>

          <div class="skills__categories">

            <!-- Languages -->
            <div class="skills__group reveal">
              <h3 class="skills__group-title">Languages</h3>
              <div class="skills__grid">
                <div class="skill-card">
                  <i class="devicon-python-plain colored" aria-hidden="true"></i>
                  <span>Python</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-javascript-plain colored" aria-hidden="true"></i>
                  <span>JavaScript</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-typescript-plain colored" aria-hidden="true"></i>
                  <span>TypeScript</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-java-plain colored" aria-hidden="true"></i>
                  <span>Java</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-go-plain colored" aria-hidden="true"></i>
                  <span>Go</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-bash-plain" aria-hidden="true"></i>
                  <span>Bash</span>
                </div>
              </div>
            </div>

            <!-- Frontend -->
            <div class="skills__group reveal">
              <h3 class="skills__group-title">Frontend</h3>
              <div class="skills__grid">
                <div class="skill-card">
                  <i class="devicon-react-original colored" aria-hidden="true"></i>
                  <span>React</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-nextjs-plain" aria-hidden="true"></i>
                  <span>Next.js</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-html5-plain colored" aria-hidden="true"></i>
                  <span>HTML5</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-css3-plain colored" aria-hidden="true"></i>
                  <span>CSS3</span>
                </div>
              </div>
            </div>

            <!-- Backend & Cloud -->
            <div class="skills__group reveal">
              <h3 class="skills__group-title">Backend & Cloud</h3>
              <div class="skills__grid">
                <div class="skill-card">
                  <i class="devicon-nodejs-plain colored" aria-hidden="true"></i>
                  <span>Node.js</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-fastapi-plain colored" aria-hidden="true"></i>
                  <span>FastAPI</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-amazonwebservices-plain-wordmark colored" aria-hidden="true"></i>
                  <span>AWS</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-postgresql-plain colored" aria-hidden="true"></i>
                  <span>PostgreSQL</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-redis-plain colored" aria-hidden="true"></i>
                  <span>Redis</span>
                </div>
              </div>
            </div>

            <!-- DevOps & Tools -->
            <div class="skills__group reveal">
              <h3 class="skills__group-title">DevOps & Tools</h3>
              <div class="skills__grid">
                <div class="skill-card">
                  <i class="devicon-docker-plain colored" aria-hidden="true"></i>
                  <span>Docker</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-git-plain colored" aria-hidden="true"></i>
                  <span>Git</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-linux-plain" aria-hidden="true"></i>
                  <span>Linux</span>
                </div>
                <div class="skill-card">
                  <i class="devicon-github-original" aria-hidden="true"></i>
                  <span>GitHub</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ─── PROJECTS ──────────────────────────────────────────────────── -->
      <section class="projects section" id="projects" aria-label="Projects">
        <div class="container">
          <div class="section__header reveal">
            <span class="section__label">03 / Projects</span>
            <h2 class="section__title">Things I've built</h2>
          </div>

          <div class="projects__grid">
${projectsHtml}
          </div>

          <div class="projects__more reveal">
            <a
              href="${esc(c.githubUrl)}"
              class="btn btn--ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              View more on GitHub
              ${SVG.arrow}
            </a>
          </div>
        </div>
      </section>

      <!-- ─── EXPERIENCE ─────────────────────────────────────────────────── -->
      <section class="experience section" id="experience" aria-label="Work experience">
        <div class="container">
          <div class="section__header reveal">
            <span class="section__label">04 / Experience</span>
            <h2 class="section__title">Where I've worked</h2>
          </div>

          <div class="timeline">
${expHtml}
          </div>
        </div>
      </section>

      <!-- ─── CONTACT ───────────────────────────────────────────────────── -->
      <section class="contact section" id="contact" aria-label="Contact">
        <div class="container">
          <div class="section__header reveal">
            <span class="section__label">05 / Contact</span>
            <h2 class="section__title">Let's work together</h2>
          </div>

          <div class="contact__grid">
            <div class="contact__info reveal">
              <p class="contact__lead">
                ${esc(c.lead)}
              </p>

              <div class="contact__links">
                <a href="mailto:${esc(c.email)}" class="contact__link">
                  <span class="contact__link-icon" aria-hidden="true">
                    ${SVG.email}
                  </span>
                  <span>${esc(c.email)}</span>
                </a>
                <a href="${esc(c.linkedinUrl)}" class="contact__link" target="_blank" rel="noopener noreferrer">
                  <span class="contact__link-icon" aria-hidden="true">
                    ${SVG.linkedin}
                  </span>
                  <span>${esc(c.linkedinLabel)}</span>
                </a>
                <a href="${esc(c.githubUrl)}" class="contact__link" target="_blank" rel="noopener noreferrer">
                  <span class="contact__link-icon" aria-hidden="true">
                    ${SVG.github}
                  </span>
                  <span>${esc(c.githubLabel)}</span>
                </a>
              </div>
            </div>

            <!-- Contact form — static; uses mailto fallback -->
            <form
              class="contact__form reveal"
              id="contact-form"
              action="mailto:${esc(c.email)}"
              method="post"
              enctype="text/plain"
              novalidate
              aria-label="Contact form"
            >
              <div class="form__group">
                <label for="contact-name" class="form__label">Name</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  class="form__input"
                  placeholder="Jane Smith"
                  required
                  autocomplete="name"
                />
              </div>
              <div class="form__group">
                <label for="contact-email" class="form__label">Email</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  class="form__input"
                  placeholder="jane@company.com"
                  required
                  autocomplete="email"
                />
              </div>
              <div class="form__group">
                <label for="contact-message" class="form__label">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  class="form__input form__textarea"
                  placeholder="Tell me about your project or opportunity..."
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn btn--primary btn--full">
                Send Message
                ${SVG.send}
              </button>
              <p class="form__note">
                This form opens your email client. Alternatively, reach me
                directly at
                <a href="mailto:${esc(c.email)}">${esc(c.email)}</a>.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>

    <!-- ─── FOOTER ────────────────────────────────────────────────────────── -->
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer__inner">
          <p class="footer__copy">
            &copy; <span id="footer-year"></span> Daniel Madera. Designed &amp; built with care.
          </p>
          <div class="footer__social" aria-label="Social links">
            <a href="${esc(c.githubUrl)}" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              ${SVG.github}
            </a>
            <a href="${esc(c.linkedinUrl)}" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              ${SVG.linkedin}
            </a>
          </div>
        </div>
      </div>
    </footer>

<!-- BuenaVista AI Widget -->
<div id="bv-widget"></div>
<script>
  window.BV_CONFIG = {
    clientId: 'daniel-portfolio',
    apiUrl: 'https://emcf6hrawb.execute-api.us-east-1.amazonaws.com/chat',
    title: 'Ask about Daniel',
    subtitle: 'AI Assistant — powered by Claude',
    placeholder: 'Ask about my experience, skills, or projects...',
    accentColor: '#7c6dfa'
  };
</script>
<script>window.TYPED_WORDS = ${JSON.stringify(h.typedWords)};</script>
<script src="https://d2iql7x2dn8okz.cloudfront.net/widget.js"></script>
    <script src="js/main.js"></script>
  </body>
</html>`;
}

/* ─── Download trigger ───────────────────────────────────────────────────── */
function downloadHtml(html) {
  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'index.html';
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Main editor init ───────────────────────────────────────────────────── */
function initEditor() {
  initTabs();

  const data = loadContent();
  const form = document.getElementById('editor-form');

  document.getElementById('panel-hero').innerHTML       = buildHeroPanel(data);
  document.getElementById('panel-about').innerHTML      = buildAboutPanel(data);
  document.getElementById('panel-projects').innerHTML   = buildProjectsPanel(data);
  document.getElementById('panel-experience').innerHTML = buildExperiencePanel(data);
  document.getElementById('panel-contact').innerHTML    = buildContactPanel(data);

  /* Save + Download */
  document.getElementById('download-btn').addEventListener('click', () => {
    const current = readForm(form, structuredClone(data));
    saveContent(current);
    downloadHtml(generateHtml(current));
    showToast('index.html downloaded — replace src/index.html and run deploy.sh');
  });

  /* Save draft */
  document.getElementById('save-btn').addEventListener('click', () => {
    const current = readForm(form, loadContent());
    saveContent(current);
    showToast('Draft saved.');
  });

  /* Reset to defaults */
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (!confirm('Reset all content to defaults? This cannot be undone.')) return;
    localStorage.removeItem(CONTENT_KEY);
    location.reload();
  });

  /* Add project */
  form.addEventListener('click', (e) => {
    if (e.target.id === 'add-project') {
      const current = readForm(form, loadContent());
      current.projects.push({ title: '', desc: '', tags: [], githubUrl: '', demoUrl: '', icon: 'cloud' });
      saveContent(current);
      document.getElementById('panel-projects').innerHTML = buildProjectsPanel(current);
    }

    if (e.target.id === 'add-experience') {
      const current = readForm(form, loadContent());
      current.experience.push({ role: '', company: '', companyUrl: '', period: '', bullets: [], tags: [] });
      saveContent(current);
      document.getElementById('panel-experience').innerHTML = buildExperiencePanel(current);
    }

    /* Remove buttons */
    if (e.target.dataset.remove === 'project') {
      const current = readForm(form, loadContent());
      current.projects.splice(parseInt(e.target.dataset.index), 1);
      saveContent(current);
      document.getElementById('panel-projects').innerHTML = buildProjectsPanel(current);
    }

    if (e.target.dataset.remove === 'experience') {
      const current = readForm(form, loadContent());
      current.experience.splice(parseInt(e.target.dataset.index), 1);
      saveContent(current);
      document.getElementById('panel-experience').innerHTML = buildExperiencePanel(current);
    }
  });
}

/* ─── Toast notification ─────────────────────────────────────────────────── */
function showToast(msg) {
  const existing = document.getElementById('admin-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'admin-toast';
  toast.className = 'admin-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('admin-toast--visible'));
  setTimeout(() => {
    toast.classList.remove('admin-toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
