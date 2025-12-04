<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { portfolioData } from '$lib/data';
  import { portfolioStore } from '$lib/stores';
  import { generatePortfolioPDF } from '$lib/pdfGenerator';

  import Header from '$lib/component/Header.svelte';
  import Hero from '$lib/component/Hero.svelte';
  import WorkExperience from '$lib/component/WorkExperience.svelte';
  import Projects from '$lib/component/Projects.svelte';
  import Blog from '$lib/component/Blog.svelte';
  import Contact from '$lib/component/Contact.svelte';
  import ChatBot from '$lib/component/ChatBot.svelte';
  import Footer from '../Footer.svelte';

  let portfolio: any = null;
  let loading = true;
  let error = false;

  // Subscribe to portfolio data
  portfolioStore.subscribe((data) => {
    portfolio = data || portfolioData; // Fallback to default data
  });

  onMount(async () => {
    const username = $page.params.username;

    if (username) {
      try {
        await portfolioStore.loadPortfolio(username);
      } catch (err) {
        error = true;
      }
    }

    loading = false;

    // Check if PDF generation was requested
    const shouldGeneratePDF = sessionStorage.getItem('generatePDF');
    const pdfUsername = sessionStorage.getItem('pdfUsername');

    if (shouldGeneratePDF === 'true' && pdfUsername === username) {
      // Clear the flags
      sessionStorage.removeItem('generatePDF');
      sessionStorage.removeItem('pdfUsername');

      // Show loading message
      const loadingMsg = document.createElement('div');
      loadingMsg.id = 'pdf-loading';
      loadingMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 30px 50px;
        border-radius: 12px;
        z-index: 10000;
        font-size: 18px;
        text-align: center;
      `;
      loadingMsg.innerHTML = `
        <div style="margin-bottom: 10px;">Generating PDF...</div>
        <div style="font-size: 14px; opacity: 0.7;">Please wait a moment</div>
      `;
      document.body.appendChild(loadingMsg);

      // Wait for all content to render, including images
      setTimeout(async () => {
        try {
          await generatePortfolioPDF(username);
          // Success message
          loadingMsg.innerHTML = `
            <div style="color: #4ade80;">✓ PDF Generated Successfully!</div>
          `;
          setTimeout(() => {
            document.body.removeChild(loadingMsg);
          }, 1000);
        } catch (error) {
          console.error('PDF generation failed:', error);
          document.body.removeChild(loadingMsg);
          alert('Failed to generate PDF. Please try using Print (Ctrl/Cmd+P) instead.');
        }
      }, 2500);
    }
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
    <p>The portfolio for user "{$page.params.username}" could not be found.</p>
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
