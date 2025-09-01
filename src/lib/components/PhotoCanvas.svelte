<script lang="ts">
	import type { PhotoEditorStore } from '../stores/photoEditor.svelte.js';
	import { startDrawing, draw, stopDrawing } from '../utils/drawingUtils.js';

	type Props = {
		store: PhotoEditorStore;
		onCanvasMount?: (canvas: HTMLCanvasElement) => void;
	};

	let { store, onCanvasMount }: Props = $props();

	let canvas: HTMLCanvasElement;
	let isPointerDown = $state(false);

	$effect(() => {
		if (canvas && onCanvasMount) {
			onCanvasMount(canvas);
		}
	});

	function handlePointerDown(event: PointerEvent) {
		isPointerDown = true;
		canvas.setPointerCapture(event.pointerId);
		startDrawing(event, store);
	}

	function handlePointerMove(event: PointerEvent) {
		if (isPointerDown) {
			draw(event, store);
		}
	}

	function handlePointerUp(event: PointerEvent) {
		if (isPointerDown) {
			isPointerDown = false;
			canvas.releasePointerCapture(event.pointerId);
			stopDrawing(store);
		}
	}

	function handlePointerCancel(event: PointerEvent) {
		if (isPointerDown) {
			isPointerDown = false;
			canvas.releasePointerCapture(event.pointerId);
			stopDrawing(store);
		}
	}
</script>

<div class="rounded-lg bg-white p-6 shadow-lg">
	<div class="flex justify-center overflow-auto rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
		<canvas
			bind:this={canvas}
			class="max-h-[50vh] max-w-full rounded border border-gray-300 shadow-sm sm:max-h-[60vh] lg:max-h-[70vh] cursor-{store.drawingMode
				? 'crosshair'
				: 'default'}"
			onpointerdown={handlePointerDown}
			onpointermove={handlePointerMove}
			onpointerup={handlePointerUp}
			onpointercancel={handlePointerCancel}
			aria-label="Photo editing canvas"
		></canvas>
	</div>
</div>
