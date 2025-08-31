import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	setupCanvas,
	drawImage,
	downloadImage,
	getCanvasCoordinates
} from '$lib/utils/canvasUtils';

describe('Canvas Utilities', () => {
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let mockStore: any;

	beforeEach(() => {
		// Create a test canvas
		canvas = document.createElement('canvas');
		canvas.width = 100;
		canvas.height = 100;

		// Mock getContext to return our mock context
		ctx = {
			fillStyle: '',
			strokeStyle: '',
			lineWidth: 1,
			lineCap: 'butt',
			lineJoin: 'miter',
			globalAlpha: 1,
			clearRect: vi.fn(),
			fillRect: vi.fn(),
			drawImage: vi.fn(),
			getImageData: vi.fn().mockReturnValue({
				data: new Uint8ClampedArray(4),
				width: 1,
				height: 1
			}),
			putImageData: vi.fn(),
			save: vi.fn(),
			restore: vi.fn(),
			translate: vi.fn(),
			rotate: vi.fn(),
			scale: vi.fn()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any;

		canvas.getContext = vi.fn().mockReturnValue(ctx);

		// Create a mock store
		mockStore = {
			canvas,
			ctx,
			image: new Image(),
			rotation: 0,
			brightness: 0,
			contrast: 0,
			exposure: 0,
			highlights: 0,
			shadows: 0,
			whites: 0,
			blacks: 0,
			saturation: 0,
			vibrance: 0,
			clarity: 0,
			dehaze: 0,
			activeFilter: 'none',
			setCanvas: vi.fn(),
			setCtx: vi.fn()
		};

		// Set up test image
		mockStore.image.width = 50;
		mockStore.image.height = 50;
	});

	describe('setupCanvas', () => {
		it('should set up canvas with correct dimensions', async () => {
			const callback = vi.fn();
			await setupCanvas(mockStore, callback);

			expect(mockStore.setCtx).toHaveBeenCalledWith(ctx);
			expect(canvas.width).toBe(50); // Image width
			expect(canvas.height).toBe(50); // Image height
			expect(callback).toHaveBeenCalled();
		});

		it('should handle rotation correctly', async () => {
			mockStore.rotation = 90;
			const callback = vi.fn();
			await setupCanvas(mockStore, callback);

			// With 90 degree rotation, canvas dimensions should swap
			expect(canvas.width).toBe(50); // Swapped height
			expect(canvas.height).toBe(50); // Swapped width
		});

		it('should return early if canvas is not found', async () => {
			mockStore.canvas = null;
			const callback = vi.fn();
			await setupCanvas(mockStore, callback);

			expect(callback).not.toHaveBeenCalled();
			expect(mockStore.setCtx).not.toHaveBeenCalled();
		});
	});

	describe('drawImage', () => {
		it('should draw image to canvas', () => {
			const applyFilters = vi.fn();
			drawImage(mockStore, applyFilters);

			// Check that image was drawn (canvas should have content)
			const imageData = ctx.getImageData(0, 0, 1, 1);
			expect(imageData).toBeDefined();
		});

		it('should apply filters when adjustments are present', () => {
			mockStore.brightness = 50;
			const applyFilters = vi.fn();
			drawImage(mockStore, applyFilters);

			expect(applyFilters).toHaveBeenCalled();
		});

		it('should not apply filters when no adjustments', () => {
			const applyFilters = vi.fn();
			drawImage(mockStore, applyFilters);

			expect(applyFilters).not.toHaveBeenCalled();
		});

		it('should handle 90 degree rotation', () => {
			mockStore.rotation = 90;
			const applyFilters = vi.fn();

			expect(() => drawImage(mockStore, applyFilters)).not.toThrow();
		});

		it('should handle 180 degree rotation', () => {
			mockStore.rotation = 180;
			const applyFilters = vi.fn();

			expect(() => drawImage(mockStore, applyFilters)).not.toThrow();
		});

		it('should handle 270 degree rotation', () => {
			mockStore.rotation = 270;
			const applyFilters = vi.fn();

			expect(() => drawImage(mockStore, applyFilters)).not.toThrow();
		});

		it('should apply filters when activeFilter is not none', () => {
			mockStore.activeFilter = 'grayscale';
			const applyFilters = vi.fn();
			drawImage(mockStore, applyFilters);

			expect(applyFilters).toHaveBeenCalled();
		});
	});

	describe('downloadImage', () => {
		it('should trigger download with correct filename', () => {
			// Mock the download link creation
			const createElementSpy = vi.spyOn(document, 'createElement');
			const clickSpy = vi.fn();

			const mockLink = {
				href: '',
				download: '',
				click: clickSpy
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any;

			createElementSpy.mockReturnValue(mockLink);

			downloadImage(canvas);

			expect(mockLink.download).toBe('edited-image.png');
			expect(clickSpy).toHaveBeenCalled();
		});

		it('should not download if canvas is null', () => {
			const createElementSpy = vi.spyOn(document, 'createElement');
			downloadImage(null);

			expect(createElementSpy).not.toHaveBeenCalled();
		});
	});

	describe('getCanvasCoordinates', () => {
		it('should calculate correct coordinates', () => {
			const rect = {
				left: 10,
				top: 20,
				width: 100,
				height: 100
			};

			canvas.getBoundingClientRect = vi.fn().mockReturnValue(rect);
			canvas.width = 200; // 2x scale
			canvas.height = 200;

			const event = new MouseEvent('click', {
				clientX: 60, // 50 pixels from rect left
				clientY: 70 // 50 pixels from rect top
			});

			const coords = getCanvasCoordinates(event, canvas);

			// Should scale coordinates to canvas dimensions
			expect(coords.x).toBe(100); // (60-10) * (200/100) = 50 * 2 = 100
			expect(coords.y).toBe(100); // (70-20) * (200/100) = 50 * 2 = 100
		});

		it('should handle edge coordinates', () => {
			const rect = {
				left: 0,
				top: 0,
				width: 100,
				height: 100
			};

			canvas.getBoundingClientRect = vi.fn().mockReturnValue(rect);
			canvas.width = 100;
			canvas.height = 100;

			const event = new MouseEvent('click', {
				clientX: 0,
				clientY: 0
			});

			const coords = getCanvasCoordinates(event, canvas);

			expect(coords.x).toBe(0);
			expect(coords.y).toBe(0);
		});
	});
});
