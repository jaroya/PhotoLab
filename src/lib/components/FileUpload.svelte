<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Props {
		accept?: string;
		multiple?: boolean;
		class?: string;
	}

	let { accept = 'image/*', multiple = false, class: className = '' }: Props = $props();

	const dispatch = createEventDispatcher<{
		upload: File[];
	}>();

	let dragActive = $state(false);
	let fileInput: HTMLInputElement;

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			handleFiles(Array.from(target.files));
		}
	}

	function handleFiles(files: File[]) {
		const imageFiles = files.filter((file) => file.type.startsWith('image/'));
		if (imageFiles.length > 0) {
			dispatch('upload', imageFiles);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragActive = false;

		if (event.dataTransfer?.files) {
			handleFiles(Array.from(event.dataTransfer.files));
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function handleDragEnter(event: DragEvent) {
		event.preventDefault();
		dragActive = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		if (!(event.currentTarget as Element)?.contains(event.relatedTarget as Node)) {
			dragActive = false;
		}
	}
</script>

<div
	class="relative rounded-lg border-2 border-dashed p-8 text-center transition-colors {dragActive
		? 'border-blue-400 bg-blue-50'
		: 'border-gray-300 hover:border-gray-400'} {className}"
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	role="button"
	tabindex="0"
	onclick={() => fileInput.click()}
	onkeydown={(e) => e.key === 'Enter' && fileInput.click()}
>
	<input
		bind:this={fileInput}
		type="file"
		{accept}
		{multiple}
		onchange={handleFileSelect}
		class="hidden"
	/>

	<div class="space-y-4">
		<div class="flex justify-center">
			<div
				class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 {dragActive
					? 'bg-blue-100'
					: ''}"
			>
				<svg
					class="h-8 w-8 text-gray-400 {dragActive ? 'text-blue-500' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/>
				</svg>
			</div>
		</div>

		<div>
			<p class="text-lg font-medium text-gray-700">
				{dragActive ? 'Drop your images here' : 'Upload your photos'}
			</p>
			<p class="mt-1 text-sm text-gray-500">Drag and drop or click to select files</p>
			<p class="mt-2 text-xs text-gray-400">Supports JPG, PNG, GIF, WEBP</p>
		</div>
	</div>
</div>
