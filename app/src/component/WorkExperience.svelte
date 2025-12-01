<script lang="ts">
  import { portfolioData } from '../lib/data';
  import { portfolioStore } from '../lib/stores';

  let workExperience = portfolioData.workExperience;
  let education = portfolioData.education;
  let activeTab: 'work' | 'education' = 'work';

  portfolioStore.subscribe((data) => {
    if (data) {
      workExperience = data.workExperience || portfolioData.workExperience;
      education = data.education || portfolioData.education;
    }
  });
</script>

<section class="timeline-section" id="experience">
  <div class="container">
    <div class="tabs">
      <button
        class="tab"
        class:active={activeTab === 'work'}
        on:click={() => activeTab = 'work'}
      >
        Work
      </button>
      <button
        class="tab"
        class:active={activeTab === 'education'}
        on:click={() => activeTab = 'education'}
      >
        Education
      </button>
    </div>

    <div class="timeline">
      {#if activeTab === 'work'}
        {#each workExperience as job}
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-dot"></div>
              <div class="marker-line"></div>
            </div>

            <div class="timeline-content">
              <div class="period">{job.period}</div>
              <h3>{job.position}</h3>
              <div class="company-location">
                <span class="company">{job.company}</span>
                {#if job.location}
                  <span class="location">{job.location}</span>
                {/if}
              </div>

              <ul class="description">
                {#each job.description as point}
                  <li>{point}</li>
                {/each}
              </ul>

              <div class="tags">
                {#each job.tags as tag}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
            </div>
          </div>
        {/each}
      {:else}
        {#each education as edu}
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-dot"></div>
              <div class="marker-line"></div>
            </div>

            <div class="timeline-content">
              <div class="period">{edu.period}</div>
              <h3>{edu.degree}</h3>
              <div class="company-location">
                <span class="company">{edu.institution}</span>
                {#if edu.location}
                  <span class="location">{edu.location}</span>
                {/if}
              </div>

              <ul class="description">
                {#each edu.description as point}
                  <li>{point}</li>
                {/each}
              </ul>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</section>

<style>
  .timeline-section {
    padding: 4rem 2rem;
    background: var(--bg-primary);
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  .tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 3rem;
    border-bottom: 2px solid var(--border-color);
  }

  .tab {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.2rem;
    font-weight: 500;
    padding: 1rem 2rem;
    cursor: pointer;
    position: relative;
    transition: color 0.2s;
  }

  .tab.active {
    color: var(--text-primary);
  }

  .tab.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--accent-color);
  }

  .timeline {
    position: relative;
  }

  .timeline-item {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
    position: relative;
  }

  .timeline-item:last-child .marker-line {
    display: none;
  }

  .timeline-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .marker-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent-color);
    border: 3px solid var(--bg-primary);
    position: relative;
    z-index: 2;
    flex-shrink: 0;
  }

  .marker-line {
    width: 2px;
    flex: 1;
    background: var(--border-color);
    margin-top: 8px;
  }

  .timeline-content {
    padding-bottom: 2rem;
  }

  .period {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  h3 {
    font-size: 1.4rem;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
    font-weight: 600;
  }

  .company-location {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .company {
    color: var(--text-secondary);
    font-size: 1rem;
  }

  .location {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .description {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .description li {
    color: var(--text-secondary);
    padding-left: 1.5rem;
    position: relative;
    line-height: 1.6;
  }

  .description li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--accent-color);
    font-weight: bold;
  }

  .tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }

  .tag {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.85rem;
    border: 1px solid var(--border-color);
  }

  @media (max-width: 768px) {
    .timeline-item {
      grid-template-columns: 30px 1fr;
      gap: 1rem;
    }

    h3 {
      font-size: 1.2rem;
    }

    .tabs {
      gap: 0.5rem;
    }

    .tab {
      padding: 0.75rem 1rem;
      font-size: 1rem;
    }
  }
</style>
