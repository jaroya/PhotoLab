<script lang="ts">
	import FileUpload from '$lib/components/FileUpload.svelte';
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let image: HTMLImageElement;
	let originalImageData: ImageData;

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
	let activeFilter = $state('none');

	onMount(() => {
		// Context will be set up when canvas becomes available and image loads
	});

	function handleFileUpload(event: CustomEvent<File[]>) {
		const file = event.detail[0];
		if (file) {
			loadImage(file);
		}
	}

	function loadImage(file: File) {
		const reader = new FileReader();
		reader.onload = (e) => {
			image = new Image();
			image.onload = () => {
				showControls = true;
				// Use setTimeout to ensure DOM has updated with the new canvas element
				setTimeout(() => {
					setupCanvas();
				}, 0);
			};
			image.src = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	}

	function setupCanvas() {
		// Wait a tick to ensure canvas is mounted and context is available
		requestAnimationFrame(() => {
			if (!canvas || !image) return;

			// Always get fresh context when setting up canvas
			ctx = canvas.getContext('2d', { willReadFrequently: true })!

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
			saveOriginalImageData();
		});
	}

	function drawImage() {
		if (!ctx || !image) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;

		ctx.save();
		ctx.translate(centerX, centerY);
		ctx.rotate((rotation * Math.PI) / 180);
		ctx.translate(-centerX, -centerY);

		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
		ctx.restore();

		// Apply filters if there are any adjustments
		if (brightness !== 0 || contrast !== 0 || activeFilter !== 'none') {
			applyFilters();
		}
	}

	function saveOriginalImageData() {
		if (ctx) {
			originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		}
	}

	function applyFilters() {
		if (!ctx || !originalImageData) return;

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imageData.data;

		for (let i = 0; i < data.length; i += 4) {
			// Apply brightness
			data[i] = Math.min(255, Math.max(0, data[i] + brightness));
			data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness));
			data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness));

			// Apply contrast
			const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
			data[i] = Math.min(255, Math.max(0, contrastFactor * (data[i] - 128) + 128));
			data[i + 1] = Math.min(255, Math.max(0, contrastFactor * (data[i + 1] - 128) + 128));
			data[i + 2] = Math.min(255, Math.max(0, contrastFactor * (data[i + 2] - 128) + 128));
		}

		// Apply preset filters
		if (activeFilter !== 'none') {
			applyPresetFilter(data, activeFilter);
		}

		ctx.putImageData(imageData, 0, 0);
	}

	function applyPresetFilter(data: Uint8ClampedArray, filter: string) {
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

	let updateTimeout: ReturnType<typeof setTimeout>;

	function updateImage() {
		// Debounce updates to prevent excessive redraws
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(() => {
			drawImage();
		}, 16); // ~60fps
	}

	function updateImageImmediate() {
		drawImage();
	}

	// Drawing functionality
	function getCanvasCoordinates(event: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;

		return {
			x: (event.clientX - rect.left) * scaleX,
			y: (event.clientY - rect.top) * scaleY
		};
	}

	function startDrawing(event: MouseEvent) {
		if (!drawingMode || !ctx) return;
		isDrawing = true;
		const coords = getCanvasCoordinates(event);

		ctx.beginPath();
		ctx.moveTo(coords.x, coords.y);
	}

	function draw(event: MouseEvent) {
		if (!isDrawing || !drawingMode || !ctx) return;
		const coords = getCanvasCoordinates(event);

		ctx.lineWidth = brushSize;
		ctx.strokeStyle = brushColor;
		ctx.lineCap = 'round';
		ctx.lineTo(coords.x, coords.y);
		ctx.stroke();
	}

	function stopDrawing() {
		isDrawing = false;
	}

	function downloadImage() {
		const link = document.createElement('a');
		link.download = 'edited-image.png';
		link.href = canvas.toDataURL();
		link.click();
	}

	function resetImage() {
		brightness = 0;
		contrast = 0;
		rotation = 0;
		activeFilter = 'none';
		drawingMode = false;
		drawImage();
	}

	function newImage() {
		showControls = false;
		brightness = 0;
		contrast = 0;
		rotation = 0;
		activeFilter = 'none';
		drawingMode = false;
		// Clear canvas and context references when switching to upload mode
		ctx = null as any;
		image = null as any;
	}
</script>

<svelte:head>
	<title>PhotoLab - Free Online Photo Editor</title>
	<meta
		name="description"
		content="Free online photo editor with filters, adjustments, and drawing tools. Edit your images directly in your browser - no signup required."
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
	<!-- Header -->
	<header class="border-b border-gray-200 bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-3">
					<!-- Logo -->
					<div
						class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"
					>
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h1 class="text-2xl font-bold text-gray-900">PhotoLab</h1>
				</div>
				<div class="flex items-center space-x-4">
					<span
						class="hidden items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 sm:inline-flex"
					>
						100% Free
					</span>
					<span
						class="hidden items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 sm:inline-flex"
					>
						No Sign-up
					</span>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if !showControls}
			<!-- Upload Section -->
			<div class="py-12">
				<div class="mb-12 text-center">
					<h2 class="mb-4 text-4xl font-bold text-gray-900">Edit Photos Online, Instantly</h2>
					<p class="mx-auto max-w-2xl text-xl text-gray-600">
						Professional photo editing tools right in your browser.
					</p>
					<p class="mx-auto max-w-2xl text-xl text-gray-600">
						No downloads, no accounts, just
						pure creativity.
					</p>
				</div>

				<!-- Features Grid -->
				<div class="mx-auto mb-12 grid max-w-4xl gap-6 md:grid-cols-3">
					<div class="rounded-lg bg-white p-6 text-center shadow-sm">
						<div
							class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100"
						>
							<svg
								class="h-6 w-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
								/>
							</svg>
						</div>
						<h3 class="mb-1 font-semibold text-gray-900">Adjust & Enhance</h3>
						<p class="text-sm text-gray-600">
							Fine-tune brightness, contrast, and rotation with real-time preview
						</p>
					</div>
					<div class="rounded-lg bg-white p-6 text-center shadow-sm">
						<div
							class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100"
						>
							<svg
								class="h-6 w-6 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM14 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z"
								/>
							</svg>
						</div>
						<h3 class="mb-1 font-semibold text-gray-900">Apply Filters</h3>
						<p class="text-sm text-gray-600">Transform your photos with professional filters</p>
					</div>
					<div class="rounded-lg bg-white p-6 text-center shadow-sm">
						<div
							class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100"
						>
							<svg
								class="h-6 w-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
								/>
							</svg>
						</div>
						<h3 class="mb-1 font-semibold text-gray-900">Draw & Annotate</h3>
						<p class="text-sm text-gray-600">
							Add drawings and annotations with customizable brushes
						</p>
					</div>
				</div>

				<div class="mx-auto max-w-2xl">
					<FileUpload on:upload={handleFileUpload} class="mb-8" />
				</div>
			</div>
		{:else}
			<!-- Editor Interface -->
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-bold text-gray-900">Edit Your Photo</h2>
				<Button variant="outline" size="sm" onclick={newImage}>Upload New Photo</Button>
			</div>

			<div class="grid gap-6 lg:grid-cols-4 lg:gap-8">
				<!-- Canvas Area -->
				<div class="order-2 lg:order-1 lg:col-span-3">
					<div class="rounded-lg bg-white p-6 shadow-lg">
						<div class="mb-4 flex items-center justify-between">
							<h3 class="text-lg font-semibold text-gray-900">Canvas</h3>
							<div class="flex flex-wrap gap-2">
								<Button variant="secondary" size="sm" onclick={resetImage}>Reset</Button>
								<Button variant="primary" size="sm" onclick={downloadImage}>
									<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
										/>
									</svg>
									Download
								</Button>
							</div>
						</div>

						<div
							class="flex justify-center overflow-auto rounded-lg border-2 border-gray-200 bg-gray-50 p-4"
						>
							<canvas
								bind:this={canvas}
								class="max-h-[50vh] max-w-full rounded border border-gray-300 shadow-sm sm:max-h-[60vh] lg:max-h-[70vh] cursor-{drawingMode
									? 'crosshair'
									: 'default'}"
								onmousedown={startDrawing}
								onmousemove={draw}
								onmouseup={stopDrawing}
								onmouseleave={stopDrawing}
								aria-label="Photo editing canvas"
							></canvas>
						</div>
					</div>
				</div>

				<!-- Controls Panel -->
				<div class="order-1 lg:order-2 lg:col-span-1">
					<div class="space-y-6 rounded-lg bg-white p-6 shadow-lg">
						<!-- Adjustments -->
						<div>
							<h3 class="mb-4 text-lg font-medium text-gray-900">Adjustments</h3>
							<div class="space-y-4">
								<div>
									<label class="mb-2 block text-sm font-medium text-gray-700">
										Brightness: {brightness}
									</label>
									<input
										type="range"
										min="-100"
										max="100"
										bind:value={brightness}
										oninput={updateImage}
										class="w-full"
									/>
								</div>

								<div>
									<label class="mb-2 block text-sm font-medium text-gray-700">
										Contrast: {contrast}
									</label>
									<input
										type="range"
										min="-100"
										max="100"
										bind:value={contrast}
										oninput={updateImage}
										class="w-full"
									/>
								</div>

								<div>
									<label class="mb-2 block text-sm font-medium text-gray-700">
										Rotation: {rotation}°
									</label>
									<input
										type="range"
										min="0"
										max="360"
										bind:value={rotation}
										oninput={updateImage}
										class="w-full"
									/>
								</div>
							</div>
						</div>

						<!-- Filters -->
						<div>
							<h3 class="mb-4 text-lg font-medium text-gray-900">Filters</h3>
							<div class="grid grid-cols-2 gap-2">
								<button
									class="rounded-lg border-2 p-2 text-sm font-medium transition-colors {activeFilter ===
									'none'
										? 'border-blue-500 bg-blue-50 text-blue-700'
										: 'border-gray-300 hover:bg-gray-50'}"
									onclick={() => {
										activeFilter = 'none';
										updateImageImmediate();
									}}
								>
									None
								</button>
								<button
									class="rounded-lg border-2 p-2 text-sm font-medium transition-colors {activeFilter ===
									'grayscale'
										? 'border-blue-500 bg-blue-50 text-blue-700'
										: 'border-gray-300 hover:bg-gray-50'}"
									onclick={() => {
										activeFilter = 'grayscale';
										updateImageImmediate();
									}}
								>
									Grayscale
								</button>
								<button
									class="rounded-lg border-2 p-2 text-sm font-medium transition-colors {activeFilter ===
									'sepia'
										? 'border-blue-500 bg-blue-50 text-blue-700'
										: 'border-gray-300 hover:bg-gray-50'}"
									onclick={() => {
										activeFilter = 'sepia';
										updateImageImmediate();
									}}
								>
									Sepia
								</button>
								<button
									class="rounded-lg border-2 p-2 text-sm font-medium transition-colors {activeFilter ===
									'invert'
										? 'border-blue-500 bg-blue-50 text-blue-700'
										: 'border-gray-300 hover:bg-gray-50'}"
									onclick={() => {
										activeFilter = 'invert';
										updateImageImmediate();
									}}
								>
									Invert
								</button>
							</div>
						</div>

						<!-- Draw Mode Toggle -->
						<div>
							<Button
								variant={drawingMode ? 'primary' : 'outline'}
								size="sm"
								onclick={() => (drawingMode = !drawingMode)}
								class="w-full"
							>
								<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
									/>
								</svg>
								{drawingMode ? 'Exit Draw Mode' : 'Enter Draw Mode'}
							</Button>
						</div>

						{#if drawingMode}
							<!-- Drawing Tools -->
							<div class="border-t border-gray-200 pt-4">
								<h3 class="mb-4 text-lg font-medium text-gray-900">Drawing Tools</h3>
								<div class="space-y-4">
									<div>
										<label class="mb-2 block text-sm font-medium text-gray-700">
											Brush Size: {brushSize}px
										</label>
										<input type="range" min="1" max="50" bind:value={brushSize} class="w-full" />
									</div>

									<div>
										<label class="mb-2 block text-sm font-medium text-gray-700">Color</label>
										<input
											type="color"
											bind:value={brushColor}
											class="h-10 w-full cursor-pointer rounded border border-gray-300"
										/>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</main>

	<!-- Footer -->
	<footer class="mt-auto border-t border-gray-200 bg-white">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="grid gap-8 md:grid-cols-3">
				<div>
					<h3 class="mb-3 text-sm font-semibold tracking-wider text-gray-900 uppercase">
						About PhotoLab
					</h3>
					<p class="text-sm text-gray-600">
						A free, browser-based photo editor built with modern web technologies. No uploads to
						servers - all processing happens locally in your browser.
					</p>
				</div>
				<div>
					<h3 class="mb-3 text-sm font-semibold tracking-wider text-gray-900 uppercase">
						Features
					</h3>
					<ul class="space-y-2 text-sm text-gray-600">
						<li class="flex items-center">
							<svg class="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							100% Free Forever
						</li>
						<li class="flex items-center">
							<svg class="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							No Registration Required
						</li>
						<li class="flex items-center">
							<svg class="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							Privacy-First: Local Processing
						</li>
					</ul>
				</div>
				<div>
					<h3 class="mb-3 text-sm font-semibold tracking-wider text-gray-900 uppercase">
						Built With
					</h3>
					<div class="flex flex-wrap gap-2">
						<span
							class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
						>
							SvelteKit
						</span>
						<span
							class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
						>
							Canvas API
						</span>
						<span
							class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
						>
							Tailwind CSS
						</span>
					</div>
				</div>
			</div>
			<div class="mt-8 border-t border-gray-200 pt-8">
				<p class="text-center text-sm text-gray-500">
					© 2024 PhotoLab. Made with ❤️ for the creative community.
				</p>
			</div>
		</div>
	</footer>
</div>
