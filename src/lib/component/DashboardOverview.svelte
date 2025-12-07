<script lang="ts">
import{BriefcaseBusiness, GraduationCap,Code,MonitorCog,Eye, Pencil,Bot, MessageSquare} from "lucide-svelte"

  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { generatePortfolioPDF } from '$lib/pdfGenerator';

  export let user: any;

  let portfolioData: any = null;
  let loading = true;
  let conversationsData: any = null;
  let stats = {
    workExperience: 0,
    education: 0,
    projects: 0,
    skills: 0,
    conversations: 0
  };

  onMount(async () => {
    await Promise.all([fetchPortfolioData(), fetchConversations()]);
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

  async function fetchConversations() {
    try {
      const response = await fetch(`http://localhost:3500/api/conversations?userId=${user.id}`);
      if (response.ok) {
        conversationsData = await response.json();
        stats.conversations = conversationsData.totalConversations || 0;
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  }

  function calculateStats() {
    if (portfolioData) {
      // Calculate total skills from all categories dynamically
      let totalSkills = 0;
      if (portfolioData.skills && typeof portfolioData.skills === 'object') {
        totalSkills = Object.values(portfolioData.skills).reduce((sum, skillArray: any) => {
          return sum + (Array.isArray(skillArray) ? skillArray.length : 0);
        }, 0);
      }

      stats = {
        workExperience: portfolioData.workExperience?.length || 0,
        education: portfolioData.education?.length || 0,
        projects: portfolioData.projects?.length || 0,
        skills: totalSkills
      };
    }
  }

  function downloadPDF() {
    // Store that user wants to download PDF
    sessionStorage.setItem('generatePDF', 'true');
    sessionStorage.setItem('pdfUsername', user.username);

    // Navigate to the portfolio page where PDF will be generated
    goto(`/${user.username}`);
  }

  function viewPublicPortfolio() {
    goto(`/${user.username}`);
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

  function isUnknownQuestion(question: string): boolean {
    // Check if the question contains keywords that might indicate missing information
    const unknownKeywords = [
      'don\'t see',
      'not found',
      'missing',
      'couldn\'t find',
      'no information',
      'don\'t have',
      'not mentioned',
      'not specified'
    ];

    const lowerQuestion = question.toLowerCase();
    return unknownKeywords.some(keyword => lowerQuestion.includes(keyword));
  }

  async function addQuestionToPortfolio(question: string) {
    if (!confirm(`Do you want to add information to address this question:\n\n"${question}"\n\nThis will take you to the portfolio editor.`)) {
      return;
    }

    // Store the question for the editor to show
    sessionStorage.setItem('pendingQuestion', question);

    // Navigate to edit tab
    window.dispatchEvent(new CustomEvent('changeTab', { detail: 'edit' }));

    // Show alert in the editor
    setTimeout(() => {
      alert(`Consider adding information to your portfolio to answer:\n\n"${question}"`);
    }, 500);
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

      <div class="stat-card">
        <div class="stat-icon"><MessageSquare/></div>
        <div class="stat-value">{stats.conversations}</div>
        <div class="stat-label">Conversations</div>
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
          <span>{portfolioData?.personal?.email || user.email || "Not set"}</span>
        </div>
      </div>
    </div>

    {#if conversationsData && conversationsData.conversations && conversationsData.conversations.length > 0}
      <div class="conversations-section">
        <h3>Recent Visitor Conversations ({conversationsData.totalConversations})</h3>
        <p class="section-subtitle">See what visitors are asking about your portfolio</p>
        <div class="conversations-list">
          {#each conversationsData.conversations.slice(0, 5) as conversation}
            <div class="conversation-card">
              <div class="conversation-header">
                <div class="conversation-meta">
                  <span class="visitor-id">Visitor #{conversation.visitorId.slice(0, 8)}</span>
                  <span class="conversation-date">{new Date(conversation.createdAt).toLocaleDateString()}</span>
                </div>
                <span class="message-count">{conversation.messages.length} messages</span>
              </div>
              <div class="conversation-preview">
                {#if conversation.messages.length > 0}
                  <div class="message-preview">
                    <strong>First question:</strong> {conversation.messages[0].content.substring(0, 100)}{conversation.messages[0].content.length > 100 ? '...' : ''}
                  </div>
                {/if}
              </div>
              <button class="view-conversation-btn" on:click={() => {
                const conv = conversationsData.conversations.find(c => c.id === conversation.id);
                if (conv) conv.expanded = !conv.expanded;
                conversationsData = conversationsData;
              }}>
                {conversation.expanded ? 'Hide' : 'View'} Full Conversation
              </button>
              {#if conversation.expanded}
                <div class="full-conversation">
                  {#each conversation.messages as message, msgIndex}
                    <div class="message {message.role}">
                      <div class="message-role">{message.role === 'user' ? 'Visitor' : 'AI Assistant'}</div>
                      <div class="message-content">{message.content}</div>
                      <div class="message-time">{new Date(message.timestamp).toLocaleString()}</div>
                      {#if message.role === 'user' && isUnknownQuestion(message.content)}
                        <button
                          class="add-to-portfolio-btn"
                          on:click={() => addQuestionToPortfolio(message.content)}
                        >
                          + Add to Portfolio
                        </button>
                      {/if}
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        <button class="action-card" on:click={viewPublicPortfolio}>
          <span class="action-icon"><Eye/></span>
          <span>View Public Portfolio</span>
        </button>
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

  .conversations-section {
    margin-top: 32px;
    margin-bottom: 32px;
  }

  .section-subtitle {
    margin: -8px 0 16px 0;
    font-size: 14px;
    color: var(--text-secondary);
    opacity: 0.7;
  }

  .conversations-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .conversation-card {
    background: var(--bg-secondary);
    border-radius: 8px;
    padding: 20px;
    transition: transform 0.2s;
  }

  .conversation-card:hover {
    transform: translateY(-2px);
  }

  .conversation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .conversation-meta {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .visitor-id {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 14px;
  }

  .conversation-date {
    font-size: 12px;
    color: var(--text-secondary);
    opacity: 0.7;
  }

  .message-count {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .conversation-preview {
    margin-bottom: 12px;
  }

  .message-preview {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .message-preview strong {
    color: var(--text-primary);
  }

  .view-conversation-btn {
    background: var(--text-secondary);
    color: var(--bg-primary);
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .view-conversation-btn:hover {
    background: var(--text-primary);
    transform: translateY(-1px);
  }

  .full-conversation {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    max-height: 400px;
    overflow-y: auto;
  }

  .message {
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.03);
  }

  .message.user {
    background: rgba(102, 126, 234, 0.1);
    border-left: 3px solid #667eea;
  }

  .message.assistant {
    background: rgba(76, 175, 80, 0.1);
    border-left: 3px solid #4caf50;
  }

  .message-role {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .message-content {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 6px;
    white-space: pre-wrap;
  }

  .message-time {
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.6;
  }

  .add-to-portfolio-btn {
    margin-top: 8px;
    padding: 6px 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .add-to-portfolio-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

    .conversation-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
</style>
