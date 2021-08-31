<script lang="ts">
	import { onMount } from 'svelte'
	import { CodeMap } from '../../../modules/warp/codeMap/index'

	export let id: string
	export let src: string
	export let css: Record<string, unknown>

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

<img style="{styled}" src="{src}" alt="img" id="{id}" />

<style>
	img {
		background-color: lightgray;
		width: 100%;
		height: 10rem;
		resize: both;
		aspect-ratio: auto 1 / 1;
	}
</style>
