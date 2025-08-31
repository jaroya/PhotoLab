import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests/e2e',
	use: {
		baseURL: 'http://localhost:4173'
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...{ browserName: 'chromium' },
				hasTouch: true
			}
		},
		{
			name: 'firefox',
			use: {
				...{ browserName: 'firefox' },
				hasTouch: true
			}
		},
		{
			name: 'webkit',
			use: {
				...{ browserName: 'webkit' },
				hasTouch: true
			}
		}
	]
});
