<script lang="ts">
  import { Calendar, Clock } from 'lucide-svelte';
  import { portfolioData } from '$lib/data';
  import { portfolioStore } from '$lib/stores';

  let blogPosts: any[] = [];

  portfolioStore.subscribe((data) => {
    if (data && data.blogPosts) {
      blogPosts = data.blogPosts;
    }
  });
</script>

<section class="blog-section" id="blog">
  <div class="container">
    <h2>Blog</h2>

    {#if blogPosts && blogPosts.length > 0}
      <div class="blog-grid">
        {#each blogPosts as post}
          <article class="blog-card">
            {#if post.coverImage}
              <div class="blog-image">
                <img src={post.coverImage} alt={post.title} />
              </div>
            {/if}
            <div class="blog-content">
              <div class="blog-meta">
                <span class="meta-item">
                  <Calendar size={16} />
                  {new Date(post.publishedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span class="meta-item">
                  <Clock size={16} />
                  {post.readingTime} min read
                </span>
              </div>
              <h3 class="blog-title">{post.title}</h3>
              <p class="blog-excerpt">{post.excerpt}</p>
              {#if post.tags && post.tags.length > 0}
                <div class="blog-tags">
                  {#each post.tags as tag}
                    <span class="tag">{tag}</span>
                  {/each}
                </div>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    {:else}
      <div class="coming-soon">
        <div class="icon-wrapper">
          <Calendar size={64} />
        </div>
        <h3>Coming Soon</h3>
        <p>I'm working on sharing my thoughts and experiences about web development, technology, and software engineering.</p>
        <p class="subtitle">Stay tuned for updates!</p>
      </div>
    {/if}
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

  .blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }

  .blog-card {
    background: var(--bg-primary);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .blog-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }

  .blog-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .blog-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .blog-card:hover .blog-image img {
    transform: scale(1.05);
  }

  .blog-content {
    padding: 1.5rem;
  }

  .blog-meta {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .blog-title {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    line-height: 1.3;
  }

  .blog-excerpt {
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0 0 1rem 0;
  }

  .blog-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    padding: 0.25rem 0.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    font-size: 0.75rem;
    color: var(--text-secondary);
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

  .coming-soon h3 {
    font-size: 2rem;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
  }

  .coming-soon p {
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

    .blog-grid {
      grid-template-columns: 1fr;
    }

    .coming-soon {
      padding: 2rem 1rem;
    }

    .coming-soon h3 {
      font-size: 1.5rem;
    }
  }
</style>
