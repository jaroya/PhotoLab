<script lang="ts">
	type Props = {
		activeFilter: 'none' | 'grayscale' | 'sepia' | 'invert';
		onFilterChange: (filter: 'none' | 'grayscale' | 'sepia' | 'invert') => void;
	};

	let { activeFilter, onFilterChange }: Props = $props();

	const filters: Array<{
		id: 'none' | 'grayscale' | 'sepia' | 'invert';
		label: string;
		preview: string;
	}> = [
		{ id: 'none', label: 'Original', preview: 'bg-gradient-to-br from-red-400 to-blue-500' },
		{
			id: 'grayscale',
			label: 'Grayscale',
			preview: 'bg-gradient-to-br from-gray-400 to-gray-600'
		},
		{ id: 'sepia', label: 'Sepia', preview: 'bg-gradient-to-br from-yellow-600 to-amber-800' },
		{ id: 'invert', label: 'Invert', preview: 'bg-gradient-to-br from-purple-400 to-cyan-400' }
	];
</script>

<div class="space-y-4">
	<h3 class="text-lg font-medium text-gray-900">Image Filters</h3>

	<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
		{#each filters as filter (filter.id)}
			<div
				class="group flex cursor-pointer flex-col items-center space-y-2 rounded-lg border-2 p-4 transition-all hover:shadow-md {activeFilter ===
				filter.id
					? 'border-blue-500 bg-blue-50'
					: 'border-gray-200 hover:border-gray-300'}"
				role="button"
				tabindex="0"
				onclick={() => onFilterChange(filter.id)}
				onkeydown={(e) => (e.key === 'Enter' || e.key === ' ' ? onFilterChange(filter.id) : null)}
			>
				<!-- Filter Preview -->
				<div
					class="h-12 w-12 rounded-lg shadow-sm ring-1 ring-black/5 {filter.preview} {filter.id ===
					'grayscale'
						? 'grayscale'
						: filter.id === 'sepia'
							? 'sepia'
							: filter.id === 'invert'
								? 'invert'
								: ''}"
				></div>

				<!-- Filter Label -->
				<span
					class="text-sm font-medium transition-colors {activeFilter === filter.id
						? 'text-blue-700'
						: 'text-gray-700 group-hover:text-gray-900'}"
				>
					{filter.label}
				</span>
			</div>
		{/each}
	</div>

	<!-- Filter Info -->
	{#if activeFilter !== 'none'}
		<div class="rounded-lg bg-blue-50 p-3">
			<p class="text-sm text-blue-700">
				{#if activeFilter === 'grayscale'}
					Removes color information, creating a black and white image.
				{:else if activeFilter === 'sepia'}
					Applies a warm, vintage brown tone effect.
				{:else if activeFilter === 'invert'}
					Inverts all colors, creating a negative effect.
				{/if}
			</p>
		</div>
	{/if}
</div>
