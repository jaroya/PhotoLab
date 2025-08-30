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
	filter:
		| 'grayscale'
		| 'sepia'
		| 'invert'
		| 'vintage'
		| 'cool'
		| 'warm'
		| 'dramatic'
		| 'soft'
		| 'vivid'
		| 'noir'
		| 'sunset'
		| 'arctic'
		| 'emerald'
		| 'rose'
		| 'cyberpunk'
) {
	for (let i = 0; i < data.length; i += 4) {
		let r = data[i];
		let g = data[i + 1];
		let b = data[i + 2];

		switch (filter) {
			case 'grayscale': {
				const gray = 0.299 * r + 0.587 * g + 0.114 * b;
				data[i] = gray;
				data[i + 1] = gray;
				data[i + 2] = gray;
				break;
			}
			case 'sepia': {
				data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
				data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
				data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
				break;
			}
			case 'invert':
				data[i] = 255 - r;
				data[i + 1] = 255 - g;
				data[i + 2] = 255 - b;
				break;
			case 'vintage': {
				// Warm sepia with reduced contrast
				const sepia_r = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
				const sepia_g = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
				const sepia_b = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
				data[i] = Math.min(255, sepia_r * 1.1);
				data[i + 1] = Math.min(255, sepia_g * 0.9);
				data[i + 2] = Math.min(255, sepia_b * 0.7);
				break;
			}
			case 'cool': {
				data[i] = Math.min(255, r * 0.8);
				data[i + 1] = Math.min(255, g * 1.1);
				data[i + 2] = Math.min(255, b * 1.3);
				break;
			}
			case 'warm': {
				data[i] = Math.min(255, r * 1.3);
				data[i + 1] = Math.min(255, g * 1.1);
				data[i + 2] = Math.min(255, b * 0.8);
				break;
			}
			case 'dramatic': {
				// High contrast with slight desaturation
				const gray = 0.299 * r + 0.587 * g + 0.114 * b;
				const contrast = 1.5;
				const saturation = 0.8;
				r = gray + (r - gray) * saturation;
				g = gray + (g - gray) * saturation;
				b = gray + (b - gray) * saturation;
				r = Math.min(255, Math.max(0, (r - 128) * contrast + 128));
				g = Math.min(255, Math.max(0, (g - 128) * contrast + 128));
				b = Math.min(255, Math.max(0, (b - 128) * contrast + 128));
				data[i] = r;
				data[i + 1] = g;
				data[i + 2] = b;
				break;
			}
			case 'soft': {
				// Pastel effect with brightness boost
				data[i] = Math.min(255, r * 0.9 + 30);
				data[i + 1] = Math.min(255, g * 0.9 + 25);
				data[i + 2] = Math.min(255, b * 0.95 + 35);
				break;
			}
			case 'vivid': {
				// Enhanced saturation
				const gray = 0.299 * r + 0.587 * g + 0.114 * b;
				const saturation = 1.4;
				data[i] = Math.min(255, gray + (r - gray) * saturation);
				data[i + 1] = Math.min(255, gray + (g - gray) * saturation);
				data[i + 2] = Math.min(255, gray + (b - gray) * saturation);
				break;
			}
			case 'noir': {
				// High contrast black and white
				const gray = 0.299 * r + 0.587 * g + 0.114 * b;
				const contrast = 1.8;
				const enhanced = Math.min(255, Math.max(0, (gray - 128) * contrast + 128));
				data[i] = enhanced;
				data[i + 1] = enhanced;
				data[i + 2] = enhanced;
				break;
			}
			case 'sunset': {
				data[i] = Math.min(255, r * 1.4);
				data[i + 1] = Math.min(255, g * 1.2);
				data[i + 2] = Math.min(255, b * 0.6);
				break;
			}
			case 'arctic': {
				data[i] = Math.min(255, r * 0.9 + 20);
				data[i + 1] = Math.min(255, g + 15);
				data[i + 2] = Math.min(255, b * 1.2 + 10);
				break;
			}
			case 'emerald': {
				data[i] = Math.min(255, r * 0.7);
				data[i + 1] = Math.min(255, g * 1.3);
				data[i + 2] = Math.min(255, b * 0.9);
				break;
			}
			case 'rose': {
				data[i] = Math.min(255, r * 1.2);
				data[i + 1] = Math.min(255, g * 0.9);
				data[i + 2] = Math.min(255, b * 1.1);
				break;
			}
			case 'cyberpunk': {
				// Purple/cyan tint with high contrast
				const gray = 0.299 * r + 0.587 * g + 0.114 * b;
				if (gray < 128) {
					data[i] = Math.min(255, r * 1.3);
					data[i + 1] = Math.min(255, g * 0.8);
					data[i + 2] = Math.min(255, b * 1.5);
				} else {
					data[i] = Math.min(255, r * 0.8);
					data[i + 1] = Math.min(255, g * 1.2);
					data[i + 2] = Math.min(255, b * 1.4);
				}
				break;
			}
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
