<script lang="ts">
  import { isActive, url, layout } from '@roxi/routify';
  import { authStore } from '../lib/stores';

  $: user = $authStore.user;
</script>

<div class="app-container">
  <slot />
</div>

<style>
  .app-container {
    min-height: 100vh;
  }
</style>
