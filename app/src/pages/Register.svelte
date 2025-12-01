<script lang="ts">
  import { authStore } from '../lib/stores';

  let username = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
  let success = false;
  let loading = false;

  async function handleRegister() {
    error = '';

    // Validation
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters';
      return;
    }

    if (username.length < 3) {
      error = 'Username must be at least 3 characters';
      return;
    }

    loading = true;

    const result = await authStore.register(username, email, password);

    loading = false;

    if (result.success) {
      success = true;
      setTimeout(() => {
        window.location.hash = '#login';
      }, 2000);
    } else {
      error = result.error || 'Registration failed. Please try again.';
    }
  }

  function goToLogin() {
    window.location.hash = '#login';
  }

  function goHome() {
    window.location.hash = '';
  }
</script>

<div class="register-container">
  <div class="register-box">
    <h1>Create Your Portfolio</h1>
    <p class="subtitle">Join and showcase your work</p>

    {#if success}
      <div class="success-message">
        Account created successfully! Redirecting to login...
      </div>
    {:else if error}
      <div class="error-message">{error}</div>
    {/if}

    <form on:submit|preventDefault={handleRegister}>
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          bind:value={username}
          placeholder="Choose a username"
          required
          disabled={loading || success}
        />
        <small>This will be your portfolio URL</small>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          placeholder="Enter your email"
          required
          disabled={loading || success}
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Create a password (min 6 characters)"
          required
          disabled={loading || success}
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          bind:value={confirmPassword}
          placeholder="Confirm your password"
          required
          disabled={loading || success}
        />
      </div>

      <button type="submit" class="btn-primary" disabled={loading || success}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>

    <div class="links">
      <button class="link-btn" on:click={goToLogin} disabled={loading}>
        Already have an account? Login
      </button>
      <button class="link-btn" on:click={goHome} disabled={loading}>
        Back to Home
      </button>
    </div>
  </div>
</div>

<style>
  .register-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
  }

  .register-box {
    background: white;
    border-radius: 12px;
    padding: 40px;
    max-width: 420px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  h1 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 28px;
    text-align: center;
  }

  .subtitle {
    margin: 0 0 32px 0;
    color: #666;
    text-align: center;
    font-size: 14px;
  }

  .error-message, .success-message {
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .error-message {
    background: #fee;
    border: 1px solid #fcc;
    color: #c33;
  }

  .success-message {
    background: #efe;
    border: 1px solid #cfc;
    color: #3c3;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    color: #333;
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

  small {
    display: block;
    margin-top: 4px;
    color: #999;
    font-size: 12px;
  }

  .btn-primary {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    color: #667eea;
    font-size: 14px;
    cursor: pointer;
    padding: 8px;
    text-align: center;
    transition: color 0.3s;
  }

  .link-btn:hover:not(:disabled) {
    color: #764ba2;
    text-decoration: underline;
  }

  .link-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
