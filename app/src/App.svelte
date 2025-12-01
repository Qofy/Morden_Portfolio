<script lang="ts">
  import { onMount } from 'svelte';
  import { portfolioData } from './lib/data';
  import { authStore, portfolioStore } from './lib/stores';
  import Header from './component/Header.svelte';
  import Hero from './component/Hero.svelte';
  import WorkExperience from './component/WorkExperience.svelte';
  import Projects from './component/Projects.svelte';
  import Blog from './component/Blog.svelte';
  import Contact from './component/Contact.svelte';
  import ChatBot from './component/ChatBot.svelte';
  import Footer from './pages/Footer.svelte';
  import Login from './pages/Login.svelte';
  import Register from './pages/Register.svelte';
  import Dashboard from './pages/Dashboard.svelte';

  let currentRoute = '';
  let isAuthenticated = false;
  let portfolio: any = null;
  let loading = true;

  // Subscribe to auth state
  authStore.subscribe((state) => {
    isAuthenticated = state.isAuthenticated;
  });

  // Subscribe to portfolio data
  portfolioStore.subscribe((data) => {
    portfolio = data || portfolioData; // Fallback to default data
  });

  // Handle routing and load portfolio
  async function updateRoute() {
    const hash = window.location.hash.slice(1); // Remove '#'
    currentRoute = hash || '';

    // Protected route guard
    if (currentRoute === 'dashboard' && !isAuthenticated) {
      window.location.hash = '#login';
      return;
    }

    // If logged in user tries to access login/register, redirect to dashboard
    if (isAuthenticated && (currentRoute === 'login' || currentRoute === 'register')) {
      window.location.hash = '#dashboard';
      return;
    }

    // Load portfolio if viewing a username (not a special route)
    if (currentRoute && !['login', 'register', 'dashboard'].includes(currentRoute)) {
      await portfolioStore.loadPortfolio(currentRoute);
    } else if (!currentRoute) {
      // On home, use default portfolio
      portfolioStore.set(portfolioData);
    }
  }

  onMount(() => {
    // Set up route listener
    window.addEventListener('hashchange', updateRoute);

    // Initial load
    updateRoute().then(() => {
      loading = false;
    });

    return () => {
      window.removeEventListener('hashchange', updateRoute);
    };
  });
</script>

<main>
  {#if currentRoute === 'login'}
    <Login />
  {:else if currentRoute === 'register'}
    <Register />
  {:else if currentRoute === 'dashboard'}
    <Dashboard />
  {:else}
    <!-- Public Portfolio View -->
    <Header />
    <Hero />
    <WorkExperience />
    <Projects />
    <Blog />
    <Contact />
    <ChatBot />
    <Footer />
  {/if}
</main>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :global(:root) {
    --bg-primary: #0f1419;
    --bg-secondary: #192734;
    --bg-hover: #22303c;
    --text-primary: #e7e9ea;
    --text-secondary: #8b98a5;
    --border-color: #2f3336;
    --text-primary-2: #0f1419;
    --border-color-2: #eff3f4;
    --c-border-secondary: #a5b2be;



    /* --accent-color: #1d9bf0; */
  }

  :global(:root.light) {
    --bg-primary: #ffffff;
    --bg-secondary: #f7f9f9;
    --bg-hover: #eff3f4;
    --text-primary-2: #0f1419;
    --text-secondary: #536471;
    --border-color: #eff3f4;
    /* --accent-color: #1d9bf0; */
  }

  main {
    min-height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
  }
</style>
