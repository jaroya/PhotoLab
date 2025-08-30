import type { PhotoEditorStore } from '../stores/photoEditor.svelte.js';

export function applyFilters(store: PhotoEditorStore) {
	const ctx = store.ctx;
	const canvas = store.canvas;

	if (!ctx || !canvas) return;

	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	// Apply brightness and contrast
	for (let i = 0; i < data.length; i += 4) {
		// Apply brightness
		data[i] = Math.min(255, Math.max(0, data[i] + store.brightness));
		data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + store.brightness));
		data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + store.brightness));

		// Apply contrast
		const contrastFactor = (259 * (store.contrast + 255)) / (255 * (259 - store.contrast));
		data[i] = Math.min(255, Math.max(0, contrastFactor * (data[i] - 128) + 128));
		data[i + 1] = Math.min(255, Math.max(0, contrastFactor * (data[i + 1] - 128) + 128));
		data[i + 2] = Math.min(255, Math.max(0, contrastFactor * (data[i + 2] - 128) + 128));
	}

	// Apply preset filters
	if (store.activeFilter !== 'none') {
		applyPresetFilter(data, store.activeFilter);
	}

	ctx.putImageData(imageData, 0, 0);
}

export function applyPresetFilter(
	data: Uint8ClampedArray,
	filter: 'grayscale' | 'sepia' | 'invert'
) {
	for (let i = 0; i < data.length; i += 4) {
		switch (filter) {
			case 'grayscale': {
				const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
				data[i] = gray;
				data[i + 1] = gray;
				data[i + 2] = gray;
				break;
			}
			case 'sepia': {
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];
				data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
				data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
				data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
				break;
			}
			case 'invert':
				data[i] = 255 - data[i];
				data[i + 1] = 255 - data[i + 1];
				data[i + 2] = 255 - data[i + 2];
				break;
		}
	}
}

export function loadImage(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = reject;
			image.src = e.target?.result as string;
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
