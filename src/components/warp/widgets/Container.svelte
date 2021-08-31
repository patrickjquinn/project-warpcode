<script lang="ts">
	import { onMount } from 'svelte'
	import { CodeMap } from '../../../modules/warp/codeMap/index'

	export let css: Record<string,unknown>
	export let id: string

	let codeMap = new CodeMap('ts')
	let styled
	let rendered = false

	$: {
		if (rendered) {
			styled = codeMap.convertCSSJSONtoInline(css, id)
		}
	}

	onMount(async () => {
		rendered = true
	})
</script>

<div id="{id}" style="{styled}"><slot /></div>

<style>
	div {
		background-color: lightgray;
		min-width: 3.125rem;
		height: 3.75rem;
		min-height: 5rem;
		overflow: hidden;
		resize: both;
	}
</style>
