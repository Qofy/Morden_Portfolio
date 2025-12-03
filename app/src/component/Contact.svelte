<script lang="ts">
  import { Mail, Github, Linkedin, MapPin } from 'lucide-svelte';
  import { portfolioData } from '../lib/data';
  import { portfolioStore } from '../lib/stores';

  let personal = portfolioData.personal;
  let socialLinks = portfolioData.socialLinks;

  portfolioStore.subscribe((data) => {
    if (data) {
      personal = data.personal || portfolioData.personal;
      socialLinks = data.socialLinks || portfolioData.socialLinks;
    }
  });

  $: contactInfo = [
    { icon: Mail, label: 'Email', value: personal.email || 'safokofi888@gmail.com', href: `mailto:${personal.email || 'safokofi888@gmail.com'}` },
    { icon: MapPin, label: 'Location', value: personal.location, href: null },
  ];

  // Get social links dynamically
  $: githubLink = socialLinks.find((link: any) => link.name === 'GitHub')?.url || 'https://github.com/Qofy';
  $: linkedinLink = socialLinks.find((link: any) => link.name === 'LinkedIn')?.url || 'https://www.linkedin.com/in/kofi-agyekum-870569298/';
  $: emailLink = `mailto:${personal.email || 'safokofi888@gmail.com'}`;
</script>

<section class="contact-section" id="contact">
  <div class="container">
    <h2>Get In Touch</h2>

    <div class="contact-content">
      <div class="contact-intro">
        <p class="intro-text">
          I'm currently open to new opportunities and collaborations. Whether you have a question,
          want to discuss a project, or just want to say hi, feel free to reach out!
        </p>
      </div>

      <div class="contact-methods">
        {#each contactInfo as contact}
          <div class="contact-item">
            <div class="contact-icon">
              <svelte:component this={contact.icon} size={24} />
            </div>
            <div class="contact-details">
              <span class="contact-label">{contact.label}</span>
              {#if contact.href}
                <a href={contact.href} class="contact-value">{contact.value}</a>
              {:else}
                <span class="contact-value">{contact.value}</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <div class="social-links">
        <h3>Connect with me</h3>
        <div class="links-grid">
          <a href={githubLink} target="_blank" rel="noopener noreferrer" class="social-link">
            <Github size={24} />
            <span>GitHub</span>
          </a>
          <a href={linkedinLink} target="_blank" rel="noopener noreferrer" class="social-link">
            <Linkedin size={24} />
            <span>LinkedIn</span>
          </a>
          <a href={emailLink} class="social-link">
            <Mail size={24} />
            <span>Email</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .contact-section {
    padding: 6rem 2rem;
    background: var(--bg-primary);
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  h2 {
    font-size: 2.5rem;
    color: var(--text-primary);
    margin-bottom: 3rem;
    text-align: center;
  }

  .contact-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .intro-text {
    font-size: 1.2rem;
    line-height: 1.8;
    color: var(--text-secondary);
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
  }

  .contact-methods {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem;
    background: var(--bg-primary);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    transition: transform 0.2s;
  }

  .contact-item:hover {
    transform: translateX(8px);
  }

  .contact-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: var(--bg-hover);
    border-radius: 50%;
    color: var(--accent-color);
    flex-shrink: 0;
  }

  .contact-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .contact-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  .contact-value {
    font-size: 1.1rem;
    color: var(--text-primary);
    text-decoration: none;
    transition: color 0.2s;
  }

  a.contact-value:hover {
    color: var(--accent-color);
  }

  .social-links {
    text-align: center;
  }

  h3 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin: 0 0 1.5rem 0;
  }

  .links-grid {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: var(--bg-secondary);
    color: var(--text-primary);
    text-decoration: none;
    border-radius: 10px;
    border: 1px solid var(--border-color);
    font-weight: 500;
    transition: all 0.3s;
  }

  .social-link:hover {
    background: var(--bg-hover);
    border-color: var(--accent-color);
    color: var(--accent-color);
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(29, 155, 240, 0.2);
  }

  @media (max-width: 768px) {
    .contact-section {
      padding: 4rem 1rem;
    }

    h2 {
      font-size: 2rem;
    }

    .intro-text {
      font-size: 1.1rem;
    }

    .contact-methods {
      padding: 1.5rem;
    }

    .contact-item {
      flex-direction: column;
      text-align: center;
    }

    .contact-item:hover {
      transform: translateY(-4px);
    }

    .links-grid {
      flex-direction: column;
    }

    .social-link {
      justify-content: center;
    }
  }
</style>
