export function createPhotoEditorStore() {
	// Core canvas references
	let canvas = $state<HTMLCanvasElement | null>(null);
	let ctx = $state<CanvasRenderingContext2D | null>(null);
	let image = $state<HTMLImageElement | null>(null);

	// Editor state
	let brightness = $state(0);
	let contrast = $state(0);
	let rotation = $state(0);
	let saturation = $state(0);
	let vibrance = $state(0);
	let exposure = $state(0);
	let highlights = $state(0);
	let shadows = $state(0);
	let whites = $state(0);
	let blacks = $state(0);
	let clarity = $state(0);
	let dehaze = $state(0);
	let showControls = $state(false);

	// Drawing state
	let isDrawing = $state(false);
	let drawingMode = $state(false);
	let brushSize = $state(5);
	let brushColor = $state('#ff0000');

	// Filter state
	let activeFilter = $state<
		| 'none'
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
	>('none');

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
		get saturation() {
			return saturation;
		},
		set saturation(value: number) {
			saturation = value;
		},
		get vibrance() {
			return vibrance;
		},
		set vibrance(value: number) {
			vibrance = value;
		},
		get exposure() {
			return exposure;
		},
		set exposure(value: number) {
			exposure = value;
		},
		get highlights() {
			return highlights;
		},
		set highlights(value: number) {
			highlights = value;
		},
		get shadows() {
			return shadows;
		},
		set shadows(value: number) {
			shadows = value;
		},
		get whites() {
			return whites;
		},
		set whites(value: number) {
			whites = value;
		},
		get blacks() {
			return blacks;
		},
		set blacks(value: number) {
			blacks = value;
		},
		get clarity() {
			return clarity;
		},
		set clarity(value: number) {
			clarity = value;
		},
		get dehaze() {
			return dehaze;
		},
		set dehaze(value: number) {
			dehaze = value;
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
		setActiveFilter: (
			filter:
				| 'none'
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
		) => {
			activeFilter = filter;
		},

		// Utility methods
		reset: () => {
			brightness = 0;
			contrast = 0;
			rotation = 0;
			saturation = 0;
			vibrance = 0;
			exposure = 0;
			highlights = 0;
			shadows = 0;
			whites = 0;
			blacks = 0;
			clarity = 0;
			dehaze = 0;
			activeFilter = 'none';
			drawingMode = false;
		},

		newImage: () => {
			showControls = false;
			brightness = 0;
			contrast = 0;
			rotation = 0;
			saturation = 0;
			vibrance = 0;
			exposure = 0;
			highlights = 0;
			shadows = 0;
			whites = 0;
			blacks = 0;
			clarity = 0;
			dehaze = 0;
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
