<script>
	import { onMount } from 'svelte'

	const path = window.require('path')
	const fs = window.require('fs')

	const { ipcRenderer } = window.require('electron')

	let status

	let recent = []

	ipcRenderer.on('status', (event, stat) => {
		status = stat
	})

	ipcRenderer.on('recents-sent', (event, recents) => {
		recent = recents
	})

	ipcRenderer.on('project-open', (event, stat) => {
		console.log(stat, 'project-open', event)
	})

	const openExistingProject = (dir) => {
		ipcRenderer.send('open-existing-project', dir)
	}

	const createNewProject = () => {
		ipcRenderer.send('create-new-project')
	}

	onMount(async () => {
		await ipcRenderer.send('read-recents')
		// if (userData){
		// 	const file = path.join(userData, 'recent.json')
		// 	recent = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : null
		// }
	})
</script>

<main>
	<h1>Warp Code</h1>

	<div class="menu">
		<div class="left">
			<button class="large" on:click="{() => openExistingProject(null)}">Open project</button>

			{#each recent as dir}
				<button class="small" on:click="{() => openExistingProject(dir)}"
					>{path.basename(dir)}</button
				>
			{:else}
				<p>recent projects appear here</p>
			{/each}
		</div>

		<div class="right">
			<button class="large" on:click="{createNewProject}">Create project</button>

			{#if status}
				<p>{status}</p>
			{/if}
		</div>
	</div>
</main>

<style>
	:global(body) {
		user-select: none;
	}

	h1 {
		font-weight: 300;
		color: white;
		margin: 0 0 1em 0;
		text-transform: uppercase;
		padding-bottom: 10px;
	}

	main {
		padding: 1em;
		height: 100%;
		box-sizing: border-box;
	}

	p {
		color: white;
	}

	h1 {
		text-align: center;
		font-size: 3.2em;
		font-weight: 300;
		margin: 0 0 1em 0;
		border-bottom: 1px solid rgba(170, 30, 30, 0.4);
	}

	.menu {
		margin: 0 auto;
		max-width: 40em;
	}

	.left,
	.right {
		width: 50%;
		float: left;
		padding: 0.5em;
		box-sizing: border-box;
	}

	button {
		font-weight: normal;
		color: #333;
		border-radius: 4px;
	}

	.large {
		padding: 0.5em 2em;
		background-color: rgb(170, 30, 30);
		color: white;
		text-transform: uppercase;
		line-height: 1;
		border: none;
		outline: none;
		border-radius: 0.2em;
		font-family: inherit;
		font-size: 1.2em;
		font-weight: 300;
		width: 100%;
		margin: 0 0 0.5em 0;
	}

	.small {
		font-family: inherit;
		font-size: inherit;
		width: 100%;
		background: white;
		border: none;
		outline: none;
		text-align: left;
		padding: 0.4em 1em;
		border-radius: 0.2em;
		margin: 0 0 0.2em 0;
	}

	.small:hover {
		background-color: #f4f4f4;
		transition: background-color 0.2s;
	}
</style>
