<script lang="ts">
	import Button from './Button.svelte';

	type Props = {
		drawingMode: boolean;
		brushSize: number;
		brushColor: string;
		onDrawingModeToggle: () => void;
	};

	let {
		drawingMode,
		brushSize = $bindable(),
		brushColor = $bindable(),
		onDrawingModeToggle
	}: Props = $props();

	const presetColors = [
		'#000000',
		'#ffffff',
		'#ff0000',
		'#00ff00',
		'#0000ff',
		'#ffff00',
		'#ff00ff',
		'#00ffff',
		'#ff8000',
		'#8000ff',
		'#ff0080',
		'#80ff00',
		'#0080ff',
		'#ff8080',
		'#80ff80',
		'#8080ff'
	];
</script>

<div class="space-y-6">
	<!-- Drawing Mode Toggle -->
	<div class="flex items-center justify-between">
		<h3 class="text-lg font-medium text-gray-900">Drawing Tools</h3>
		<Button variant={drawingMode ? 'primary' : 'outline'} size="sm" onclick={onDrawingModeToggle}>
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
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Brush Size -->
			<div>
				<label for="brush-size-slider" class="mb-3 block text-sm font-medium text-gray-700">
					Brush Size
				</label>
				<div class="space-y-3">
					<input
						id="brush-size-slider"
						type="range"
						min="1"
						max="50"
						bind:value={brushSize}
						class="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
					/>
					<div class="flex items-center justify-between">
						<span class="text-xs text-gray-500">1px</span>
						<div class="flex items-center space-x-2">
							<div
								class="rounded-full border border-gray-300"
								style="width: {Math.min(brushSize, 20)}px; height: {Math.min(
									brushSize,
									20
								)}px; background-color: {brushColor};"
							></div>
							<span class="text-sm font-medium text-gray-900">{brushSize}px</span>
						</div>
						<span class="text-xs text-gray-500">50px</span>
					</div>
				</div>
			</div>

			<!-- Color Picker -->
			<div>
				<label for="brush-color-picker" class="mb-3 block text-sm font-medium text-gray-700">
					Brush Color
				</label>
				<div class="space-y-3">
					<!-- Custom Color Picker -->
					<input
						id="brush-color-picker"
						type="color"
						bind:value={brushColor}
						class="h-12 w-full cursor-pointer rounded-lg border border-gray-300"
					/>

					<!-- Preset Colors -->
					<div class="grid grid-cols-8 gap-2">
						{#each presetColors as color (color)}
							<button
								class="h-8 w-8 rounded-lg border-2 transition-all hover:scale-110 {brushColor ===
								color
									? 'border-gray-900 ring-2 ring-blue-500'
									: 'border-gray-300 hover:border-gray-400'}"
								style="background-color: {color};"
								onclick={() => (brushColor = color)}
								aria-label="Select {color} color"
							></button>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Drawing Instructions -->
		<div class="rounded-lg bg-green-50 p-4">
			<div class="flex">
				<svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<div class="ml-3">
					<p class="text-sm text-green-700">
						<strong>Drawing active!</strong> Click and drag on the canvas to draw. Use the brush size
						and color controls above to customize your strokes.
					</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="rounded-lg bg-gray-50 p-8 text-center">
			<svg
				class="mx-auto h-12 w-12 text-gray-400"
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
			<p class="mt-2 text-sm text-gray-600">
				Enable drawing mode to add annotations, highlights, or artistic touches to your image.
			</p>
		</div>
	{/if}
</div>

<style>
	.slider::-webkit-slider-thumb {
		appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #2563eb;
		cursor: pointer;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.slider::-moz-range-thumb {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #2563eb;
		cursor: pointer;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
