<script lang="ts">
	import FileUpload from '$lib/components/FileUpload.svelte';
	import Button from '$lib/components/Button.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Features from '$lib/components/Features.svelte';
	import PhotoCanvas from '$lib/components/PhotoCanvas.svelte';
	import ControlsPanel from '$lib/components/ControlsPanel.svelte';
	import { createPhotoEditorStore } from '$lib/stores/photoEditor.svelte.js';
	import { setupCanvas, drawImage, downloadImage } from '$lib/utils/canvasUtils.js';
	import { applyFilters, loadImage } from '$lib/utils/imageProcessing.js';
	import { startDrawing, draw, stopDrawing } from '$lib/utils/drawingUtils.js';

	// Create the photo editor store
	const store = createPhotoEditorStore();

	// Main image handling functions
	async function handleFileUpload(files: File[]) {
		const file = files[0];
		if (file) {
			await handleImageLoad(file);
		}
	}

	async function handleImageLoad(file: File) {
		try {
			const image = await loadImage(file);
			store.setImage(image);
			store.setShowControls(true);

			// Use setTimeout to ensure DOM has updated with the new canvas element
			setTimeout(async () => {
				await setupCanvas(store, () => drawImageWrapper());
			}, 0);
		} catch (error) {
			console.error('Error loading image:', error);
		}
	}

	// Wrapper functions for store integration
	function drawImageWrapper() {
		drawImage(store, () => applyFilters(store));
	}

	function updateImage() {
		store.scheduleUpdate(() => drawImageWrapper());
	}

	function updateImageImmediate() {
		drawImageWrapper();
	}

	// Drawing event handlers
	function handleStartDrawing(event: MouseEvent) {
		startDrawing(event, store);
	}

	function handleDraw(event: MouseEvent) {
		draw(event, store);
	}

	function handleStopDrawing() {
		stopDrawing(store);
	}

	// Control handlers
	function handleReset() {
		store.reset();
		drawImageWrapper();
	}

	function handleDownload() {
		downloadImage(store.canvas);
	}

	function handleNewImage() {
		store.newImage();
	}

	function handleFilterChange(filter: 'none' | 'grayscale' | 'sepia' | 'invert') {
		store.setActiveFilter(filter);
		updateImageImmediate();
	}

	function handleDrawingModeToggle() {
		store.setDrawingMode(!store.drawingMode);
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
	<Header />

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if !store.showControls}
			<!-- Upload Section -->
			<div class="py-12">
				<div class="mb-12 text-center">
					<h2 class="mb-4 text-4xl font-bold text-gray-900">Edit Photos Online, Instantly</h2>
					<p class="mx-auto max-w-2xl text-xl text-gray-600">
						Professional photo editing tools right in your browser.
					</p>
					<p class="mx-auto max-w-2xl text-xl text-gray-600">
						No downloads, no accounts, just pure creativity.
					</p>
				</div>

				<Features />

				<div class="mx-auto max-w-2xl">
					<FileUpload onUpload={handleFileUpload} class="mb-8" />
				</div>
			</div>
		{:else}
			<!-- Editor Interface -->
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-bold text-gray-900">Edit Your Photo</h2>
				<Button variant="outline" size="sm" onclick={handleNewImage}>Upload New Photo</Button>
			</div>

			<div class="grid gap-6 lg:grid-cols-4 lg:gap-8">
				<!-- Canvas Area -->
				<div class="order-2 lg:order-1 lg:col-span-3">
					<PhotoCanvas
						drawingMode={store.drawingMode}
						onStartDrawing={handleStartDrawing}
						onDraw={handleDraw}
						onStopDrawing={handleStopDrawing}
						onReset={handleReset}
						onDownload={handleDownload}
						onCanvasMount={(canvas) => store.setCanvas(canvas)}
					/>
				</div>

				<!-- Controls Panel -->
				<div class="order-1 lg:order-2 lg:col-span-1">
					<ControlsPanel
						bind:brightness={store.brightness}
						bind:contrast={store.contrast}
						bind:rotation={store.rotation}
						activeFilter={store.activeFilter}
						drawingMode={store.drawingMode}
						bind:brushSize={store.brushSize}
						bind:brushColor={store.brushColor}
						onBrightnessChange={updateImage}
						onContrastChange={updateImage}
						onRotationChange={updateImage}
						onFilterChange={handleFilterChange}
						onDrawingModeToggle={handleDrawingModeToggle}
					/>
				</div>
			</div>
		{/if}
	</main>

	<Footer />
</div>
