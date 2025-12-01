<script lang="ts">
import{BriefcaseBusiness, GraduationCap,Code,MonitorCog,Eye, Pencil,Bot} from "lucide-svelte"

  import { onMount } from 'svelte';

  export let user: any;

  let portfolioData: any = null;
  let loading = true;
  let stats = {
    workExperience: 0,
    education: 0,
    projects: 0,
    skills: 0
  };

  onMount(async () => {
    await fetchPortfolioData();
  });

  async function fetchPortfolioData() {
    try {
      const response = await fetch(`http://localhost:3500/api/portfolio/${user.username}`);
      if (response.ok) {
        portfolioData = await response.json();
        calculateStats();
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      loading = false;
    }
  }

  function calculateStats() {
    if (portfolioData) {
      stats = {
        workExperience: portfolioData.workExperience?.length || 0,
        education: portfolioData.education?.length || 0,
        projects: portfolioData.projects?.length || 0,
        skills: portfolioData.skills ?
          (portfolioData.skills.frontend?.length || 0) +
          (portfolioData.skills.backend?.length || 0) +
          (portfolioData.skills.tools?.length || 0) +
          (portfolioData.skills.other?.length || 0) : 0
      };
    }
  }

  async function downloadPDF() {
    // For now, we'll open the portfolio in a new window and let the user print to PDF
    // In a production app, you'd use a library like jsPDF or html2pdf
    const url = `${window.location.origin}/#${user.username}`;
    window.open(url, '_blank');

    // Show instructions
    alert('To download as PDF:\n1. Click Print (Ctrl/Cmd+P)\n2. Select "Save as PDF" as the destination\n3. Click Save\n\nFuture versions will have direct PDF export!');
  }

  function getCompletionPercentage(): number {
    if (!portfolioData) return 0;

    let completed = 0;
    let total = 8;

    if (portfolioData.personal?.name) completed++;
    if (portfolioData.personal?.title) completed++;
    if (portfolioData.personal?.bio) completed++;
    if (portfolioData.personal?.photo) completed++;
    if (stats.workExperience > 0) completed++;
    if (stats.education > 0) completed++;
    if (stats.projects > 0) completed++;
    if (stats.skills > 0) completed++;

    return Math.round((completed / total) * 100);
  }
</script>

<div class="overview">
  <div class="overview-header">
    <h2>Portfolio Overview</h2>
    <button class="btn-download" on:click={downloadPDF} disabled={loading}>
      Download as PDF
    </button>
  </div>

  {#if loading}
    <div class="loading">Loading your portfolio data...</div>
  {:else if portfolioData}
    <div class="completion-card">
      <h3>Profile Completion</h3>
      <div class="progress-bar">
        <div class="progress-fill" style="width: {getCompletionPercentage()}%"></div>
      </div>
      <p class="completion-text">{getCompletionPercentage()}% Complete</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><BriefcaseBusiness/></div>
        <div class="stat-value">{stats.workExperience}</div>
        <div class="stat-label">Work Experiences</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"><GraduationCap/></div>
        <div class="stat-value">{stats.education}</div>
        <div class="stat-label">Education Entries</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"><Code/></div>
        <div class="stat-value">{stats.projects}</div>
        <div class="stat-label">Projects</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"><MonitorCog/></div>
        <div class="stat-value">{stats.skills}</div>
        <div class="stat-label">Skills</div>
      </div>
    </div>

    <div class="info-section">
      <h3>Personal Information</h3>
      <div class="info-grid">
        <div class="info-item">
          <label>Name:</label>
          <span>{portfolioData.personal?.name || 'Not set'}</span>
        </div>
        <div class="info-item">
          <label>Title:</label>
          <span>{portfolioData.personal?.title || 'Not set'}</span>
        </div>
        <div class="info-item">
          <label>Location:</label>
          <span>{portfolioData.personal?.location || 'Not set'}</span>
        </div>
        <div class="info-item">
          <label>Email:</label>
          <span>{user.email}</span>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        <a href="#{user.username}" class="action-card">
          <span class="action-icon"><Eye/></span>
          <span>View Public Portfolio</span>
        </a>
        <button class="action-card" on:click={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'edit' }))}>
          <span class="action-icon"><Pencil/></span>
          <span>Edit Portfolio</span>
        </button>
        <button class="action-card" on:click={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'interview' }))}>
          <span class="action-icon"><Bot/></span>
          <span>Start AI Interview</span>
        </button>
      </div>
    </div>
  {:else}
    <div class="error">Failed to load portfolio data. Please try refreshing the page.</div>
  {/if}
</div>

<style>
  .overview {
    max-width: 900px;
  }

  .overview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }

  h2 {
    margin: 0;
    font-size: 24px;
    color: #fff;
  }

  h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
    color: var(--text-primary);
  }

  .btn-download {
    padding: 12px 24px;
    background: var(--text-secondary);
    color: var(--text-primary);
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .btn-download:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .btn-download:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .loading, .error {
    padding: 40px;
    text-align: center;
    color: #666;
  }

  .error {
    color: #c33;
  }

  .completion-card {
    background: var(--bg-secondary);
    color: white;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 24px;
  }

  .progress-bar {
    background: rgba(255, 255, 255, 0.3);
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    margin: 16px 0 8px 0;
  }

  .progress-fill {
    background: white;
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s;
  }

  .completion-text {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: var(--bg-secondary);
    padding: 24px;
    border-radius: 8px;
    text-align: center;
    transition: transform 0.2s;
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-card:hover {
    transform: translateY(-4px);
  }

  .stat-icon {
    font-size: 32px;
    /* margin-bottom: 8px; */
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--border-color);
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-section {
    margin-bottom: 32px;
  }

  .info-grid {
    display: grid;
    gap: 16px;
  }

  .info-item {
    display: flex;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 6px;
  }

  .info-item label {
    font-weight: 600;
    color: var(--text-secondary);
    min-width: 120px;
  }

  .info-item span {
    color: #fff;
  }

  .quick-actions {
    margin-top: 32px;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }

  .action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px;
    background: var(--bg-secondary);
    border: 2px solid transparent;
    border-radius: 8px;
    text-decoration: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s;
  }

  .action-card:hover {
    border-color: var(--bg-secondary);
    background: var(--bg-secondary);
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .action-icon {
    font-size: 32px;
    color: #fff;
  }

  @media (max-width: 768px) {
    .overview-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
