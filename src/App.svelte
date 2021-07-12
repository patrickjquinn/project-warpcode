<script lang="ts">
	import Canvas from './views/AppBuilder.svelte'
	import Launcher from './views/Launcher.svelte'
	import Router from 'svelte-spa-router'

</script>

<main>
	<Router
	routes="{{
		'/': Canvas,
		'/launch/': Launcher
	}}"
/>
</main>

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
