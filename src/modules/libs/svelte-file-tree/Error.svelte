<script>
	import Icon from 'svelte-awesome'
	import { exclamationCircle } from 'svelte-awesome/icons'
	export let error = ''
</script>

<div>
	<Icon data="{exclamationCircle}" />
	there was an error {JSON.stringify(error)}
</div>

<style>
	div {
		margin-left: 1rem;
		padding-left: 1.5rem;
		position: relative;
	}
	div :global(svg) {
		position: absolute;
		left: 0;
		top: -0.2rem;
		color: red;
	}
</style>
