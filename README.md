# Personal Portfolio Website

A full-stack personal portfolio built with **Node.js + Express**, **MongoDB**, and **Vanilla JS/HTML/CSS**.

## Project Structure

```
portfolio/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── Project.js         # Project schema
│   │   └── Message.js         # Contact message schema
│   ├── routes/
│   │   ├── projects.js        # CRUD API for projects
│   │   └── contact.js         # Contact form API
│   ├── server.js              # Express app entry point
│   ├── seed.js                # Database seeder (sample data)
│   └── package.json
└── frontend/
    ├── index.html             # Single-page portfolio
    ├── css/
    │   └── style.css          # All styles (dark theme)
    └── js/
        └── main.js            # Typed text, projects fetch, contact form
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### 1. Backend Setup

```bash
cd backend
npm install
```

Copy the example env file and fill in your MongoDB URI:

```bash
copy .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/portfolio
PORT=5000
```

Start the server:
```bash
npm run dev       # development (nodemon)
npm start         # production
```

### 2. Seed Sample Projects

```bash
cd backend
node seed.js
```

### 3. Frontend

Open `frontend/index.html` directly in your browser, or use a simple static server:

```bash
npx serve frontend
```

The frontend fetches projects from `http://localhost:5000/api/projects`. If the backend is offline, it falls back to built-in sample data automatically.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects?featured=true` | Featured projects only |
| GET | `/api/projects?category=Web` | Filter by category |
| GET | `/api/projects/:id` | Single project |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/contact` | Submit contact message |
| GET | `/api/health` | Health check |

## Deployment

### Backend — Render / Railway / Heroku

1. Push your `backend/` folder to a GitHub repo
2. Connect to Render/Railway and set the `MONGO_URI` and `PORT` environment variables
3. Set start command: `npm start`

### Frontend — Vercel / Netlify

1. Point to the `frontend/` folder
2. Update `API_BASE` in `frontend/js/main.js` to your deployed backend URL

### Full-stack on Render

Set `NODE_ENV=production` in your backend env. The Express server will serve the `frontend/` directory as static files, so you only need one deployment.

## Features

- **Dark theme** with CSS custom properties
- **Typed text animation** cycling through roles
- **Project cards** with category filtering
- **Live / GitHub links** revealed on hover
- **Graceful fallback** — works without a backend
- **Contact form** wired to the Express API + MongoDB
- **Fade-in scroll animations** via Intersection Observer
- **Animated counters** in the hero section
- **Sticky navbar** with active section highlighting
- **Fully responsive** down to mobile
- **Accessible** — semantic HTML, ARIA labels, keyboard navigable

## Customization

1. Replace `Alex Morgan` with your name everywhere in `index.html`
2. Swap the emoji avatar for a real `<img>` tag in the hero and about sections
3. Edit the skills, experience timeline, and contact details in `index.html`
4. Add real projects via the POST `/api/projects` endpoint or the seed script
5. Update social media links in the contact section
