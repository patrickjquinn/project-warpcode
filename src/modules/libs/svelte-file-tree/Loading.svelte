<script>
	import Icon from 'svelte-awesome'
	import { spinner } from 'svelte-awesome/icons'
</script>

<div>
	<Icon spin="{true}" data="{spinner}" />
	Loading...
</div>

<style>
	div {
		padding: 0.2rem;
		margin-left: 0.5rem;
		padding-left: 2rem;
		position: relative;
		color: gray;
	}
	div :global(svg) {
		position: absolute;
		left: 0.2rem;
		top: 0;
	}
</style>
