<script lang="ts">
  const currentYear = new Date().getFullYear();
</script>

<footer>
  <div class="container">
    <p>&copy; {currentYear} Kofi Safo Agyekum. Built with Svelte & Ollama.</p>
  </div>
</footer>

<style>
  footer {
    padding: 2rem;
    text-align: center;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
</style>
