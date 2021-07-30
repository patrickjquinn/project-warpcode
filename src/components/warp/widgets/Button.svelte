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

<button id="{id}" style="{styled}" contenteditable="true"><slot /></button>

<style>
	button {
		width: 85%;
		border-radius: 4;
		background-color: white;
		height: 40px;
		color: black;
	}
</style>
