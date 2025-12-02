<script lang="ts">
  import { onMount } from 'svelte';
  import { portfolioData } from '../lib/data';
  import { portfolioStore } from '../lib/stores';
  import { params } from '@roxi/routify';

  import Header from '../component/Header.svelte';
  import Hero from '../component/Hero.svelte';
  import WorkExperience from '../component/WorkExperience.svelte';
  import Projects from '../component/Projects.svelte';
  import Blog from '../component/Blog.svelte';
  import Contact from '../component/Contact.svelte';
  import ChatBot from '../component/ChatBot.svelte';
  import Footer from './Footer.svelte';

  let portfolio: any = null;
  let loading = true;
  let error = false;

  // Subscribe to portfolio data
  portfolioStore.subscribe((data) => {
    portfolio = data || portfolioData; // Fallback to default data
  });

  onMount(async () => {
    const username = $params.username;

    if (username) {
      try {
        await portfolioStore.loadPortfolio(username);
      } catch (err) {
        error = true;
      }
    }

    loading = false;
  });
</script>

{#if loading}
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>Loading portfolio...</p>
  </div>
{:else if error}
  <div class="error-container">
    <h1>Portfolio Not Found</h1>
    <p>The portfolio for user "{$params.username}" could not be found.</p>
    <a href="/">Go to Home</a>
  </div>
{:else}
  <div class="portfolio-view">
    <Header />
    <Hero />
    <WorkExperience />
    <Projects />
    <Blog />
    <Contact />
    <ChatBot />
    <Footer />
  </div>
{/if}

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 20px;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 20px;
    text-align: center;
    padding: 20px;
  }

  .error-container h1 {
    font-size: 32px;
    color: #333;
  }

  .error-container a {
    padding: 12px 24px;
    background: #667eea;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    transition: transform 0.2s;
  }

  .error-container a:hover {
    transform: translateY(-2px);
  }

  .portfolio-view {
    min-height: 100vh;
  }
</style>
