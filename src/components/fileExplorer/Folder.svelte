<script lang="ts">
	import File from './File.svelte'
	import { slide } from 'svelte/transition'
	import activeDirectory from '../../stores/activeDirectory'

	export let expanded = false
	export let root = false
	export let name: string
	export let children: Array<any>
	export let path: string

	const folderSelected = () => {
		toggle()
		activeDirectory.update((dir) => path)
	}

	function toggle() {
		expanded = !expanded
	}
</script>

<span class:expanded="{expanded}" on:click="{root ? null : folderSelected}">{name}</span>

{#if expanded}
	<ul transition:slide="{{ duration: 150 }}">
		{#each children as file}
			<li>
				{#if file.type === 'directory' || file.children}
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
				{#if file.type === 'directory' || file.children}
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
		background: url(/static/assets/folder.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
		color: white;
	}

	.expanded {
		background-image: url(/static/assets/folder-open.svg);
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
