<script lang="ts">
	import { onMount } from 'svelte'
	import { CodeMap } from '../../../modules/warp/codeMap/index'

	export let id
	export let css

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

<div>
	<p id="{id}" style="{styled}" contenteditable="true"><slot /></p>
</div>

<style>
	p {
		background-color: white;
		padding: 10px;
		color: black;
		width: 50%;
	}
</style>
