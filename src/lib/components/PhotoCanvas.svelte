<script lang="ts">
	type Props = {
		drawingMode: boolean;
		onStartDrawing: (event: MouseEvent) => void;
		onDraw: (event: MouseEvent) => void;
		onStopDrawing: () => void;
		onCanvasMount?: (canvas: HTMLCanvasElement) => void;
	};

	let { drawingMode, onStartDrawing, onDraw, onStopDrawing, onCanvasMount }: Props = $props();

	let canvas: HTMLCanvasElement;

	$effect(() => {
		if (canvas && onCanvasMount) {
			onCanvasMount(canvas);
		}
	});
</script>

<div class="rounded-lg bg-white p-6 shadow-lg">
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
