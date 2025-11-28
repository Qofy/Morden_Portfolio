<script lang="ts">
  import { ExternalLink, Github } from 'lucide-svelte';
  import { portfolioData } from '../lib/data';

  const { projects } = portfolioData;
</script>

<section class="projects-section" id="projects">
  <div class="container">
    <h2>Projects</h2>

    <div class="projects-grid">
      {#each projects as project}
        <div class="project-card">
          <div class="project-image">
            <img src={project.image} alt={project.title} />
            <div class="project-overlay">
              <div class="project-links">
                {#if project.liveUrl}
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" class="link-btn">
                    <ExternalLink size={20} />
                    Live Demo
                  </a>
                {/if}
                {#if project.githubUrl}
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" class="link-btn">
                    <Github size={20} />
                    Code
                  </a>
                {/if}
              </div>
            </div>
          </div>

          <div class="project-info">
            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <div class="tech-stack">
              {#each project.technologies as tech}
                <span class="tech-tag">{tech}</span>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .projects-section {
    padding: 6rem 2rem;
    background: var(--bg-primary);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  h2 {
    font-size: 2.5rem;
    color: var(--text-primary);
    margin-bottom: 3rem;
    text-align: center;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
  }

  .project-card {
    background: var(--bg-secondary);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .project-image {
    position: relative;
    width: 100%;
    height: 220px;
    overflow: hidden;
    background: var(--bg-hover);
  }

  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .project-card:hover .project-image img {
    transform: scale(1.05);
  }

  .project-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .project-card:hover .project-overlay {
    opacity: 1;
  }

  .project-links {
    display: flex;
    gap: 1rem;
  }

  .link-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--accent-color);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .link-btn:hover {
    background: #1a8cd8;
    transform: translateY(-2px);
  }

  .project-info {
    padding: 1.5rem;
  }

  h3 {
    font-size: 1.4rem;
    color: var(--text-primary);
    margin: 0 0 0.75rem 0;
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
  }

  .tech-stack {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tech-tag {
    background: var(--bg-hover);
    color: var(--accent-color);
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.85rem;
    border: 1px solid var(--border-color);
  }

  @media (max-width: 768px) {
    .projects-section {
      padding: 4rem 1rem;
    }

    h2 {
      font-size: 2rem;
    }

    .projects-grid {
      grid-template-columns: 1fr;
    }

    .project-links {
      flex-direction: column;
    }

    .link-btn {
      justify-content: center;
    }
  }
</style>
