<script lang="ts">
	import { onMount } from 'svelte'
	import { CodeMap } from '../../../modules/warp/codeMap/index'

	export let css
	export let id: string
	export let tag: string
	export let value: string

	let codeMap = new CodeMap('ts')
	let styled: string
	let formatted = ``
	let rendered = false

	$: {
		if (rendered) {
			styled = codeMap.convertCSSJSONtoInline(css, id)
			formatted = `<${tag.toLowerCase()} id="${id}" style="${styled}">${value}</${tag.toLowerCase()}>`
		}
	}

	onMount(async () => {
		rendered = true
	})
</script>

{@html formatted}
