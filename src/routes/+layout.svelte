<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}
