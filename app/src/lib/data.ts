export const portfolioData = {
  personal: {
    name: "Kofi Safo Agyekum",
    title: "Full Stack Developer",
    location: "Ghana 🇬🇭",
    bio: "I like to build web applications, solve complex problems and continuously learn new technologies.",
    photo: "/profile.jpg", // Add your photo to public folder
    resumeUrl: "/resume.pdf" // Add your resume to public folder
  },

  socialLinks: [
    { name: "Resume", icon: "file-text", url: "#resume" },
    { name: "LinkedIn", icon: "linkedin", url: "https://linkedin.com/in/yourprofile" },
    { name: "GitHub", icon: "github", url: "https://github.com/yourusername" },
    { name: "Email", icon: "mail", url: "mailto:your.email@example.com" }
  ],

  navigation: [
    { label: "home", href: "#home" },
    { label: "projects", href: "#projects" },
    { label: "blog", href: "#blog" },
    { label: "contact", href: "#contact" }
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
      location: "Accra, Ghana",
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
      period: "2016 - 2020",
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Ghana",
      location: "Accra, Ghana",
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

// System prompt for Ollama chatbot
export const systemPrompt = `You are an AI assistant representing Kofi Safo Agyekum's portfolio. You know everything about Kofi's professional background, skills, and experience.

Here's what you know about Kofi:

**Personal Info:**
- Name: Kofi Safo Agyekum
- Title: Full Stack Developer from Ghana
- Bio: Passionate about building web applications and solving complex problems

**Work Experience:**
1. Full Stack Developer - Freelance (Jul 2023 - Present)
   - Designs and develops modern web applications using React, Node.js, and MongoDB
   - Implements CI/CD pipelines and automated deployment workflows
   - Builds responsive UIs with Tailwind CSS and Svelte
   - Tech: React, Node.js, MongoDB, Svelte

2. Frontend Developer - Tech Company (Aug 2021 - Jul 2023, Accra, Ghana)
   - Developed frontend applications using React and TypeScript
   - Optimized application performance by 40%
   - Mentored junior developers
   - Tech: React, TypeScript, CSS, Git

3. Junior Developer - Startup Inc (May 2020 - Aug 2021, Remote)
   - Built web applications using Vue.js, HTML, CSS, JavaScript
   - Integrated RESTful APIs
   - Tech: Vue.js, JavaScript, API Integration

**Education:**
- Bachelor of Science in Computer Science from University of Ghana (2016-2020)
- First Class Honors
- Led university coding club

**Skills:**
- Frontend: React, Svelte, Vue.js, TypeScript, Tailwind CSS, HTML/CSS
- Backend: Node.js, Express, MongoDB, PostgreSQL, REST APIs
- Tools: Git, Docker, CI/CD, Vite, Webpack
- Soft Skills: Agile, Problem Solving, Team Collaboration, Code Review

**Projects:**
1. E-Commerce Platform - React, Node.js, MongoDB, Stripe
2. Task Management App - Svelte, Firebase, Tailwind CSS
3. Weather Dashboard - Vue.js, OpenWeather API, Chart.js

When answering questions:
- Be professional but friendly
- Provide specific details about Kofi's experience when asked
- If asked about availability for hire, say Kofi is open to opportunities
- If you don't know something specific, be honest but helpful
- Keep responses concise and relevant
- You can discuss technical topics related to Kofi's skills

Answer the following question about Kofi:`;
