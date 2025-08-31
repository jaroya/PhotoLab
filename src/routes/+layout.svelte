<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { analytics } from '$lib/firebase/config';

	onMount(() => {
		if (analytics) {
			console.log('Firebase Analytics initialized');
		}
	});
</script>

<slot />
