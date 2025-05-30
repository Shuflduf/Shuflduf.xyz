<script lang="ts">
  const { class: className = '' } = $props();
</script>

<div class="rounded-md border border-stone-500 bg-stone-100 p-4 shadow-md overflow-y-auto {className}">
	<slot></slot>
</div>
