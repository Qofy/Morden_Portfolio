<script lang="ts">
  import { authStore } from '$lib/stores';

  $: user = $authStore.user;
</script>

<main class="app-container">
  <slot />
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
  }

  :global(:root.light) {
    --bg-primary: #ffffff;
    --bg-secondary: #f7f9f9;
    --bg-hover: #eff3f4;
    --text-primary-2: #0f1419;
    --text-secondary: #536471;
    --border-color: #eff3f4;
  }

  :global(main) {
    min-height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  .app-container {
    min-height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
  }
</style>
