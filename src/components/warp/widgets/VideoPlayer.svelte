<script lang="ts">
	import { onMount } from 'svelte'
	import { CodeMap } from '../../../modules/warp/codeMap/index'

	export let css: Record<string, unknown>
	export let id: string
	export let src: string

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

<iframe
	style="{styled}"
	id="{id}"
	width="auto"
	height="auto"
	src="{src}"
	title="YouTube video player"
	frameborder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
	allowfullscreen></iframe>

<style>
	iframe {
		width: 100%;
		height: 512px;
	}
</style>
