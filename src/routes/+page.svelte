<script>
	import Box from '$lib/components/Box.svelte';
import NavBar from '$lib/components/NavBar.svelte';
</script>

<section class="flex h-screen w-screen flex-col gap-4 p-4">
	<NavBar />
	<div class="flex flex-row gap-4 flex-1 overflow-hidden">
		<Box class="w-3xl overflow-y-auto">
			<h1 class="mb-4 text-3xl">Shuflduf Gaming</h1>
			{#each Array.from({ length: 20 })}
				<p class="mb-2">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus magnam ipsum repudiandae
					pariatur iusto minima suscipit cumque ullam impedit quaerat quae dolorum, iure molestias
					non, expedita adipisci officiis laborum magni.
				</p>
			{/each}
		</Box>
		<div class="flex flex-col gap-4 flex-grow">
			<Box class="flex-1">
				<h2 class="font-[Arvo] text-xl">Recent Updates</h2>
			</Box>
			<Box class="flex-1">
				<h2 class="font-[Arvo] text-xl">Featured Project</h2>
			</Box>
		</div>
	</div>
</section>
