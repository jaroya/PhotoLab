export function createPhotoEditorStore() {
	// Core canvas references
	let canvas = $state<HTMLCanvasElement | null>(null);
	let ctx = $state<CanvasRenderingContext2D | null>(null);
	let image = $state<HTMLImageElement | null>(null);

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
		// Direct property access (used in templates)
		get canvas() {
			return canvas;
		},
		get ctx() {
			return ctx;
		},
		get image() {
			return image;
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
		get activeFilter() {
			return activeFilter;
		},

		// Bindable properties for sliders
		get brightness() {
			return brightness;
		},
		set brightness(value: number) {
			brightness = value;
		},
		get contrast() {
			return contrast;
		},
		set contrast(value: number) {
			contrast = value;
		},
		get rotation() {
			return rotation;
		},
		set rotation(value: number) {
			rotation = value;
		},
		get brushSize() {
			return brushSize;
		},
		set brushSize(value: number) {
			brushSize = value;
		},
		get brushColor() {
			return brushColor;
		},
		set brushColor(value: string) {
			brushColor = value;
		},

		// Only include setters that are actually used
		setCanvas: (newCanvas: HTMLCanvasElement) => {
			canvas = newCanvas;
		},
		setCtx: (newCtx: CanvasRenderingContext2D) => {
			ctx = newCtx;
		},
		setImage: (newImage: HTMLImageElement) => {
			image = newImage;
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
		},

		// Debounced update
		scheduleUpdate: (callback: () => void) => {
			if (updateTimeout) {
				clearTimeout(updateTimeout);
			}
			updateTimeout = setTimeout(callback, 16); // ~60fps
		}
	};
}

export type PhotoEditorStore = ReturnType<typeof createPhotoEditorStore>;
