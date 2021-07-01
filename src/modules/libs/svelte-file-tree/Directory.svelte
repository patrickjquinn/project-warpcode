<script>
	import Icon from 'svelte-awesome'
	import { caretRight, caretDown, folder, folderOpen } from 'svelte-awesome/icons'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let opened = false
	export let directory = ''
</script>

<button on:click="{() => dispatch(opened ? 'close' : 'open')}">
	<Icon data="{opened ? caretDown : caretRight}" class="caret" />
	<Icon data="{opened ? folderOpen : folder}" class="folder" />
	{directory}
</button>

<style>
	button:hover {
		background-color: #dddddd;
		color: black;
	}
	button :global(svg.caret) {
		width: 0.6rem;
		padding-right: 0;
	}
	button :global(svg.folder) {
		width: 1.2rem;
		height: 1rem;
	}
</style>
