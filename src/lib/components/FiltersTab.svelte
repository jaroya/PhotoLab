<script lang="ts">
	type FilterType =
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

	type Props = {
		activeFilter: FilterType;
		onFilterChange: (filter: FilterType) => void;
	};

	let { activeFilter, onFilterChange }: Props = $props();

	const filters: Array<{
		id: FilterType;
		label: string;
		preview: string;
		description: string;
	}> = [
		{
			id: 'none',
			label: 'Original',
			preview: 'bg-gradient-to-br from-red-400 to-blue-500',
			description: 'No filter applied'
		},
		{
			id: 'grayscale',
			label: 'Grayscale',
			preview: 'bg-gradient-to-br from-gray-400 to-gray-600',
			description: 'Classic black and white'
		},
		{
			id: 'sepia',
			label: 'Sepia',
			preview: 'bg-gradient-to-br from-yellow-600 to-amber-800',
			description: 'Vintage brown tone'
		},
		{
			id: 'invert',
			label: 'Invert',
			preview: 'bg-gradient-to-br from-purple-400 to-cyan-400',
			description: 'Negative effect'
		},
		{
			id: 'vintage',
			label: 'Vintage',
			preview: 'bg-gradient-to-br from-amber-600 to-orange-800',
			description: 'Retro film look'
		},
		{
			id: 'cool',
			label: 'Cool',
			preview: 'bg-gradient-to-br from-blue-400 to-cyan-600',
			description: 'Blue tint for calmness'
		},
		{
			id: 'warm',
			label: 'Warm',
			preview: 'bg-gradient-to-br from-orange-400 to-red-500',
			description: 'Orange tint for warmth'
		},
		{
			id: 'dramatic',
			label: 'Dramatic',
			preview: 'bg-gradient-to-br from-gray-900 to-gray-700',
			description: 'High contrast mood'
		},
		{
			id: 'soft',
			label: 'Soft',
			preview: 'bg-gradient-to-br from-pink-200 to-purple-300',
			description: 'Gentle pastel look'
		},
		{
			id: 'vivid',
			label: 'Vivid',
			preview: 'bg-gradient-to-br from-green-400 to-blue-500',
			description: 'Enhanced colors'
		},
		{
			id: 'noir',
			label: 'Noir',
			preview: 'bg-gradient-to-br from-gray-800 to-black',
			description: 'Film noir style'
		},
		{
			id: 'sunset',
			label: 'Sunset',
			preview: 'bg-gradient-to-br from-yellow-400 to-red-600',
			description: 'Golden hour warmth'
		},
		{
			id: 'arctic',
			label: 'Arctic',
			preview: 'bg-gradient-to-br from-blue-100 to-blue-300',
			description: 'Cool winter tones'
		},
		{
			id: 'emerald',
			label: 'Emerald',
			preview: 'bg-gradient-to-br from-green-400 to-emerald-600',
			description: 'Rich green tint'
		},
		{
			id: 'rose',
			label: 'Rose',
			preview: 'bg-gradient-to-br from-pink-400 to-rose-600',
			description: 'Romantic pink tone'
		},
		{
			id: 'cyberpunk',
			label: 'Cyberpunk',
			preview: 'bg-gradient-to-br from-purple-500 to-cyan-400',
			description: 'Neon futuristic look'
		}
	];
</script>

<div class="space-y-4">
	<h3 class="text-lg font-medium text-gray-900">Image Filters</h3>

	<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
				{filters.find((f) => f.id === activeFilter)?.description}
			</p>
		</div>
	{/if}
</div>
