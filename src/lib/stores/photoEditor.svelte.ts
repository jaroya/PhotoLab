export function createPhotoEditorStore() {
	// Core canvas references
	let canvas = $state<HTMLCanvasElement | null>(null);
	let ctx = $state<CanvasRenderingContext2D | null>(null);
	let image = $state<HTMLImageElement | null>(null);
	let originalImageData = $state<ImageData | null>(null);

	// Editor state
	let brightness = $state(0);
	let contrast = $state(0);
	let rotation = $state(0);
	let showControls = $state(false);

	// Drawing state
	let isDrawing = $state(false);
	let drawingMode = $state(false);
	let brushSize = $state(5);
	let brushColor = $state('#ff0000');

	// Filter state
	let activeFilter = $state<'none' | 'grayscale' | 'sepia' | 'invert'>('none');

	// Debouncing
	let updateTimeout: ReturnType<typeof setTimeout> | null = null;

	return {
		// Getters
		get canvas() {
			return canvas;
		},
		get ctx() {
			return ctx;
		},
		get image() {
			return image;
		},
		get originalImageData() {
			return originalImageData;
		},
		get brightness() {
			return brightness;
		},
		get contrast() {
			return contrast;
		},
		get rotation() {
			return rotation;
		},
		get showControls() {
			return showControls;
		},
		get isDrawing() {
			return isDrawing;
		},
		get drawingMode() {
			return drawingMode;
		},
		get brushSize() {
			return brushSize;
		},
		get brushColor() {
			return brushColor;
		},
		get activeFilter() {
			return activeFilter;
		},

		// Setters
		setCanvas: (newCanvas: HTMLCanvasElement) => {
			canvas = newCanvas;
		},
		setCtx: (newCtx: CanvasRenderingContext2D) => {
			ctx = newCtx;
		},
		setImage: (newImage: HTMLImageElement) => {
			image = newImage;
		},
		setOriginalImageData: (data: ImageData) => {
			originalImageData = data;
		},
		setBrightness: (value: number) => {
			brightness = value;
		},
		setContrast: (value: number) => {
			contrast = value;
		},
		setRotation: (value: number) => {
			rotation = value;
		},
		setShowControls: (value: boolean) => {
			showControls = value;
		},
		setIsDrawing: (value: boolean) => {
			isDrawing = value;
		},
		setDrawingMode: (value: boolean) => {
			drawingMode = value;
		},
		setBrushSize: (value: number) => {
			brushSize = value;
		},
		setBrushColor: (value: string) => {
			brushColor = value;
		},
		setActiveFilter: (filter: 'none' | 'grayscale' | 'sepia' | 'invert') => {
			activeFilter = filter;
		},

		// Utility methods
		reset: () => {
			brightness = 0;
			contrast = 0;
			rotation = 0;
			activeFilter = 'none';
			drawingMode = false;
		},

		newImage: () => {
			showControls = false;
			brightness = 0;
			contrast = 0;
			rotation = 0;
			activeFilter = 'none';
			drawingMode = false;
			ctx = null;
			image = null;
			originalImageData = null;
		},

		// Debounced update
		scheduleUpdate: (callback: () => void) => {
			if (updateTimeout) {
				clearTimeout(updateTimeout);
			}
			updateTimeout = setTimeout(callback, 16); // ~60fps
		},

		clearUpdateTimeout: () => {
			if (updateTimeout) {
				clearTimeout(updateTimeout);
				updateTimeout = null;
			}
		}
	};
}

export type PhotoEditorStore = ReturnType<typeof createPhotoEditorStore>;
