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

<textarea id="{id}" value="{value}" style="{styled}" name="textBox" rows="4" cols="50"/>

<style>
	textarea {
		color: black;
		width: 50%;
		height: 80px;
	}
</style>
