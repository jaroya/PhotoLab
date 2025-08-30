import type { PhotoEditorStore } from '../stores/photoEditor.svelte.js';

export function applyFilters(store: PhotoEditorStore) {
	const ctx = store.ctx;
	const canvas = store.canvas;

	if (!ctx || !canvas) return;

	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	// Apply all adjustments
	applyAllAdjustments(data, {
		exposure: store.exposure,
		brightness: store.brightness,
		contrast: store.contrast,
		highlights: store.highlights,
		shadows: store.shadows,
		whites: store.whites,
		blacks: store.blacks,
		saturation: store.saturation,
		vibrance: store.vibrance,
		clarity: store.clarity,
		dehaze: store.dehaze
	});

	// Apply preset filters
	if (store.activeFilter !== 'none') {
		applyPresetFilter(data, store.activeFilter);
	}

	ctx.putImageData(imageData, 0, 0);
}

function applyAllAdjustments(
	data: Uint8ClampedArray,
	adjustments: {
		exposure: number;
		brightness: number;
		contrast: number;
		highlights: number;
		shadows: number;
		whites: number;
		blacks: number;
		saturation: number;
		vibrance: number;
		clarity: number;
		dehaze: number;
	}
) {
	for (let i = 0; i < data.length; i += 4) {
		let r = data[i];
		let g = data[i + 1];
		let b = data[i + 2];

		// Convert to 0-1 range for easier processing
		r /= 255;
		g /= 255;
		b /= 255;

		// Apply exposure (affects all tones equally)
		if (adjustments.exposure !== 0) {
			const exposureFactor = Math.pow(2, adjustments.exposure / 100);
			r *= exposureFactor;
			g *= exposureFactor;
			b *= exposureFactor;
		}

		// Apply highlights (affects bright areas)
		if (adjustments.highlights !== 0) {
			const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
			if (luminance > 0.5) {
				const factor = 1 + (adjustments.highlights / 100) * (luminance - 0.5) * 2;
				r *= factor;
				g *= factor;
				b *= factor;
			}
		}

		// Apply shadows (affects dark areas)
		if (adjustments.shadows !== 0) {
			const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
			if (luminance < 0.5) {
				const factor = 1 + (adjustments.shadows / 100) * (0.5 - luminance) * 2;
				r *= factor;
				g *= factor;
				b *= factor;
			}
		}

		// Apply whites (affects very bright areas)
		if (adjustments.whites !== 0) {
			const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
			if (luminance > 0.8) {
				const factor = 1 + (adjustments.whites / 100) * (luminance - 0.8) * 5;
				r *= factor;
				g *= factor;
				b *= factor;
			}
		}

		// Apply blacks (affects very dark areas)
		if (adjustments.blacks !== 0) {
			const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
			if (luminance < 0.2) {
				const factor = 1 + (adjustments.blacks / 100) * (0.2 - luminance) * 5;
				r *= factor;
				g *= factor;
				b *= factor;
			}
		}

		// Apply brightness
		if (adjustments.brightness !== 0) {
			const brightnessFactor = adjustments.brightness / 100;
			r += brightnessFactor;
			g += brightnessFactor;
			b += brightnessFactor;
		}

		// Apply contrast
		if (adjustments.contrast !== 0) {
			const contrastFactor = 1 + adjustments.contrast / 100;
			r = (r - 0.5) * contrastFactor + 0.5;
			g = (g - 0.5) * contrastFactor + 0.5;
			b = (b - 0.5) * contrastFactor + 0.5;
		}

		// Apply saturation
		if (adjustments.saturation !== 0) {
			const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
			const saturationFactor = 1 + adjustments.saturation / 100;
			r = luminance + (r - luminance) * saturationFactor;
			g = luminance + (g - luminance) * saturationFactor;
			b = luminance + (b - luminance) * saturationFactor;
		}

		// Apply vibrance (more selective saturation)
		if (adjustments.vibrance !== 0) {
			const max = Math.max(r, g, b);
			const avg = (r + g + b) / 3;
			const saturationLevel = max - avg;
			const vibranceFactor = 1 + (adjustments.vibrance / 100) * (1 - saturationLevel);

			r = avg + (r - avg) * vibranceFactor;
			g = avg + (g - avg) * vibranceFactor;
			b = avg + (b - avg) * vibranceFactor;
		}

		// Apply clarity (midtone contrast)
		if (adjustments.clarity !== 0) {
			const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
			if (luminance > 0.2 && luminance < 0.8) {
				const clarityFactor = 1 + (adjustments.clarity / 100) * 0.3;
				r = luminance + (r - luminance) * clarityFactor;
				g = luminance + (g - luminance) * clarityFactor;
				b = luminance + (b - luminance) * clarityFactor;
			}
		}

		// Apply dehaze (removes atmospheric haze)
		if (adjustments.dehaze !== 0) {
			const dehazeFactor = 1 + adjustments.dehaze / 100;
			const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
			r = luminance + (r - luminance) * dehazeFactor;
			g = luminance + (g - luminance) * dehazeFactor;
			b = luminance + (b - luminance) * dehazeFactor;
		}

		// Clamp values and convert back to 0-255 range
		data[i] = Math.min(255, Math.max(0, r * 255));
		data[i + 1] = Math.min(255, Math.max(0, g * 255));
		data[i + 2] = Math.min(255, Math.max(0, b * 255));
	}
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
