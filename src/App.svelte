<script lang="ts">
	import Canvas from './views/Canvas.svelte'
</script>

<main>
	<Canvas />
</main>

<script>
	import Explorer from '@saibotsivad/svelte-file-tree-explorer'
	const fileTree = [
		// file tree
	]
</script>

<Explorer tree={fileTree} />

<style>
	:root {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}
	main {
		width: 100vw;
		height: 100vh;
	}
</style>
