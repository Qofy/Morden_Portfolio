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

  // Subscribe to portfolio data
  portfolioStore.subscribe((data) => {
    portfolio = data || portfolioData; // Fallback to default data
  });

  onMount(async () => {
    // Check if there's a username parameter
    const username = $params.username;

    if (username) {
      // Load specific user's portfolio
      await portfolioStore.loadPortfolio(username);
    } else {
      // Load default/current user's portfolio
      loading = false;
    }

    loading = false;
  });
</script>

{#if loading}
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>Loading portfolio...</p>
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

  .portfolio-view {
    min-height: 100vh;
  }
</style>
