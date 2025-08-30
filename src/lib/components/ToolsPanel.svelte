<script lang="ts">
	import AdjustTab from './AdjustTab.svelte';
	import FiltersTab from './FiltersTab.svelte';
	import DrawTab from './DrawTab.svelte';

	type Props = {
		brightness: number;
		contrast: number;
		rotation: number;
		saturation: number;
		vibrance: number;
		exposure: number;
		highlights: number;
		shadows: number;
		whites: number;
		blacks: number;
		clarity: number;
		dehaze: number;
		activeFilter:
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
			| 'cyberpunk';
		drawingMode: boolean;
		brushSize: number;
		brushColor: string;
		onBrightnessChange: () => void;
		onContrastChange: () => void;
		onRotationChange: () => void;
		onSaturationChange: () => void;
		onVibranceChange: () => void;
		onExposureChange: () => void;
		onHighlightsChange: () => void;
		onShadowsChange: () => void;
		onWhitesChange: () => void;
		onBlacksChange: () => void;
		onClarityChange: () => void;
		onDehazeChange: () => void;
		onFilterChange: (
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
		) => void;
		onDrawingModeToggle: () => void;
	};

	let {
		brightness = $bindable(),
		contrast = $bindable(),
		rotation = $bindable(),
		saturation = $bindable(),
		vibrance = $bindable(),
		exposure = $bindable(),
		highlights = $bindable(),
		shadows = $bindable(),
		whites = $bindable(),
		blacks = $bindable(),
		clarity = $bindable(),
		dehaze = $bindable(),
		activeFilter,
		drawingMode,
		brushSize = $bindable(),
		brushColor = $bindable(),
		onBrightnessChange,
		onContrastChange,
		onRotationChange,
		onSaturationChange,
		onVibranceChange,
		onExposureChange,
		onHighlightsChange,
		onShadowsChange,
		onWhitesChange,
		onBlacksChange,
		onClarityChange,
		onDehazeChange,
		onFilterChange,
		onDrawingModeToggle
	}: Props = $props();

	let activeTab = $state('adjust');

	function handleTabClick(tabId: string) {
		activeTab = tabId;
	}

	const tabs = [
		{
			id: 'adjust',
			label: 'Adjust',
			icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
		},
		{
			id: 'filters',
			label: 'Filters',
			icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
		},
		{
			id: 'draw',
			label: 'Draw',
			icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
		}
	];
</script>

<div class="rounded-lg border border-gray-200 bg-white shadow-lg">
	<!-- Tab Headers -->
	<div class="border-b border-gray-200 bg-white">
		<nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
			{#each tabs as tab (tab.id)}
				<button
					class="flex items-center border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
					tab.id
						? 'border-blue-500 text-blue-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
					onclick={() => handleTabClick(tab.id)}
				>
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={tab.icon} />
					</svg>
					{tab.label}
				</button>
			{/each}
		</nav>
	</div>

	<!-- Tab Content -->
	<div class="bg-white p-6">
		{#if activeTab === 'adjust'}
			<AdjustTab
				bind:brightness
				bind:contrast
				bind:rotation
				bind:saturation
				bind:vibrance
				bind:exposure
				bind:highlights
				bind:shadows
				bind:whites
				bind:blacks
				bind:clarity
				bind:dehaze
				{onBrightnessChange}
				{onContrastChange}
				{onRotationChange}
				{onSaturationChange}
				{onVibranceChange}
				{onExposureChange}
				{onHighlightsChange}
				{onShadowsChange}
				{onWhitesChange}
				{onBlacksChange}
				{onClarityChange}
				{onDehazeChange}
			/>
		{:else if activeTab === 'filters'}
			<FiltersTab {activeFilter} {onFilterChange} />
		{:else if activeTab === 'draw'}
			<DrawTab {drawingMode} bind:brushSize bind:brushColor {onDrawingModeToggle} />
		{/if}
	</div>
</div>
