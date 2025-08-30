import type { PhotoEditorStore } from '../stores/photoEditor.svelte.js';
import { getCanvasCoordinates } from './canvasUtils.js';

// Store the last drawing point for smoothing
let lastX = 0;
let lastY = 0;

export function startDrawing(event: MouseEvent, store: PhotoEditorStore) {
	const ctx = store.ctx;
	const canvas = store.canvas;

	if (!store.drawingMode || !ctx || !canvas) return;

	// Save canvas state before starting to draw (for undo)
	store.saveState();

	store.setIsDrawing(true);
	const coords = getCanvasCoordinates(event, canvas);

	// Store starting coordinates
	lastX = coords.x;
	lastY = coords.y;

	// Set up drawing style before starting
	ctx.lineWidth = store.brushSize;
	ctx.strokeStyle = store.brushColor;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.globalCompositeOperation = 'source-over';

	ctx.beginPath();
	ctx.moveTo(coords.x, coords.y);
}

export function draw(event: MouseEvent, store: PhotoEditorStore) {
	const ctx = store.ctx;
	const canvas = store.canvas;

	if (!store.isDrawing || !store.drawingMode || !ctx || !canvas) return;

	const coords = getCanvasCoordinates(event, canvas);

	// Calculate distance from last point to prevent too many micro-movements
	const dx = coords.x - lastX;
	const dy = coords.y - lastY;
	const distance = Math.sqrt(dx * dx + dy * dy);

	// Only draw if moved at least 2 pixels (reduces jitter)
	if (distance < 2) return;

	// Use quadratic curve for smoother lines
	const midX = (lastX + coords.x) / 2;
	const midY = (lastY + coords.y) / 2;

	ctx.quadraticCurveTo(lastX, lastY, midX, midY);
	ctx.stroke();

	// Update last position
	lastX = coords.x;
	lastY = coords.y;

	// Start a new sub-path from current position
	ctx.beginPath();
	ctx.moveTo(midX, midY);
}

export function stopDrawing(store: PhotoEditorStore) {
	store.setIsDrawing(false);
}
