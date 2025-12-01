<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '../lib/stores';
  import PortfolioEditor from '../component/PortfolioEditor.svelte';
  import OllamaInterview from '../component/OllamaInterview.svelte';
  import DashboardOverview from '../component/DashboardOverview.svelte';

  let activeTab: 'overview' | 'edit' | 'interview' = 'overview';
  let user: any = null;

  authStore.subscribe((state) => {
    user = state.user;
  });

  onMount(() => {
    // Check if user is authenticated
    if (!user) {
      window.location.hash = '#login';
    }
  });

  function handleLogout() {
    authStore.logout();
  }

  function goHome() {
    window.location.hash = '';
  }
</script>

{#if user}
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>Portfolio Dashboard</h1>
        <p class="welcome">Welcome back, {user.username}!</p>
      </div>
      <div class="header-actions">
        <button class="btn-secondary" on:click={goHome}>
          View Portfolio
        </button>
        <button class="btn-logout" on:click={handleLogout}>
          Logout
        </button>
      </div>
    </header>

    <div class="dashboard-content">
      <nav class="tabs">
        <button
          class="tab"
          class:active={activeTab === 'overview'}
          on:click={() => (activeTab = 'overview')}
        >
          Overview
        </button>
        <button
          class="tab"
          class:active={activeTab === 'edit'}
          on:click={() => (activeTab = 'edit')}
        >
          Edit Portfolio
        </button>
        <button
          class="tab"
          class:active={activeTab === 'interview'}
          on:click={() => (activeTab = 'interview')}
        >
          AI Interview
        </button>
      </nav>

      <div class="tab-content">
        {#if activeTab === 'overview'}
          <DashboardOverview {user} />
        {:else if activeTab === 'edit'}
          <PortfolioEditor {user} />
        {:else if activeTab === 'interview'}
          <OllamaInterview {user} />
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .dashboard {
    min-height: 100vh;
    background: #f5f7fa;
  }

  .dashboard-header {
    background: white;
    border-bottom: 1px solid #e1e4e8;
    padding: 24px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  }

  .header-content h1 {
    margin: 0;
    font-size: 24px;
    color: #333;
  }

  .welcome {
    margin: 4px 0 0 0;
    color: #666;
    font-size: 14px;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }

  .btn-secondary {
    padding: 10px 20px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    color: #333;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-secondary:hover {
    border-color: #667eea;
    color: #667eea;
  }

  .btn-logout {
    padding: 10px 20px;
    background: #ff4757;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-logout:hover {
    background: #ee3d4d;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
  }

  .dashboard-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 40px;
  }

  .tabs {
    display: flex;
    gap: 8px;
    background: white;
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  }

  .tab {
    flex: 1;
    padding: 12px 24px;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: #666;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
  }

  .tab:hover {
    background: #f5f7fa;
    color: #333;
  }

  .tab.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .tab-content {
    background: white;
    border-radius: 8px;
    padding: 32px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    min-height: 500px;
  }

  @media (max-width: 768px) {
    .dashboard-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .dashboard-content {
      padding: 24px 20px;
    }

    .tabs {
      flex-direction: column;
    }

    .tab-content {
      padding: 20px;
    }
  }
</style>
