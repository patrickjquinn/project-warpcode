<script lang="ts">
	import Folder from './Folder.svelte'
	import { onMount } from 'svelte'

	const { ipcRenderer } = window.require('electron')

	let files: Array<Record<string, unknown>>

	ipcRenderer.on('send-proj-struct', (event, arg) => {
		files = arg
	})

	onMount(async () => {
		ipcRenderer.send('request-proj-struct')
	})
</script>

<main>
	<div>
		{#if files}
			<Folder
				name="{files['name']}"
				children="{files['children']}"
				expanded="{false}"
				root="{true}"
				path="{files['path']}"
			/>
		{/if}
	</div>
</main>

<style>
	main {
		height: 100%;
		width: 100%;
		background-color: #1e1e1e;
	}

	div {
		padding-left: 1rem;
		padding-top: 1rem;
	}
</style>
