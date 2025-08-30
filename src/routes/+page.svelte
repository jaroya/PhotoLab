<script lang="ts">
	import FileUpload from '$lib/components/FileUpload.svelte';
	import Button from '$lib/components/Button.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import PhotoCanvas from '$lib/components/PhotoCanvas.svelte';
	import ControlsPanel from '$lib/components/ControlsPanel.svelte';
	import FeaturesSection from '$lib/sections/FeaturesSection.svelte';
	import HowItWorksSection from '$lib/sections/HowItWorksSection.svelte';
	import PhotoEditingUseCasesSection from '$lib/sections/PhotoEditingUseCasesSection.svelte';
	import SupportedFormatsSection from '$lib/sections/SupportedFormatsSection.svelte';
	import PhotoEditingTipsSection from '$lib/sections/PhotoEditingTipsSection.svelte';
	import FAQSection from '$lib/sections/FAQSection.svelte';
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
	<title>PhotoLab - Free Online Photo Editor | Professional Image Editing Tools</title>
	<meta
		name="description"
		content="Professional photo editing tools right in your browser. Adjust brightness, contrast, apply filters, draw annotations, and more. Support for JPG, PNG, WebP, GIF. Fast, free, secure - no signup required."
	/>
	<meta
		name="keywords"
		content="photo editor, online photo editor, image editor, free photo editing, filters, brightness, contrast, image adjustments, photo filters, drawing tools, browser photo editor"
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
	<Header />

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if !store.showControls}
			<!-- Hero Section -->
			<div class="py-12">
				<div class="mb-12 text-center">
					<h1 class="mb-4 text-2xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
						Professional Photo Editor
					</h1>
					<p class="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
						Edit photos online with professional tools.<br />
						Fast, free, and secure - all processing happens in your browser.
					</p>
				</div>

				<div class="mx-auto max-w-2xl">
					<FileUpload onUpload={handleFileUpload} class="mb-8" />
				</div>

				<!-- New comprehensive content sections -->
				<FeaturesSection />
				<HowItWorksSection />
				<PhotoEditingUseCasesSection />
				<SupportedFormatsSection />
				<PhotoEditingTipsSection />
				<FAQSection />
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
