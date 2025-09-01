import { beforeAll, vi } from 'vitest';

// Mock canvas and browser APIs for unit tests
beforeAll(() => {
	// Mock HTMLCanvasElement and 2D context
	HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextType) => {
		if (contextType === '2d') {
			return {
				fillStyle: '',
				strokeStyle: '',
				lineWidth: 1,
				lineCap: 'butt',
				lineJoin: 'miter',
				globalAlpha: 1,
				globalCompositeOperation: 'source-over',
				imageSmoothingEnabled: true,
				fillRect: vi.fn(),
				strokeRect: vi.fn(),
				clearRect: vi.fn(),
				beginPath: vi.fn(),
				closePath: vi.fn(),
				moveTo: vi.fn(),
				lineTo: vi.fn(),
				quadraticCurveTo: vi.fn(),
				bezierCurveTo: vi.fn(),
				arc: vi.fn(),
				arcTo: vi.fn(),
				ellipse: vi.fn(),
				rect: vi.fn(),
				fill: vi.fn(),
				stroke: vi.fn(),
				clip: vi.fn(),
				isPointInPath: vi.fn(),
				isPointInStroke: vi.fn(),
				drawImage: vi.fn(),
				putImageData: vi.fn(),
				createImageData: vi.fn().mockReturnValue({
					data: new Uint8ClampedArray(4),
					width: 1,
					height: 1
				}),
				getImageData: vi.fn().mockReturnValue({
					data: new Uint8ClampedArray(4),
					width: 1,
					height: 1
				}),
				save: vi.fn(),
				restore: vi.fn(),
				scale: vi.fn(),
				rotate: vi.fn(),
				translate: vi.fn(),
				transform: vi.fn(),
				setTransform: vi.fn(),
				resetTransform: vi.fn(),
				createLinearGradient: vi.fn(),
				createRadialGradient: vi.fn(),
				createPattern: vi.fn(),
				measureText: vi.fn().mockReturnValue({ width: 0 }),
				fillText: vi.fn(),
				strokeText: vi.fn()
			};
		}
		return null;
	});

	// Mock HTMLCanvasElement.toDataURL
	HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,test');

	// Mock HTMLCanvasElement.toBlob
	HTMLCanvasElement.prototype.toBlob = vi.fn().mockImplementation((callback) => {
		const blob = new Blob(['test'], { type: 'image/png' });
		callback?.(blob);
	});

	// Mock getBoundingClientRect
	HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
		left: 0,
		top: 0,
		right: 100,
		bottom: 100,
		width: 100,
		height: 100,
		x: 0,
		y: 0,
		toJSON: vi.fn()
	});

	// Mock pointer capture methods
	HTMLCanvasElement.prototype.setPointerCapture = vi.fn();
	HTMLCanvasElement.prototype.releasePointerCapture = vi.fn();

	// Mock Image constructor
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(globalThis as any).Image = class {
		width = 0;
		height = 0;
		private _src = '';
		onload: (() => void) | null = null;
		onerror: (() => void) | null = null;

		get src() {
			return this._src;
		}

		set src(value: string) {
			this._src = value;
			setTimeout(() => {
				this.onload?.();
			}, 0);
		}

		constructor() {
			// Do not auto-call onload in constructor
		}
	};

	// Mock URL.createObjectURL
	global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
	global.URL.revokeObjectURL = vi.fn();

	// Mock File API
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(globalThis as any).File = class File extends Blob {
		name: string;
		lastModified: number;

		constructor(fileBits: BlobPart[], fileName: string, options: FilePropertyBag = {}) {
			super(fileBits, options);
			this.name = fileName;
			this.lastModified = options.lastModified || Date.now();
		}
	};

	// Mock FileReader
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(globalThis as any).FileReader = class FileReader extends EventTarget {
		result: string | ArrayBuffer | null = null;
		error: DOMException | null = null;
		readyState = 0;
		onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
		onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;

		private listeners = new Map<string, Array<(event: Event) => void>>();

		constructor() {
			super();
		}

		addEventListener(type: string, listener: (event: Event) => void): void {
			if (!this.listeners.has(type)) {
				this.listeners.set(type, []);
			}
			this.listeners.get(type)!.push(listener);
		}

		removeEventListener(type: string, listener: (event: Event) => void): void {
			const typeListeners = this.listeners.get(type);
			if (typeListeners) {
				const index = typeListeners.indexOf(listener);
				if (index > -1) {
					typeListeners.splice(index, 1);
				}
			}
		}

		dispatchEvent(event: Event): boolean {
			const typeListeners = this.listeners.get(event.type);
			if (typeListeners) {
				typeListeners.forEach((listener) => listener(event));
			}
			return true;
		}

		readAsDataURL() {
			setTimeout(() => {
				this.result = 'data:image/png;base64,test';
				this.readyState = 2;
				const event = {
					target: { result: this.result }
				} as ProgressEvent<FileReader>;
				this.onload?.(event);
			}, 0);
		}
	};

	// Mock document.createElement for download links
	const originalCreateElement = document.createElement;
	document.createElement = vi.fn().mockImplementation((tagName: string) => {
		if (tagName === 'a') {
			return {
				href: '',
				download: '',
				click: vi.fn()
			};
		}
		return originalCreateElement.call(document, tagName);
	});

	// Mock PointerEvent for testing
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(globalThis as any).PointerEvent = class PointerEvent extends MouseEvent {
		pointerId: number;
		width: number;
		height: number;
		pressure: number;
		tangentialPressure: number;
		tiltX: number;
		tiltY: number;
		twist: number;
		altitudeAngle: number;
		azimuthAngle: number;
		pointerType: string;
		isPrimary: boolean;

		constructor(type: string, eventInitDict: PointerEventInit = {}) {
			super(type, eventInitDict);
			this.pointerId = eventInitDict.pointerId || 0;
			this.width = eventInitDict.width || 1;
			this.height = eventInitDict.height || 1;
			this.pressure = eventInitDict.pressure || 0;
			this.tangentialPressure = eventInitDict.tangentialPressure || 0;
			this.tiltX = eventInitDict.tiltX || 0;
			this.tiltY = eventInitDict.tiltY || 0;
			this.twist = eventInitDict.twist || 0;
			this.altitudeAngle = eventInitDict.altitudeAngle || 0;
			this.azimuthAngle = eventInitDict.azimuthAngle || 0;
			this.pointerType = eventInitDict.pointerType || 'mouse';
			this.isPrimary = eventInitDict.isPrimary || false;
		}
	};
});
