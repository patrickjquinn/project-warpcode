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

<div id="{id}" style="{styled}"><slot></slot></div>

<style>
	div {
		background-color: gray;
		width: 100%;
		height: 10rem;
		overflow: scroll;
		resize: both;
	}
</style>
