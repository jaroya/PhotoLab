import type { PhotoEditorStore } from '../stores/photoEditor.svelte.js';
import { getCanvasCoordinates } from './canvasUtils.js';

export function startDrawing(event: MouseEvent, store: PhotoEditorStore) {
	const ctx = store.ctx;
	const canvas = store.canvas;

	if (!store.drawingMode || !ctx || !canvas) return;

	store.setIsDrawing(true);
	const coords = getCanvasCoordinates(event, canvas);

	ctx.beginPath();
	ctx.moveTo(coords.x, coords.y);
}

export function draw(event: MouseEvent, store: PhotoEditorStore) {
	const ctx = store.ctx;
	const canvas = store.canvas;

	if (!store.isDrawing || !store.drawingMode || !ctx || !canvas) return;

	const coords = getCanvasCoordinates(event, canvas);

	ctx.lineWidth = store.brushSize;
	ctx.strokeStyle = store.brushColor;
	ctx.lineCap = 'round';
	ctx.lineTo(coords.x, coords.y);
	ctx.stroke();
}

export function stopDrawing(store: PhotoEditorStore) {
	store.setIsDrawing(false);
}
