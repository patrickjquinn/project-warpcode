<script lang="ts">
	export let value

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

<input id="{id}" style="{styled}" type="text" name="text" value="{value}" />

<style>
	input {
		color: black;
		width: 100%;
	}
</style>
