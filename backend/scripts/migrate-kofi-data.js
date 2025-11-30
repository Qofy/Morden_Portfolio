const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'database', 'portfolio.db');
const db = new Database(dbPath);

const portfolioData = {
  personal: {
    name: "Kofi Safo Agyekum",
    title: "Full Stack Developer",
    location: "German 🇩🇪",
    bio: "I like to build web applications, solve complex problems and continuously learn new technologies.",
    photo: "/assets/profile/profile.png",
    resumeUrl: "/resume.pdf"
  },

  socialLinks: [
    { name: "Resume", icon: "file-text", url: "#resume" },
    { name: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/kofi-agyekum-870569298/" },
    { name: "GitHub", icon: "github", url: "https://github.com/Qofy" },
    { name: "Email", icon: "mail", url: "mailto:safokofi888@gmail.com" }
  ],

  workExperience: [
    {
      id: 1,
      period: "Jul 2023 - Present",
      position: "Full Stack Developer - Freelance",
      company: "Freelance",
      location: "Remote",
      description: [
        "Designed and developed modern web applications using React, Node.js, and MongoDB",
        "Implemented CI/CD pipelines and automated deployment workflows",
        "Built responsive user interfaces with Tailwind CSS and Svelte",
        "Collaborated with clients to gather requirements and deliver solutions"
      ],
      tags: ["React", "Node.js", "MongoDB", "Svelte"]
    },
    {
      id: 2,
      period: "Aug 2021 - Jul 2023",
      position: "Frontend Developer",
      company: "Tech Company",
      location: "Berlin, Germany",
      description: [
        "Developed and maintained frontend applications using React and TypeScript",
        "Worked closely with design team to implement pixel-perfect UI components",
        "Optimized application performance and improved load times by 40%",
        "Mentored junior developers and conducted code reviews"
      ],
      tags: ["React", "TypeScript", "CSS", "Git"]
    },
    {
      id: 3,
      period: "May 2020 - Aug 2021",
      position: "Junior Developer",
      company: "Startup Inc",
      location: "Remote",
      description: [
        "Built web applications using HTML, CSS, JavaScript, and Vue.js",
        "Integrated RESTful APIs and third-party services",
        "Participated in agile development processes and daily standups",
        "Fixed bugs and implemented new features based on user feedback"
      ],
      tags: ["Vue.js", "JavaScript", "API Integration"]
    }
  ],

  education: [
    {
      id: 1,
      period: "2023 - 2026",
      degree: "Bachelor of Science in Software Engineering",
      institution: "University of Europe Of Applied Science",
      location: "Potsdam, Germany",
      description: [
        "Graduated with First Class Honors",
        "Focused on software engineering and web development",
        "Led university coding club and organized hackathons"
      ]
    }
  ],

  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce application with cart, checkout, and payment integration",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      image: "/projects/ecommerce.jpg",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/yourusername/project"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Real-time collaborative task management tool with drag-and-drop functionality",
      technologies: ["Svelte", "Firebase", "Tailwind CSS"],
      image: "/projects/taskapp.jpg",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/yourusername/project"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Interactive weather dashboard with location search and forecasts",
      technologies: ["Vue.js", "OpenWeather API", "Chart.js"],
      image: "/projects/weather.jpg",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/yourusername/project"
    }
  ],

  skills: {
    frontend: ["React", "Svelte", "Vue.js", "TypeScript", "Tailwind CSS", "HTML/CSS"],
    backend: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"],
    tools: ["Git", "Docker", "CI/CD", "Vite", "Webpack"],
    other: ["Agile", "Problem Solving", "Team Collaboration", "Code Review"]
  }
};

function initializeSchema() {
  console.log('Initializing database schema...');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS portfolios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      name TEXT,
      title TEXT,
      location TEXT,
      bio TEXT,
      photo TEXT,
      resume_url TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS work_experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portfolio_id INTEGER NOT NULL,
      period TEXT,
      position TEXT,
      company TEXT,
      location TEXT,
      description TEXT,
      tags TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portfolio_id INTEGER NOT NULL,
      period TEXT,
      degree TEXT,
      institution TEXT,
      location TEXT,
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portfolio_id INTEGER NOT NULL,
      title TEXT,
      description TEXT,
      technologies TEXT,
      image TEXT,
      live_url TEXT,
      github_url TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portfolio_id INTEGER NOT NULL,
      category TEXT,
      skill_name TEXT,
      FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portfolio_id INTEGER NOT NULL,
      name TEXT,
      icon TEXT,
      url TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
  `);

  console.log('Database schema initialized successfully');
}

async function migrate() {
  try {
    console.log('Starting migration...');

    db.pragma('foreign_keys = ON');

    initializeSchema();

    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get('kofi');

    if (existingUser) {
      console.log('Kofi user already exists. Skipping migration.');
      return;
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    const userResult = db.prepare(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    ).run('kofi', 'kofi@example.com', hashedPassword);

    const userId = userResult.lastInsertRowid;
    console.log(`Created user with ID: ${userId}`);

    const portfolioResult = db.prepare(`
      INSERT INTO portfolios (user_id, name, title, location, bio, photo, resume_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      portfolioData.personal.name,
      portfolioData.personal.title,
      portfolioData.personal.location,
      portfolioData.personal.bio,
      portfolioData.personal.photo,
      portfolioData.personal.resumeUrl
    );

    const portfolioId = portfolioResult.lastInsertRowid;
    console.log(`Created portfolio with ID: ${portfolioId}`);

    portfolioData.workExperience.forEach((work, index) => {
      db.prepare(`
        INSERT INTO work_experience (portfolio_id, period, position, company, location, description, tags, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        portfolioId,
        work.period,
        work.position,
        work.company,
        work.location,
        JSON.stringify(work.description),
        JSON.stringify(work.tags),
        index
      );
    });
    console.log(`Inserted ${portfolioData.workExperience.length} work experience entries`);

    portfolioData.education.forEach((edu, index) => {
      db.prepare(`
        INSERT INTO education (portfolio_id, period, degree, institution, location, description, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        portfolioId,
        edu.period,
        edu.degree,
        edu.institution,
        edu.location,
        JSON.stringify(edu.description),
        index
      );
    });
    console.log(`Inserted ${portfolioData.education.length} education entries`);

    portfolioData.projects.forEach((project, index) => {
      db.prepare(`
        INSERT INTO projects (portfolio_id, title, description, technologies, image, live_url, github_url, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        portfolioId,
        project.title,
        project.description,
        JSON.stringify(project.technologies),
        project.image,
        project.liveUrl,
        project.githubUrl,
        index
      );
    });
    console.log(`Inserted ${portfolioData.projects.length} project entries`);

    Object.entries(portfolioData.skills).forEach(([category, skills]) => {
      skills.forEach((skill) => {
        db.prepare(`
          INSERT INTO skills (portfolio_id, category, skill_name)
          VALUES (?, ?, ?)
        `).run(portfolioId, category, skill);
      });
    });
    console.log('Inserted skills');

    portfolioData.socialLinks.forEach((link, index) => {
      db.prepare(`
        INSERT INTO social_links (portfolio_id, name, icon, url, sort_order)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        portfolioId,
        link.name,
        link.icon,
        link.url,
        index
      );
    });
    console.log(`Inserted ${portfolioData.socialLinks.length} social links`);

    console.log('\nMigration completed successfully!');
    console.log('Username: kofi');
    console.log('Password: password123');
    console.log('Portfolio accessible at: http://localhost:5173/kofi');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    db.close();
  }
}

migrate();
