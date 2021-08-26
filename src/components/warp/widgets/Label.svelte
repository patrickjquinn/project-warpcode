<script lang="ts">
	import { onMount } from 'svelte'
	import { CodeMap } from '../../../modules/warp/codeMap/index'

	export let id
	export let css
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

<p id="{id}" style="{styled}" contenteditable="true" bind:innerHTML="{value}"><slot /></p>

<style>
	p {
		display: block;
	}
</style>
