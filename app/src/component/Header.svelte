<script lang="ts">
  import { Sun, Moon, Briefcase } from 'lucide-svelte';
  import { portfolioData } from '../lib/data';

  const { navigation } = portfolioData;

  let isDark = true;

  function toggleTheme() {
    isDark = !isDark;
    document.documentElement.classList.toggle('light');
  }
</script>

<header>
  <nav class="container">
    <div class="nav-links">
      {#each navigation as link}
        <a href={link.href}>{link.label}</a>
      {/each}
    </div>

    <button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">
      {#if isDark}
        <Sun size={20} />
      {:else}
        <Moon size={20} />
      {/if}
    </button>

    <button class="briefcase-icon" aria-label="Portfolio">
      <Briefcase size={20} />
    </button>
  </nav>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    /* background: var(--bg-secondary); */
    background-color: transparent;
    border-bottom: 1px solid var(--border-color);
    z-index: 100;
    backdrop-filter: blur(8px);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    gap: 2rem;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .nav-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
    position: relative;
  }

  .nav-links a:hover {
    color: var(--text-primary);
  }

  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--accent-color);
    transition: width 0.2s;
  }

  .nav-links a:hover::after {
    width: 100%;
  }

  .theme-toggle,
  .briefcase-icon {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .theme-toggle:hover,
  .briefcase-icon:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .nav-links {
      gap: 1rem;
    }

    .container {
      padding: 0 1rem;
    }
  }
</style>
