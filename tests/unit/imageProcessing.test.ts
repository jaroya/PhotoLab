import { describe, it, expect, beforeEach } from 'vitest';
import { applyPresetFilter, loadImage } from '$lib/utils/imageProcessing';

describe('Image Processing Utilities', () => {
	describe('applyPresetFilter', () => {
		let testData: Uint8ClampedArray;

		beforeEach(() => {
			// Create test image data: 2x2 pixels, RGBA format
			// Pixel 1: Red (255,0,0,255)
			// Pixel 2: Green (0,255,0,255)
			// Pixel 3: Blue (0,0,255,255)
			// Pixel 4: White (255,255,255,255)
			testData = new Uint8ClampedArray([
				255,
				0,
				0,
				255, // Red pixel
				0,
				255,
				0,
				255, // Green pixel
				0,
				0,
				255,
				255, // Blue pixel
				255,
				255,
				255,
				255 // White pixel
			]);
		});

		it('should convert image to grayscale', () => {
			const data = new Uint8ClampedArray(testData);
			applyPresetFilter(data, 'grayscale');

			// Check first pixel (was red)
			// Grayscale value should be 0.299 * 255 = 76.245
			expect(Math.round(data[0])).toBe(76);
			expect(Math.round(data[1])).toBe(76);
			expect(Math.round(data[2])).toBe(76);
			expect(data[3]).toBe(255); // Alpha unchanged
		});

		it('should apply sepia filter correctly', () => {
			const data = new Uint8ClampedArray(testData);
			applyPresetFilter(data, 'sepia');

			// Check first pixel (was red)
			// Sepia red: 255 * 0.393 = 100.215
			expect(data[0]).toBe(100);
			// Alpha should remain unchanged
			expect(data[3]).toBe(255);
		});

		it('should invert colors correctly', () => {
			const data = new Uint8ClampedArray(testData);
			applyPresetFilter(data, 'invert');

			// First pixel (was red: 255,0,0)
			expect(data[0]).toBe(0); // 255 - 255
			expect(data[1]).toBe(255); // 255 - 0
			expect(data[2]).toBe(255); // 255 - 0

			// Last pixel (was white: 255,255,255)
			expect(data[12]).toBe(0); // 255 - 255
			expect(data[13]).toBe(0); // 255 - 255
			expect(data[14]).toBe(0); // 255 - 255
		});

		it('should apply vintage filter with warm tones', () => {
			const data = new Uint8ClampedArray(testData);
			applyPresetFilter(data, 'vintage');

			// Vintage applies sepia with modifications
			// Should create warm, reduced contrast look
			const firstPixelRed = data[0];
			const firstPixelBlue = data[2];

			// Red channel should be enhanced
			expect(firstPixelRed).toBeGreaterThan(0);
			// Blue channel should be reduced
			expect(firstPixelBlue).toBeLessThan(firstPixelRed);
		});

		it('should apply cool filter with blue tint', () => {
			const data = new Uint8ClampedArray(testData);
			applyPresetFilter(data, 'cool');

			// For white pixel (index 12-14)
			const whiteRed = data[12];
			const whiteBlue = data[14];

			// Cool filter enhances blue and reduces red
			expect(whiteBlue).toBeGreaterThan(whiteRed);
		});

		it('should apply warm filter with orange tint', () => {
			const data = new Uint8ClampedArray(testData);
			applyPresetFilter(data, 'warm');

			// For white pixel (index 12-14)
			const whiteRed = data[12];
			const whiteBlue = data[14];

			// Warm filter enhances red and reduces blue
			expect(whiteRed).toBeGreaterThan(whiteBlue);
		});

		it('should apply dramatic filter with high contrast', () => {
			// Use a mid-tone color that will show more change
			const testDataMidTone = new Uint8ClampedArray([
				128,
				64,
				32,
				255 // Mid-tone brownish color
			]);
			applyPresetFilter(testDataMidTone, 'dramatic');

			// Dramatic filter increases contrast and desaturates
			// For a mid-tone pixel, the filter should modify the values
			expect(testDataMidTone[0]).not.toBe(128);
		});

		it('should apply noir filter as high-contrast black and white', () => {
			const data = new Uint8ClampedArray(testData);
			applyPresetFilter(data, 'noir');

			// Noir should convert to grayscale with high contrast
			// All color channels should be equal for each pixel
			expect(data[0]).toBe(data[1]);
			expect(data[1]).toBe(data[2]);
		});

		it('should handle all 16 filters without errors', () => {
			const filters = [
				'grayscale',
				'sepia',
				'invert',
				'vintage',
				'cool',
				'warm',
				'dramatic',
				'soft',
				'vivid',
				'noir',
				'sunset',
				'arctic',
				'emerald',
				'rose',
				'cyberpunk'
			] as const;

			filters.forEach((filter) => {
				const data = new Uint8ClampedArray(testData);
				expect(() => applyPresetFilter(data, filter)).not.toThrow();
			});
		});
	});

	describe('loadImage', () => {
		it('should load an image from a File object', async () => {
			// Create a mock File object with image data
			const canvas = document.createElement('canvas');
			canvas.width = 10;
			canvas.height = 10;
			const ctx = canvas.getContext('2d')!;
			ctx.fillStyle = 'red';
			ctx.fillRect(0, 0, 10, 10);

			// Convert canvas to blob and then to File
			const blob = await new Promise<Blob>((resolve) => {
				canvas.toBlob((blob) => resolve(blob!), 'image/png');
			});
			const file = new File([blob], 'test.png', { type: 'image/png' });

			// Load the image
			const img = await loadImage(file);

			// In our test environment, we use a mock Image class
			// Check the properties we care about instead of instanceof
			expect(img).toHaveProperty('src');
			expect(img).toHaveProperty('width');
			expect(img).toHaveProperty('height');
			expect(img.src).toBe('data:image/png;base64,test'); // Our mock returns this
		});

		it('should reject on invalid file', async () => {
			// Mock Image to simulate error for non-image files
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const OriginalImage = (globalThis as any).Image;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(globalThis as any).Image = class {
				width = 0;
				height = 0;
				src = '';
				onerror: (() => void) | null = null;

				constructor() {
					setTimeout(() => {
						// Simulate error for invalid files
						this.onerror?.();
					}, 0);
				}
			};

			const invalidFile = new File(['invalid data'], 'test.txt', { type: 'text/plain' });

			// This should reject when the image fails to load
			await expect(loadImage(invalidFile)).rejects.toThrow();

			// Restore original mock
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(globalThis as any).Image = OriginalImage;
		});
	});
});
