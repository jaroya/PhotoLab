<script lang="ts">
	import Button from './Button.svelte';

	type Props = {
		drawingMode: boolean;
		onStartDrawing: (event: MouseEvent) => void;
		onDraw: (event: MouseEvent) => void;
		onStopDrawing: () => void;
		onReset: () => void;
		onDownload: () => void;
		onCanvasMount?: (canvas: HTMLCanvasElement) => void;
	};

	let {
		drawingMode,
		onStartDrawing,
		onDraw,
		onStopDrawing,
		onReset,
		onDownload,
		onCanvasMount
	}: Props = $props();

	let canvas: HTMLCanvasElement;

	$effect(() => {
		if (canvas && onCanvasMount) {
			onCanvasMount(canvas);
		}
	});
</script>

<div class="rounded-lg bg-white p-6 shadow-lg">
	<div class="mb-4 flex items-center justify-between">
		<h3 class="text-lg font-semibold text-gray-900">Canvas</h3>
		<div class="flex flex-wrap gap-2">
			<Button variant="secondary" size="sm" onclick={onReset}>Reset</Button>
			<Button variant="primary" size="sm" onclick={onDownload}>
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

	<div class="flex justify-center overflow-auto rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
		<canvas
			bind:this={canvas}
			class="max-h-[50vh] max-w-full rounded border border-gray-300 shadow-sm sm:max-h-[60vh] lg:max-h-[70vh] cursor-{drawingMode
				? 'crosshair'
				: 'default'}"
			onmousedown={onStartDrawing}
			onmousemove={onDraw}
			onmouseup={onStopDrawing}
			onmouseleave={onStopDrawing}
			aria-label="Photo editing canvas"
		></canvas>
	</div>
</div>
