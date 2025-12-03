<script lang="ts">
  import { onMount } from 'svelte';
  import { portfolioData } from '$lib/data';
  import { portfolioStore } from '$lib/stores';

  import Header from '$lib/component/Header.svelte';
  import Hero from '$lib/component/Hero.svelte';
  import WorkExperience from '$lib/component/WorkExperience.svelte';
  import Projects from '$lib/component/Projects.svelte';
  import Blog from '$lib/component/Blog.svelte';
  import Contact from '$lib/component/Contact.svelte';
  import ChatBot from '$lib/component/ChatBot.svelte';
  import Footer from './Footer.svelte';

  let portfolio: any = null;
  let loading = true;

  // Subscribe to portfolio data
  portfolioStore.subscribe((data) => {
    portfolio = data || portfolioData; // Fallback to default data
  });

  onMount(async () => {
    // Load default portfolio for homepage
    portfolioStore.set(portfolioData);
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
