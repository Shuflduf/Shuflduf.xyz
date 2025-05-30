<script>
	import Box from '$lib/components/Box.svelte';
	import NavBar from '$lib/components/NavBar.svelte';

	const news = [
		{ date: 'May 23, 2025', title: 'Introducing Macintosh' },
		{ date: 'May 16, 2025', title: 'Abandoned Microsoftf' },
		{ date: 'May 9, 2025', title: 'New Game Release' },
		{ date: 'May 2, 2025', title: 'Community Event' },
		{ date: 'April 25, 2025', title: 'Update on Project X' },
		{ date: 'April 18, 2025', title: 'Behind the Scenes' },
		{ date: 'April 11, 2025', title: 'Developer Interview' },
		{ date: 'April 4, 2025', title: 'Game Mechanics Explained' },
		{ date: 'March 28, 2025', title: 'Art Style Showcase' },
		{ date: 'March 21, 2025', title: 'Soundtrack Preview' }
	];
</script>

<section class="flex h-screen w-screen flex-col gap-4 p-4">
	<NavBar />
	<div class="flex flex-1 flex-row gap-4 overflow-hidden">
		<Box class="w-3xl overflow-y-auto">
			<h1 class="mb-4 text-3xl font-[Arvo] font-bold">Shuflduf.xyz</h1>
			{#each Array.from({ length: 20 })}
				<p class="mb-2">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus magnam ipsum repudiandae
					pariatur iusto minima suscipit cumque ullam impedit quaerat quae dolorum, iure molestias
					non, expedita adipisci officiis laborum magni.
				</p>
			{/each}
		</Box>
		<div class="flex flex-grow flex-col gap-4">
			<Box class="flex-1">
				<h2 class="mb-2 font-[Arvo] text-xl">Recent Updates</h2>
				{#each news as item}
					<p><span class="text-stone-400">{item.date}</span> · {item.title}</p>
				{/each}
			</Box>
			<Box class="flex-1" scroll="false">
				<h2 class="mb-2 font-[Arvo] text-xl">Featured Project</h2>
				<div class="flex flex-row gap-4 items-center">
					<img
						src="/assets/ror2.jpg"
						alt="Risk of Rain 2"
						class="max-h-48 w-auto object-contain rounded-md shadow-md"
					/>
					<div class="min-h-0 flex-1 w-md">
						<h3 class="text-lg font-bold">Risk of Rain 2</h3>
						<p class="line-clamp-2 break-all">
							Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat eos provident adipisci consequatur eius, eligendi quidem dolor architecto aut nam laudantium, incidunt, magni ipsum molestiae voluptatum atque! Quaerat, corrupti veritatis.
						</p>
            <a href="/">
            <button class="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 cursor-pointer">
              Read More
            </button>
              </a>
            <a href="/">
            <button class="mt-2 ml-2 rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 cursor-pointer">
              Explore Project
            </button>
              </a>
					</div>
				</div>
			</Box>
		</div>
	</div>
</section>
