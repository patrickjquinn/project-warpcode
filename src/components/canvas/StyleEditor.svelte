<script lang="ts">
	import selected from './stores/selected'
	import EditorInput from './EditorInput.svelte'
	import { onMount } from 'svelte'
	import { CodeMap } from '../../modules/warp/codeMap/index'

	const allowedStyleProps: Array<string> = [
		'color',
		'font-size',
		'font',
		'border',
		'background-color',
		'text-align',
		'cursor',
		'line-height',
		'text-shadow',
		'background-image'
	]

	let style: { [x: string]: any; color: any; border: any }

	$: {
		let codeMap = new CodeMap('ts')
		const localSelect: any = $selected
		if (localSelect){
			const localStyle: any = localSelect.style
			if (style && codeMap.validateCssString(codeMap.convertJSONToCSS(localStyle))) {
				const localSelect: any = $selected
				localSelect.style[`#${localSelect.widget}${localSelect.id}`] = style
				selected.update((select) => {
					return localSelect
				})
			}
		}
		
	}

	onMount(async () => {
		const localSelect: any = $selected

		if (localSelect && localSelect.style) {
			style = localSelect.style[`#${localSelect.widget}${localSelect.id}`]
		}
	})

	const checkIsStyle = (key: string) => {
		if (allowedStyleProps.includes(key.toLowerCase())) return true
		return false
	}
</script>

<main>
	{#if style}
		<form class="content" on:submit="{(e) => e.preventDefault()}">
			<EditorInput type="text" label="Color" bind:value="{style.color}" />
			<EditorInput type="text" label="Background Color" bind:value="{style['background-color']}" />
			<EditorInput type="text" label="Border" bind:value="{style.border}" />
			<EditorInput type="text" label="Border Radius" bind:value="{style['border-radius']}" />
			<EditorInput type="text" label="Font Weight" bind:value="{style['font-weight']}" />
			<EditorInput type="text" label="Text Align" bind:value="{style['text-align']}" />
			<EditorInput type="text" label="Line Height" bind:value="{style['line-height']}" />
		</form>
	{/if}
</main>

<style>
	.content {
		display: block;
		color: white;
	}
</style>
