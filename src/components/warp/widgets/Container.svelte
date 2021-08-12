<script lang="ts">
	import { onMount } from 'svelte'
	import { CodeMap } from '../../../modules/warp/codeMap/index'

	export let css
	export let id

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
		min-width: 50px;
		min-height: 5rem;
		overflow: hidden;
		resize: both;
	}
</style>
