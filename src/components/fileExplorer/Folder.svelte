<script lang="ts">
	import File from './File.svelte'
	import { slide } from 'svelte/transition'

	export let expanded = false
	export let root = false
	export let name: string
	export let children: Array<any>

	function toggle() {
		expanded = !expanded
	}
</script>

<span class:expanded on:click="{toggle}">{name}</span>

{#if expanded}
	<ul transition:slide="{{ duration: 300 }}">
		{#each children as file}
			<li>
				{#if file.type === 'directory'}
					<svelte:self {...file} />
				{:else}
					<File {...file} />
				{/if}
			</li>
		{/each}
	</ul>
{:else if root && children?.length > 0}
	<ul transition:slide="{{ duration: 300 }}">
		{#each children as file}
			<li>
				{#if file.type === 'directory'}
					<svelte:self {...file} />
				{:else}
					<File {...file} />
				{/if}
			</li>
		{/each}
	</ul>
{/if}

<style>
	span {
		padding: 0 0 0 1.5em;
		background: url(https://svelte.dev/tutorial/icons/folder.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
		color: white;
	}

	.expanded {
		background-image: url(https://svelte.dev/tutorial/icons/folder-open.svg);
	}

	ul {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
	}

	li {
		padding: 0.2em 0;
		color: white;
	}
</style>
