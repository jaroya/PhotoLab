import { describe, it, expect, beforeEach } from 'vitest';
import { createPhotoEditorStore } from '$lib/stores/photoEditor.svelte';

describe('Photo Editor Store', () => {
	let store: ReturnType<typeof createPhotoEditorStore>;

	beforeEach(() => {
		store = createPhotoEditorStore();
	});

	describe('Initial State', () => {
		it('should initialize with default values', () => {
			expect(store.brightness).toBe(0);
			expect(store.contrast).toBe(0);
			expect(store.rotation).toBe(0);
			expect(store.saturation).toBe(0);
			expect(store.vibrance).toBe(0);
			expect(store.exposure).toBe(0);
			expect(store.highlights).toBe(0);
			expect(store.shadows).toBe(0);
			expect(store.whites).toBe(0);
			expect(store.blacks).toBe(0);
			expect(store.clarity).toBe(0);
			expect(store.dehaze).toBe(0);
			expect(store.activeFilter).toBe('none');
			expect(store.drawingMode).toBe(false);
			expect(store.brushSize).toBe(5);
			expect(store.brushColor).toBe('#ff0000');
			expect(store.showControls).toBe(false);
		});

		it('should have null canvas and context initially', () => {
			expect(store.canvas).toBeNull();
			expect(store.ctx).toBeNull();
			expect(store.image).toBeNull();
		});
	});

	describe('Adjustment Properties', () => {
		it('should update brightness', () => {
			store.brightness = 50;
			expect(store.brightness).toBe(50);
		});

		it('should update contrast', () => {
			store.contrast = -30;
			expect(store.contrast).toBe(-30);
		});

		it('should update exposure', () => {
			store.exposure = 75;
			expect(store.exposure).toBe(75);
		});

		it('should update all adjustment properties', () => {
			const adjustments = {
				brightness: 10,
				contrast: 20,
				rotation: 90,
				saturation: 30,
				vibrance: 40,
				exposure: 50,
				highlights: 60,
				shadows: 70,
				whites: 80,
				blacks: 90,
				clarity: 100,
				dehaze: -50
			};

			Object.entries(adjustments).forEach(([key, value]) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(store as any)[key] = value;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				expect((store as any)[key]).toBe(value);
			});
		});
	});

	describe('Drawing Properties', () => {
		it('should update brush size', () => {
			store.brushSize = 20;
			expect(store.brushSize).toBe(20);
		});

		it('should update brush color', () => {
			store.brushColor = '#00ff00';
			expect(store.brushColor).toBe('#00ff00');
		});

		it('should toggle drawing mode', () => {
			store.setDrawingMode(true);
			expect(store.drawingMode).toBe(true);

			store.setDrawingMode(false);
			expect(store.drawingMode).toBe(false);
		});

		it('should update isDrawing state', () => {
			store.setIsDrawing(true);
			expect(store.isDrawing).toBe(true);

			store.setIsDrawing(false);
			expect(store.isDrawing).toBe(false);
		});
	});

	describe('Filter Management', () => {
		it('should update active filter', () => {
			store.setActiveFilter('grayscale');
			expect(store.activeFilter).toBe('grayscale');

			store.setActiveFilter('sepia');
			expect(store.activeFilter).toBe('sepia');
		});

		it('should accept all filter types', () => {
			const filters = [
				'none',
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
				store.setActiveFilter(filter);
				expect(store.activeFilter).toBe(filter);
			});
		});
	});

	describe('Canvas Management', () => {
		it('should set canvas element', () => {
			const canvas = document.createElement('canvas');
			store.setCanvas(canvas);
			expect(store.canvas).toBe(canvas);
		});

		it('should set canvas context', () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d')!;
			store.setCtx(ctx);
			expect(store.ctx).toStrictEqual(ctx);
		});

		it('should set image element', () => {
			const img = new Image();
			store.setImage(img);
			expect(store.image).toBe(img);
		});
	});

	describe('Reset Functionality', () => {
		it('should reset all adjustments to default values', () => {
			// Set non-default values
			store.brightness = 50;
			store.contrast = -20;
			store.saturation = 75;
			store.setActiveFilter('sepia');

			// Reset
			store.reset();

			// Check all values are back to default
			expect(store.brightness).toBe(0);
			expect(store.contrast).toBe(0);
			expect(store.saturation).toBe(0);
			expect(store.activeFilter).toBe('none');
		});

		it('should clear undo history on reset', () => {
			// Add some mock history (if we had access to it)
			const canvas = document.createElement('canvas');
			canvas.width = 10;
			canvas.height = 10;
			const ctx = canvas.getContext('2d')!;
			store.setCanvas(canvas);
			store.setCtx(ctx);

			// Save a state
			store.saveState();

			// Reset should clear history
			store.reset();

			// After reset, undo should return false (no history)
			expect(store.undo()).toBe(false);
		});

		it('should NOT change drawing mode on reset', () => {
			// Set drawing mode to true
			store.setDrawingMode(true);

			// Reset
			store.reset();

			// Drawing mode should remain true (controlled by tab state)
			expect(store.drawingMode).toBe(true);
		});
	});

	describe('New Image Functionality', () => {
		it('should reset everything including UI state', () => {
			// Set various values
			store.setShowControls(true);
			store.brightness = 50;
			store.setDrawingMode(true);

			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d')!;
			const img = new Image();
			store.setCanvas(canvas);
			store.setCtx(ctx);
			store.setImage(img);

			// New image
			store.newImage();

			// Check everything is reset
			expect(store.showControls).toBe(false);
			expect(store.brightness).toBe(0);
			expect(store.drawingMode).toBe(false);
			expect(store.ctx).toBeNull();
			expect(store.image).toBeNull();
		});
	});

	describe('Undo System', () => {
		let canvas: HTMLCanvasElement;
		let ctx: CanvasRenderingContext2D;

		beforeEach(() => {
			canvas = document.createElement('canvas');
			canvas.width = 10;
			canvas.height = 10;
			ctx = canvas.getContext('2d')!;
			store.setCanvas(canvas);
			store.setCtx(ctx);
		});

		it('should save canvas state', () => {
			// Draw something
			ctx.fillStyle = 'red';
			ctx.fillRect(0, 0, 10, 10);

			// Save state
			store.saveState();

			// Undo should now be possible
			expect(store.undo()).toBe(true);
		});

		it('should restore previous state on undo', () => {
			// Save initial blank state
			store.saveState();

			// Draw something
			ctx.fillStyle = 'red';
			ctx.fillRect(0, 0, 10, 10);

			// Undo should restore blank state
			const result = store.undo();
			expect(result).toBe(true);

			// Canvas should be back to blank (would need to check actual pixels)
			const imageData = ctx.getImageData(0, 0, 1, 1);
			// Initial state would be transparent black (0,0,0,0)
			expect(imageData.data[3]).toBe(0); // Alpha channel should be 0
		});

		it('should return false when no undo history', () => {
			const result = store.undo();
			expect(result).toBe(false);
		});

		it('should limit history size to 20 states', () => {
			// Save 25 states
			for (let i = 0; i < 25; i++) {
				store.saveState();
			}

			// Should only be able to undo 20 times
			let undoCount = 0;
			while (store.undo()) {
				undoCount++;
			}

			expect(undoCount).toBe(20);
		});

		it('should clear history on clearHistory', () => {
			store.saveState();
			store.saveState();

			store.clearHistory();

			expect(store.undo()).toBe(false);
		});

		it('should not save state without canvas context', () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			store.setCtx(null as any);
			store.saveState();

			expect(store.undo()).toBe(false);
		});
	});

	describe('Debounced Updates', () => {
		it('should schedule update with callback', async () => {
			let callbackExecuted = false;
			const callback = () => {
				callbackExecuted = true;
			};

			store.scheduleUpdate(callback);

			// Wait for debounce timeout
			await new Promise((resolve) => setTimeout(resolve, 20));
			expect(callbackExecuted).toBe(true);
		});

		it('should debounce multiple rapid updates', async () => {
			let callCount = 0;
			const callback = () => {
				callCount++;
			};

			// Schedule multiple updates rapidly
			store.scheduleUpdate(callback);
			store.scheduleUpdate(callback);
			store.scheduleUpdate(callback);

			// After debounce timeout, only last callback should execute
			await new Promise((resolve) => setTimeout(resolve, 20));
			expect(callCount).toBe(1);
		});
	});

	describe('Show Controls', () => {
		it('should toggle show controls', () => {
			expect(store.showControls).toBe(false);

			store.setShowControls(true);
			expect(store.showControls).toBe(true);

			store.setShowControls(false);
			expect(store.showControls).toBe(false);
		});
	});
});
