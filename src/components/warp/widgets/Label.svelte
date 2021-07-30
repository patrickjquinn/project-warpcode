<script lang="ts">
	import { onMount } from 'svelte'

	import { CodeMap } from '../../../modules/warp/codeMap/index'

	export let id
	export let css

	let codeMap = new CodeMap('ts')

	console.log(`🎨 ${JSON.stringify(css)}`)
	let styled
	let rendered = false

	$: {
		if (rendered) {
			const mapped = codeMap.convertJSONToCSS(css).toString()
			console.log(mapped)
			if (mapped) {
				console.log(`#${id}`)
				const styleSplit = mapped.split(`#${id}`)
				console.log(styleSplit[1])
				if (styleSplit?.length > 0) {
					const splitValue = styleSplit[1].trim()
					if (splitValue?.includes('{') && splitValue?.includes('}')) {
						styled = styleSplit[1].replace('{', '').replace('}', '').trim()
					}
				}
				console.log(styled)
			}
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
