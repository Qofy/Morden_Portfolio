<script lang="ts">
  import { goto } from '@roxi/routify';
  import { authStore } from '../lib/stores';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin() {
    error = '';
    loading = true;

    const result = await authStore.login(email, password);

    loading = false;

    if (result.success) {
      $goto('/dashboard');
    } else {
      error = result.error || 'Login failed. Please try again.';
    }
  }

  function goToRegister() {
    $goto('/register');
  }

  function goHome() {
    $goto('/');
  }
</script>

<div class="login-container">
  <div class="login-box">
    <h1>Login to Your Portfolio</h1>
    <p class="subtitle">Manage and customize your portfolio</p>

    {#if error}
      <div class="error-message">{error}</div>
    {/if}

    <form on:submit|preventDefault={handleLogin}>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          placeholder="Enter your email"
          required
          disabled={loading}
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Enter your password"
          required
          disabled={loading}
        />
      </div>

      <button type="submit" class="btn-primary" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>

    <div class="links">
      <button class="link-btn" on:click={goToRegister} disabled={loading}>
        Don't have an account? Register
      </button>
      <button class="link-btn" on:click={goHome} disabled={loading}>
        Back to Home
      </button>
    </div>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
    padding: 20px;
  }

  .login-box {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 40px;
    max-width: 420px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  h1 {
    margin: 0 0 8px 0;
    color: var(--text-primary);
    font-size: 28px;
    text-align: center;
  }

  .subtitle {
    margin: 0 0 32px 0;
    color: var(--text-secondary);
    text-align: center;
    font-size: 14px;
  }

  .error-message {
    background: #fee;
    border: 1px solid #fcc;
    color: #c33;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
        color: var(--text-secondary);
    font-weight: 500;
    font-size: 14px;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.3s;
    box-sizing: border-box;
  }

  input:focus {
    outline: none;
    border-color: #667eea;
  }

  input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  .btn-primary {
    width: 100%;
    padding: 14px;
    background: var(--bg-primary);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-top: 8px;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .links {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .link-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    padding: 8px;
    text-align: center;
    transition: color 0.3s;
  }

  .link-btn:hover:not(:disabled) {
    color: var(--text-primary);
    text-decoration: underline;
  }

  .link-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
