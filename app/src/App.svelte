<script lang="ts">
  import Header from './component/Header.svelte';
  import Hero from './component/Hero.svelte';
  import WorkExperience from './component/WorkExperience.svelte';
  import ChatBot from './component/ChatBot.svelte';
  import Footer from './pages/Footer.svelte';
</script>

<main>
  <Header />
  <Hero />
  <WorkExperience />
  <ChatBot />
  <Footer />
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
    --accent-color: #1d9bf0;
  }

  :global(:root.light) {
    --bg-primary: #ffffff;
    --bg-secondary: #f7f9f9;
    --bg-hover: #eff3f4;
    --text-primary: #0f1419;
    --text-secondary: #536471;
    --border-color: #eff3f4;
    --accent-color: #1d9bf0;
  }

  main {
    min-height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
  }
</style>
