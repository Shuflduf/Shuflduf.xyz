<script lang="ts">
  import {page} from '$app/state';
	import { onMount } from 'svelte';
  const proj = page.params.proj;
  let data: any = $state()

  onMount(async () => {
    const res = await fetch("/api/getNotionTree", {
      method: "GET"
    })
    data = await res.json();
    data = data.projects;
    proj.split("/").forEach(element => {
      if (element && data[element] !== undefined) {
        data = data[element];
      }
    });
  });
</script>

{proj}
{#if data}
  <pre>{JSON.stringify(data, null, 2)}</pre>
  {#each Object.entries(data) as project}
    <div>
      <h2>{project[1].name}</h2>
    </div>
  {/each}
{:else}
  <p>Loading...</p>
{/if}
