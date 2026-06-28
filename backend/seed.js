/**
 * Seed script — populates Neon PostgreSQL with sample projects.
 * Run with: node seed.js
 */
require('dotenv').config();
const { pool, initDB } = require('./config/db');

const sampleProjects = [
  {
    title: 'Resume Builder',
    description: 'A web app that lets users create professional resumes instantly. Fill in your details, choose a template, and download a polished PDF — no design skills needed.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600',
    liveUrl: 'https://verdant-jelly-339373.netlify.app',
    githubUrl: 'https://github.com/angelin-hub/resume-builder.git',
    featured: true,
    category: 'Web',
  },
  {
    title: 'Memory Simulator',
    description: 'An interactive memory management simulator that visualizes how operating systems allocate and deallocate memory. Great for understanding OS concepts hands-on.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
    liveUrl: 'https://tangerine-genie-378a70.netlify.app/',
    githubUrl: 'https://github.com/angelin-hub/memory-simulator.git',
    featured: true,
    category: 'Web',
  },
];

const seed = async () => {
  await initDB(); // ensure tables exist
  try {
    await pool.query('DELETE FROM projects');
    console.log('Cleared existing projects.');

    for (const p of sampleProjects) {
      await pool.query(
        `INSERT INTO projects (title, description, tech_stack, image_url, live_url, github_url, featured, category)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [p.title, p.description, p.techStack, p.imageUrl, p.liveUrl, p.githubUrl, p.featured, p.category]
      );
    }

    console.log(`Seeded ${sampleProjects.length} projects successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
