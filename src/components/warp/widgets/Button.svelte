<script lang="ts">
	export let id
	let styles = {
		'note-bg-color': 'blue',
		'note-color': '#FF5555',
		bg: '#AAAAAA'
	}

	$: cssVarStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';')
</script>

<button id="{id}" contenteditable="true"><slot></slot></button>

<style>
	button {
		width: 85%;
		border-radius: 4;
		background-color: white;
		height: 40px;
		color: black;
	}
</style>
