import { describe, it, expect, vi } from 'vitest';

describe('Firebase Analytics', () => {
	it('should initialize Firebase app configuration', async () => {
		const config = await import('../../src/lib/firebase/config');
		expect(config.app).toBeDefined();
	});

	it('should only initialize analytics in browser environment', async () => {
		vi.mock('$app/environment', () => ({
			browser: false
		}));

		const { analytics } = await import('../../src/lib/firebase/config');
		expect(analytics).toBeNull();
	});
});
