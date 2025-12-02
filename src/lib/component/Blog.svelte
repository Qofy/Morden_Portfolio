<script lang="ts">
  import { Calendar } from 'lucide-svelte';
</script>

<section class="blog-section" id="blog">
  <div class="container">
    <h2>Blog</h2>

    <div class="coming-soon">
      <div class="icon-wrapper">
        <Calendar size={64} />
      </div>
      <h3>Coming Soon</h3>
      <p>I'm working on sharing my thoughts and experiences about web development, technology, and software engineering.</p>
      <p class="subtitle">Stay tuned for updates!</p>
    </div>
  </div>
</section>

<style>
  .blog-section {
    padding: 6rem 2rem;
    background: var(--bg-secondary);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  h2 {
    font-size: 2.5rem;
    color: var(--text-primary);
    margin-bottom: 3rem;
    text-align: center;
  }

  .coming-soon {
    text-align: center;
    padding: 4rem 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .icon-wrapper {
    display: inline-flex;
    padding: 2rem;
    background: var(--bg-primary);
    border-radius: 50%;
    margin-bottom: 2rem;
    color: var(--accent-color);
    border: 2px solid var(--border-color);
  }

  h3 {
    font-size: 2rem;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
  }

  p {
    color: var(--text-secondary);
    line-height: 1.8;
    font-size: 1.1rem;
    margin: 0 0 1rem 0;
  }

  .subtitle {
    color: var(--accent-color);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .blog-section {
      padding: 4rem 1rem;
    }

    h2 {
      font-size: 2rem;
    }

    .coming-soon {
      padding: 2rem 1rem;
    }

    h3 {
      font-size: 1.5rem;
    }
  }
</style>
