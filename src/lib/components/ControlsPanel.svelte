<script lang="ts">
	import Button from './Button.svelte';

	type Props = {
		brightness: number;
		contrast: number;
		rotation: number;
		activeFilter: 'none' | 'grayscale' | 'sepia' | 'invert';
		drawingMode: boolean;
		brushSize: number;
		brushColor: string;
		onBrightnessChange: () => void;
		onContrastChange: () => void;
		onRotationChange: () => void;
		onFilterChange: (filter: 'none' | 'grayscale' | 'sepia' | 'invert') => void;
		onDrawingModeToggle: () => void;
	};

	let {
		brightness = $bindable(),
		contrast = $bindable(),
		rotation = $bindable(),
		activeFilter,
		drawingMode,
		brushSize = $bindable(),
		brushColor = $bindable(),
		onBrightnessChange,
		onContrastChange,
		onRotationChange,
		onFilterChange,
		onDrawingModeToggle
	}: Props = $props();
</script>

<div class="space-y-6 rounded-lg bg-white p-6 shadow-lg">
	<!-- Adjustments -->
	<div>
		<h3 class="mb-4 text-lg font-medium text-gray-900">Adjustments</h3>
		<div class="space-y-4">
			<div>
				<label for="brightness-slider" class="mb-2 block text-sm font-medium text-gray-700">
					Brightness: {brightness}
				</label>
				<input
					id="brightness-slider"
					type="range"
					min="-100"
					max="100"
					bind:value={brightness}
					oninput={onBrightnessChange}
					class="w-full"
				/>
			</div>

			<div>
				<label for="contrast-slider" class="mb-2 block text-sm font-medium text-gray-700">
					Contrast: {contrast}
				</label>
				<input
					id="contrast-slider"
					type="range"
					min="-100"
					max="100"
					bind:value={contrast}
					oninput={onContrastChange}
					class="w-full"
				/>
			</div>

			<div>
				<label for="rotation-slider" class="mb-2 block text-sm font-medium text-gray-700">
					Rotation: {rotation}°
				</label>
				<input
					id="rotation-slider"
					type="range"
					min="0"
					max="360"
					bind:value={rotation}
					oninput={onRotationChange}
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
				onclick={() => onFilterChange('none')}
			>
				None
			</button>
			<button
				class="rounded-lg border-2 p-2 text-sm font-medium transition-colors {activeFilter ===
				'grayscale'
					? 'border-blue-500 bg-blue-50 text-blue-700'
					: 'border-gray-300 hover:bg-gray-50'}"
				onclick={() => onFilterChange('grayscale')}
			>
				Grayscale
			</button>
			<button
				class="rounded-lg border-2 p-2 text-sm font-medium transition-colors {activeFilter ===
				'sepia'
					? 'border-blue-500 bg-blue-50 text-blue-700'
					: 'border-gray-300 hover:bg-gray-50'}"
				onclick={() => onFilterChange('sepia')}
			>
				Sepia
			</button>
			<button
				class="rounded-lg border-2 p-2 text-sm font-medium transition-colors {activeFilter ===
				'invert'
					? 'border-blue-500 bg-blue-50 text-blue-700'
					: 'border-gray-300 hover:bg-gray-50'}"
				onclick={() => onFilterChange('invert')}
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
			onclick={onDrawingModeToggle}
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
					<label for="brush-size-slider" class="mb-2 block text-sm font-medium text-gray-700">
						Brush Size: {brushSize}px
					</label>
					<input
						id="brush-size-slider"
						type="range"
						min="1"
						max="50"
						bind:value={brushSize}
						class="w-full"
					/>
				</div>

				<div>
					<label for="brush-color-picker" class="mb-2 block text-sm font-medium text-gray-700"
						>Color</label
					>
					<input
						id="brush-color-picker"
						type="color"
						bind:value={brushColor}
						class="h-10 w-full cursor-pointer rounded border border-gray-300"
					/>
				</div>
			</div>
		</div>
	{/if}
</div>
