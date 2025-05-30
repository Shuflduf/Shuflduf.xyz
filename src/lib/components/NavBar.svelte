<script>
	import Box from "./Box.svelte";

</script>
<Box class="p-6 flex flex-row justify-between">
  <ul class="flex gap-8">
    <li class="relative hover-underline-animation hover:-translate-y-0.5 transition">
      <a href="/home" class="font-[Arvo] text-lg">Home</a>
    </li>
    <li class="relative hover-underline-animation hover:-translate-y-0.5 transition">
      <a href="/about" class="font-[Arvo] text-lg">About</a>
    </li>
    <li class="relative hover-underline-animation hover:-translate-y-0.5 transition">
      <a href="/projects" class="font-[Arvo] text-lg">Projects</a>
    </li>
  </ul>
  <ul class="flex flex-row gap-4">
    <li><img src="assets/icons/dark_mode.svg" alt="Dark mode" class="brightness-0"></li>
    <li><img src="assets/icons/search.svg" alt="Search" class="brightness-0"></li>
  </ul>
</Box>

<style>
/* stolen from somewhere */
.hover-underline-animation::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #2b7fff;
  transform-origin: bottom right;
  transition: transform 0.1s ease-out;
}
.hover-underline-animation:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
</style>
