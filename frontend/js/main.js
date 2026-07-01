/**
 * Portfolio — main.js
 * Handles: navbar scroll, typed text, project fetching, filtering, contact form, animations
 */

const API_BASE = 'http://localhost:5000/api';

// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);

  // Active nav link highlighting
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== Back to top =====
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Typed text animation =====
const roles = ['AI Engineer 🤖', 'Full Stack Developer', 'CS Student 🎓', 'Problem Solver ⚡'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeEffect() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => { isDeleting = true; typeEffect(); }, 1800);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  setTimeout(typeEffect, isDeleting ? 60 : 100);
}
typeEffect();

// ===== Counter animation =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  let count = 0;
  const step = Math.ceil(target / 50);
  const timer = setInterval(() => {
    count += step;
    if (count >= target) { count = target; clearInterval(timer); }
    el.textContent = count + (el.dataset.suffix || '');
  }, 30);
}
const counters = document.querySelectorAll('.stat-number[data-target]');
let countersStarted = false;

// ===== Intersection Observer for animations =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // stop watching once visible
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Start counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    counters.forEach(animateCounter);
  }
});
heroObserver.observe(document.getElementById('hero'));

// ===== Projects =====
let allProjects = [];

async function fetchProjects() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = '<div class="project-loading">Loading projects...</div>';

  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    allProjects = data.data || [];
    renderProjects(allProjects);
  } catch {
    // Fall back to static sample data if API is unreachable
    allProjects = getSampleProjects();
    renderProjects(allProjects);
  }
}

function getSampleProjects() {
  return [
    {
      _id: '7',
      title: 'AuraCart',
      description: 'A modern e-commerce web application with product listings, cart management, and a clean shopping experience. Features responsive design and smooth UI interactions.',
      techStack: ['React', 'JavaScript', 'CSS', 'Node.js'],
      imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
      liveUrl: 'https://aauracart.netlify.app/',
      githubUrl: 'https://github.com/angelin-hub/auracart.git',
      category: 'Full Stack',
    },
    {
      _id: '1',
      title: 'Resume Builder',
      description: 'A web app that lets users create professional resumes instantly. Fill in your details, choose a template, and download a polished PDF — no design skills needed.',
      techStack: ['HTML', 'CSS', 'JavaScript'],
      imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600',
      liveUrl: 'https://verdant-jelly-339373.netlify.app',
      githubUrl: 'https://github.com/angelin-hub/resume-builder.git',
      category: 'Web',
    },
    {
      _id: '2',
      title: 'Memory Simulator',
      description: 'An interactive memory management simulator that visualizes how operating systems allocate and deallocate memory. Great for understanding OS concepts hands-on.',
      techStack: ['HTML', 'CSS', 'JavaScript'],
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
      liveUrl: 'https://tangerine-genie-378a70.netlify.app/',
      githubUrl: 'https://github.com/angelin-hub/memory-simulator.git',
      category: 'Web',
    },
    {
      _id: '3',
      title: 'BlogVerse AI',
      description: 'An AI-powered blogging platform where users can create, publish, and discover blogs. Features AI-assisted writing, smart content suggestions, and a modern reading experience.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600',
      liveUrl: 'https://blogverse-ai.netlify.app/',
      githubUrl: 'https://github.com/angelin-hub/blogverse-ai.git',
      category: 'Full Stack',
    },
    {
      _id: '4',
      title: 'TaskFlow AI',
      description: 'A full-stack AI-powered task management app with Kanban board, JWT authentication, productivity scoring, drag-and-drop tasks, and real-time updates via Socket.io.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
      imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600',
      liveUrl: 'https://storied-melomakarona-d21a7b.netlify.app',
      githubUrl: 'https://github.com/angelin-hub/taskflow-ai.git',
      category: 'Full Stack',
    },
    {
      _id: '5',
      title: 'Privacy-Aware AI Model Sharing',
      description: 'Secure IoT healthcare framework using Federated Learning to share AI models without exposing patient data. Includes MQTT communication and anomaly detection.',
      techStack: ['Python', 'MQTT', 'Federated Learning', 'IoT'],
      imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600',
      liveUrl: '',
      githubUrl: 'https://github.com/angelin-hub',
      category: 'AI/ML',
    },
    {
      _id: '6',
      title: 'Smart Alarm Scheduler',
      description: 'Desktop application using Python and Tkinter for managing reminders with alarm notifications, CRUD operations, and SQLite database storage.',
      techStack: ['Python', 'Tkinter', 'SQLite'],
      imageUrl: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?w=600',
      liveUrl: '',
      githubUrl: 'https://github.com/angelin-hub',
      category: 'Desktop',
    },
  ];
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!projects.length) {
    grid.innerHTML = '<div class="project-error">No projects found.</div>';
    return;
  }

  grid.innerHTML = projects.map(p => `
    <article class="project-card fade-in" role="listitem">
      <div class="project-img">
        ${p.imageUrl
          ? `<img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
          : ''}
        <div class="project-img-placeholder" ${p.imageUrl ? 'style="display:none"' : ''}>🖥️</div>
        <div class="project-overlay">
          ${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" class="overlay-btn" target="_blank" rel="noopener">🚀 Live</a>` : ''}
          ${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" class="overlay-btn" target="_blank" rel="noopener">⭐ GitHub</a>` : ''}
        </div>
      </div>
      <div class="project-body">
        <div class="project-category">${escapeHtml(p.category)}</div>
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-desc">${escapeHtml(p.description)}</p>
        <div class="project-tech">
          ${(p.techStack || []).map(t => `<span class="tech-badge">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

fetchProjects();

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  formFeedback.className = 'form-feedback';
  formFeedback.textContent = '';

  const formData = {
    name: contactForm.name.value.trim(),
    email: contactForm.email.value.trim(),
    subject: contactForm.subject.value.trim(),
    message: contactForm.message.value.trim(),
  };

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      formFeedback.textContent = '✅ ' + data.message;
      formFeedback.className = 'form-feedback success';
      contactForm.reset();
    } else {
      throw new Error(data.message || 'Something went wrong.');
    }
  } catch (err) {
    formFeedback.textContent = '❌ ' + (err.message || 'Failed to send message. Please try again.');
    formFeedback.className = 'form-feedback error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
});

// ===== Utility =====
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ===== Particle Background =====
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.8 + 0.4;
    this.dx = (Math.random() - 0.5) * 0.4;
    this.dy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 216, 122, ${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(232, 216, 122, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();
