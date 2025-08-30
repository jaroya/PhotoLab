import type { PhotoEditorStore } from '../stores/photoEditor.svelte.js';

export function setupCanvas(store: PhotoEditorStore, drawImage: () => void) {
	return new Promise<void>((resolve) => {
		requestAnimationFrame(() => {
			const canvas = store.canvas;
			const image = store.image;

			if (!canvas || !image) {
				resolve();
				return;
			}

			// Always get fresh context when setting up canvas
			const ctx = canvas.getContext('2d', { willReadFrequently: true });
			if (!ctx) {
				resolve();
				return;
			}

			store.setCtx(ctx);

			const maxWidth = 800;
			const maxHeight = 600;

			let { width, height } = image;

			if (width > maxWidth) {
				height = (height * maxWidth) / width;
				width = maxWidth;
			}
			if (height > maxHeight) {
				width = (width * maxHeight) / height;
				height = maxHeight;
			}

			canvas.width = width;
			canvas.height = height;

			drawImage();
			resolve();
		});
	});
}

export function drawImage(store: PhotoEditorStore, applyFilters: () => void) {
	const ctx = store.ctx;
	const image = store.image;
	const canvas = store.canvas;

	if (!ctx || !image || !canvas) return;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const centerX = canvas.width / 2;
	const centerY = canvas.height / 2;

	ctx.save();
	ctx.translate(centerX, centerY);
	ctx.rotate((store.rotation * Math.PI) / 180);
	ctx.translate(-centerX, -centerY);

	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	ctx.restore();

	// Apply filters if there are any adjustments
	if (store.brightness !== 0 || store.contrast !== 0 || store.activeFilter !== 'none') {
		applyFilters();
	}
}

export function downloadImage(canvas: HTMLCanvasElement | null) {
	if (!canvas) return;

	const link = document.createElement('a');
	link.download = 'edited-image.png';
	link.href = canvas.toDataURL();
	link.click();
}

export function getCanvasCoordinates(event: MouseEvent, canvas: HTMLCanvasElement) {
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	return {
		x: (event.clientX - rect.left) * scaleX,
		y: (event.clientY - rect.top) * scaleY
	};
}
