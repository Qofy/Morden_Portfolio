import { defineConfig } from 'vitest/config';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [svelte({ preprocess: vitePreprocess() }), tailwindcss()],
  test: {
    environment: 'jsdom',
    include: ['app/tests/**/*.spec.ts', 'app/tests/**/*.test.ts'],
  }
});
