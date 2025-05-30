<script lang="ts">
  const { class: className = '', scroll = ''} = $props();
</script>

<div class="rounded-md border border-stone-500 bg-stone-100 p-4 shadow-md {scroll=='false' ? '' : 'overflow-y-auto'} {className}">
	<slot></slot>
</div>
