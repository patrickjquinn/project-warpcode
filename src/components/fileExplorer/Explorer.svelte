<script lang="ts">
	import Folder from './Folder.svelte'
	import { onMount } from 'svelte'

	const { ipcRenderer } = window.require('electron')
	const exclusionList = ['.gitignore', 'node_modules', '.routify', 'pnpm-lock.yaml', 'LICENSE']

	let files: Array<Record<string, unknown>>

	const filterByExclusions = (arg) => {
		const filtered = []
		for (let file of arg.children) {
			if (!exclusionList.includes(file.name) && file.name.charAt(0) !== '.' ) {
				if (file?.children?.length > 0){
					file = filterByExclusions(file)
				}
				filtered.push(file)
			}
		}
		arg.children = filtered
		return arg
	}

	ipcRenderer.on('send-proj-struct', (event, arg) => {
		files = filterByExclusions(arg)
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
