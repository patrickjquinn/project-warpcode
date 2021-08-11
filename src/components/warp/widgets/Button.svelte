<script lang="ts">
	import { onMount } from 'svelte'
	import { CodeMap } from '../../../modules/warp/codeMap/index'

	export let css
	export let id
	export let value
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

<button id="{id}" style="{styled}" bind:innerHTML="{value}" contenteditable="true"><slot /></button>

<style>
	button {
		display: block
	}
</style>
