<script lang="ts">
	import { onMount } from 'svelte'
	import { CodeMap } from '../../../modules/warp/codeMap/index'

	export let css: Record<string,unknown>
	export let id: string

	let codeMap = new CodeMap('ts')
	let styled: string
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
		background-color: gray;
		width: 100%;
		height: 10rem;
		min-height: 3.125rem;
		overflow: scroll;
		resize: both;
	}
</style>
