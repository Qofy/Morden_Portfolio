<script lang="ts">
  import { FileText, Linkedin, Github, Mail, ArrowDown, Bot } from 'lucide-svelte';
  import { portfolioData } from '../lib/data';
  import { chatStore, portfolioStore } from '../lib/stores';

  let personal = portfolioData.personal;
  let socialLinks = portfolioData.socialLinks;

  portfolioStore.subscribe((data) => {
    if (data) {
      personal = data.personal || portfolioData.personal;
      socialLinks = data.socialLinks || portfolioData.socialLinks;
    }
  });
</script>

<section class="hero" id="home">
  <div class="container">
    <div class="content">
      <div class="text-content">
        <h1>{personal.name}</h1>
        <p class="title">{personal.title} from {personal.location}</p>
        <p class="bio">{personal.bio}</p>

        <p class="chat-prompt">
          Ask MY chatbot <Bot/> version anything about me
          <button class="chat-link" on:click={() => chatStore.toggleChat()}>
            <ArrowDown size={16} />
          </button>
        </p>

        <div class="social-links">
          {#each socialLinks as link}
            <a href={link.url} class="social-button" aria-label={link.name}>
              {#if link.icon === 'file-text'}
                <FileText size={20} />
              {:else if link.icon === 'linkedin'}
                <Linkedin size={20} />
              {:else if link.icon === 'github'}
                <Github size={20} />
              {:else if link.icon === 'mail'}
                <Mail size={20} />
              {/if}
            </a>
          {/each}
        </div>
      </div>

      <div class="photo-container">
        <div class="photo">
          <img src={personal.photo} alt={personal.name} />
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 60px;
    background: var(--bg-primary);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 4rem;
    align-items: center;
  }

  .text-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.1;
  }

  .title {
    font-size: 1.5rem;
    color: var(--text-secondary);
    margin: 0;
  }

  .bio {
    font-size: 1.1rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
    max-width: 600px;
  }

  .chat-prompt {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    color: var(--text-secondary);
    margin: 1rem 0;
  }

  .chat-link {
    background: none;
    border: none;
    color: var(--accent-color);
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: transform 0.2s;
  }

  .chat-link:hover {
    transform: translateY(2px);
  }

  .social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.2s;
    background: var(--bg-secondary);
  }

  .social-button:hover {
    background: var(--bg-hover);
    border-color: var(--accent-color);
    color: var(--accent-color);
    transform: translateY(-2px);
  }

  .photo-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .photo {
    width: 300px;
    height: 350px;
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid var(--border-color);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(30%);
  }

  @media (max-width: 768px) {
    .content {
      grid-template-columns: 1fr;
      gap: 2rem;
      text-align: center;
    }

    h1 {
      font-size: 2.5rem;
    }

    .title {
      font-size: 1.2rem;
    }

    .social-links {
      justify-content: center;
    }

    .photo {
      width: 250px;
      height: 300px;
    }

    .photo-container {
      order: -1;
    }
  }
</style>
