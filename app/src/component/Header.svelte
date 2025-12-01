<script lang="ts">
  import { Sun, Moon, Briefcase, LogIn, LogOut } from 'lucide-svelte';
  import { portfolioData } from '../lib/data';
  import { authStore, portfolioStore } from '../lib/stores';

  let navigation = portfolioData.navigation;
  let isDark = true;
  let isAuthenticated = false;

  authStore.subscribe((state) => {
    isAuthenticated = state.isAuthenticated;
  });

  portfolioStore.subscribe((data) => {
    if (data) {
      navigation = data.navigation || portfolioData.navigation;
    }
  });

  function toggleTheme() {
    isDark = !isDark;
    document.documentElement.classList.toggle('light');
  }

  function handleLogout() {
    authStore.logout();
  }
</script>

<header>
  <nav class="container">
    <div class="nav-links">
      {#each navigation as link}
        <a href={link.href}>{link.label}</a>
      {/each}
    </div>

    <div class="nav-actions">
      <button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">
        {#if isDark}
          <Sun size={20} />
        {:else}
          <Moon size={20} />
        {/if}
      </button>

      {#if isAuthenticated}
        <a href="#dashboard" class="dashboard-link" aria-label="Dashboard">
          <Briefcase size={20} />
        </a>
        <button class="logout-btn" on:click={handleLogout} aria-label="Logout">
          <LogOut size={20} />
        </button>
      {:else}
        <a href="#login" class="login-link" aria-label="Login">
          <LogIn size={20} />
        </a>
      {/if}
    </div>
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

  .nav-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .theme-toggle,
  .dashboard-link,
  .login-link,
  .logout-btn {
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
    text-decoration: none;
  }

  .theme-toggle:hover,
  .dashboard-link:hover,
  .login-link:hover,
  .logout-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .logout-btn:hover {
    color: #ff4757;
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
