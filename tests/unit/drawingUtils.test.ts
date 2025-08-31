import { describe, it, expect, beforeEach, vi } from 'vitest';
import { startDrawing, draw, stopDrawing } from '$lib/utils/drawingUtils';

describe('Drawing Utilities', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let mockStore: any;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	beforeEach(() => {
		// Create test canvas
		canvas = document.createElement('canvas');
		canvas.width = 100;
		canvas.height = 100;
		ctx = canvas.getContext('2d')!;

		// Mock canvas getBoundingClientRect
		canvas.getBoundingClientRect = vi.fn().mockReturnValue({
			left: 0,
			top: 0,
			width: 100,
			height: 100
		});

		// Create mock store
		mockStore = {
			canvas,
			ctx,
			drawingMode: true,
			isDrawing: false,
			brushSize: 5,
			brushColor: '#ff0000',
			setIsDrawing: vi.fn(),
			saveState: vi.fn()
		};
	});

	describe('startDrawing', () => {
		it('should initialize drawing when drawing mode is active', () => {
			const event = new MouseEvent('mousedown', {
				clientX: 50,
				clientY: 50
			});

			startDrawing(event, mockStore);

			expect(mockStore.saveState).toHaveBeenCalled();
			expect(mockStore.setIsDrawing).toHaveBeenCalledWith(true);
			expect(ctx.lineWidth).toBe(5);
			expect(ctx.strokeStyle).toBe('#ff0000');
			expect(ctx.lineCap).toBe('round');
			expect(ctx.lineJoin).toBe('round');
		});

		it('should not start drawing when drawing mode is inactive', () => {
			mockStore.drawingMode = false;
			const event = new MouseEvent('mousedown', {
				clientX: 50,
				clientY: 50
			});

			startDrawing(event, mockStore);

			expect(mockStore.saveState).not.toHaveBeenCalled();
			expect(mockStore.setIsDrawing).not.toHaveBeenCalled();
		});

		it('should not start drawing when context is null', () => {
			mockStore.ctx = null;
			const event = new MouseEvent('mousedown', {
				clientX: 50,
				clientY: 50
			});

			startDrawing(event, mockStore);

			expect(mockStore.saveState).not.toHaveBeenCalled();
			expect(mockStore.setIsDrawing).not.toHaveBeenCalled();
		});

		it('should save canvas state before starting to draw', () => {
			const event = new MouseEvent('mousedown', {
				clientX: 25,
				clientY: 25
			});

			startDrawing(event, mockStore);

			// saveState should be called before drawing starts (for undo)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect(mockStore.saveState).toHaveBeenCalledBefore(mockStore.setIsDrawing as any);
		});

		it('should set correct brush properties', () => {
			mockStore.brushSize = 10;
			mockStore.brushColor = '#00ff00';

			const event = new MouseEvent('mousedown', {
				clientX: 50,
				clientY: 50
			});

			startDrawing(event, mockStore);

			expect(ctx.lineWidth).toBe(10);
			expect(ctx.strokeStyle).toBe('#00ff00');
		});
	});

	describe('draw', () => {
		it('should draw when isDrawing is true', () => {
			mockStore.isDrawing = true;

			// Start at position (10, 10)
			const startEvent = new MouseEvent('mousedown', {
				clientX: 10,
				clientY: 10
			});
			startDrawing(startEvent, mockStore);

			// Move to position (20, 20)
			const moveEvent = new MouseEvent('mousemove', {
				clientX: 20,
				clientY: 20
			});

			const strokeSpy = vi.spyOn(ctx, 'stroke');
			draw(moveEvent, mockStore);

			expect(strokeSpy).toHaveBeenCalled();
		});

		it('should not draw when isDrawing is false', () => {
			mockStore.isDrawing = false;

			const event = new MouseEvent('mousemove', {
				clientX: 50,
				clientY: 50
			});

			const strokeSpy = vi.spyOn(ctx, 'stroke');
			draw(event, mockStore);

			expect(strokeSpy).not.toHaveBeenCalled();
		});

		it('should not draw when drawing mode is inactive', () => {
			mockStore.isDrawing = true;
			mockStore.drawingMode = false;

			const event = new MouseEvent('mousemove', {
				clientX: 50,
				clientY: 50
			});

			const strokeSpy = vi.spyOn(ctx, 'stroke');
			draw(event, mockStore);

			expect(strokeSpy).not.toHaveBeenCalled();
		});

		it('should skip drawing for small movements (jitter reduction)', () => {
			mockStore.isDrawing = true;

			// Start drawing
			const startEvent = new MouseEvent('mousedown', {
				clientX: 50,
				clientY: 50
			});
			startDrawing(startEvent, mockStore);

			// Move less than 2 pixels
			const moveEvent = new MouseEvent('mousemove', {
				clientX: 50.5,
				clientY: 50.5
			});

			const strokeSpy = vi.spyOn(ctx, 'stroke');
			draw(moveEvent, mockStore);

			// Should not draw for micro-movements
			expect(strokeSpy).not.toHaveBeenCalled();
		});

		it('should use quadratic curves for smooth lines', () => {
			mockStore.isDrawing = true;

			// Start drawing
			const startEvent = new MouseEvent('mousedown', {
				clientX: 10,
				clientY: 10
			});
			startDrawing(startEvent, mockStore);

			// Move significantly
			const moveEvent = new MouseEvent('mousemove', {
				clientX: 30,
				clientY: 30
			});

			const quadraticCurveSpy = vi.spyOn(ctx, 'quadraticCurveTo');
			draw(moveEvent, mockStore);

			expect(quadraticCurveSpy).toHaveBeenCalled();
		});
	});

	describe('stopDrawing', () => {
		it('should set isDrawing to false', () => {
			stopDrawing(mockStore);

			expect(mockStore.setIsDrawing).toHaveBeenCalledWith(false);
		});

		it('should handle being called when not drawing', () => {
			mockStore.isDrawing = false;

			expect(() => stopDrawing(mockStore)).not.toThrow();
			expect(mockStore.setIsDrawing).toHaveBeenCalledWith(false);
		});
	});

	describe('Drawing workflow integration', () => {
		it('should complete a full drawing cycle', () => {
			// Start drawing
			const startEvent = new MouseEvent('mousedown', {
				clientX: 10,
				clientY: 10
			});
			startDrawing(startEvent, mockStore);
			expect(mockStore.setIsDrawing).toHaveBeenCalledWith(true);

			// Set isDrawing to true (simulating store update)
			mockStore.isDrawing = true;

			// Draw some strokes
			const moveEvent1 = new MouseEvent('mousemove', {
				clientX: 20,
				clientY: 20
			});
			const strokeSpy = vi.spyOn(ctx, 'stroke');
			draw(moveEvent1, mockStore);
			expect(strokeSpy).toHaveBeenCalled();

			// Stop drawing
			stopDrawing(mockStore);
			expect(mockStore.setIsDrawing).toHaveBeenCalledWith(false);
		});

		it('should save state only once per drawing session', () => {
			// Start first drawing session
			const event1 = new MouseEvent('mousedown', {
				clientX: 10,
				clientY: 10
			});
			startDrawing(event1, mockStore);
			expect(mockStore.saveState).toHaveBeenCalledTimes(1);

			// Draw multiple strokes in same session
			mockStore.isDrawing = true;
			const moveEvent = new MouseEvent('mousemove', {
				clientX: 30,
				clientY: 30
			});
			draw(moveEvent, mockStore);
			draw(moveEvent, mockStore);

			// saveState should still only be called once
			expect(mockStore.saveState).toHaveBeenCalledTimes(1);

			// Stop and start new session
			stopDrawing(mockStore);
			mockStore.isDrawing = false;

			const event2 = new MouseEvent('mousedown', {
				clientX: 50,
				clientY: 50
			});
			startDrawing(event2, mockStore);

			// Now saveState should be called again for new session
			expect(mockStore.saveState).toHaveBeenCalledTimes(2);
		});
	});
});
