import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom'
	},
	server: {
		host: true
	},
	resolve: {
		alias: {
			'$lib': fileURLToPath(new URL('./src/lib', import.meta.url))
		}
	}
});
