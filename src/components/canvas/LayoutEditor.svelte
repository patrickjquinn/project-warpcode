<script lang="ts">
	import selected from './stores/selected'
	import EditorInput from './EditorInput.svelte'
	import { onMount } from 'svelte'
	import { CodeMap } from '../../modules/warp/codeMap/index'

	let style: { [x: string]: any; display: any }
	let localSelect: any

	$: (style) => {
		let codeMap = new CodeMap('ts')
		localSelect = $selected
		if (localSelect) {
			const localStyle: any = localSelect.style
			if (style && codeMap.validateCssString(codeMap.convertJSONToCSS(localStyle))) {
				if (localSelect.style.hasOwnProperty(`:global(#${localSelect.widget}${localSelect.id})`)) {
					localSelect.style[`:global(#${localSelect.widget}${localSelect.id})`] = style
				} else {
					localSelect.style[`#${localSelect.widget}${localSelect.id}`] = style
				}
				selected.update((select) => localSelect)
			}
		}
	}

	onMount(async () => {
		const localSelect: any = $selected

		if (localSelect && localSelect.style) {
			if (localSelect.style.hasOwnProperty(`:global(#${localSelect.widget}${localSelect.id})`)) {
				style = localSelect.style[`:global(#${localSelect.widget}${localSelect.id})`]
			} else if (localSelect.style.hasOwnProperty(`#${localSelect.widget}${localSelect.id}`)) {
				style = localSelect.style[`#${localSelect.widget}${localSelect.id}`]
			}
		}
	})
</script>

<main>
	{#if style}
		<form class="content" on:submit="{(e) => e.preventDefault()}">
			<EditorInput type="text" label="Left" bind:value="{style['margin-left']}" />
			<EditorInput type="text" label="Right" bind:value="{style['margin-right']}" />
			<EditorInput type="text" label="Bottom" bind:value="{style['marin-bottom']}" />
			<EditorInput type="text" label="Top" bind:value="{style['margin-top']}" />
			<EditorInput type="text" label="Width" bind:value="{style['width']}" />
			<EditorInput type="text" label="Height" bind:value="{style['height']}" />
			{#if localSelect?.meta?.container}
				<EditorInput type="text" label="Display" bind:value="{style.display}" />
			{/if}
		</form>
	{/if}
</main>

<style>
	.content {
		display: block;
		color: white;
	}
</style>
