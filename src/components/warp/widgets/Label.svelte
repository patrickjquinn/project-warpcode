<script lang="ts">

	import {CodeMap} from '../../../modules/warp/codeMap/index'
	
	export let id
	export let css

	let codeMap = new CodeMap('ts')

	console.log(`🎨 ${JSON.stringify(css)}`)
	let styled

	$: {
		const mapped = codeMap.convertJSONToCSS(css)
		if (mapped) {
			const styleSplit = mapped.split(`#label${id}`)
			if (styleSplit?.length > 0){
				if (styleSplit[1]?.includes('{') && styleSplit[1]?.includes('}}'))
				styled = styleSplit[1].replace('{','').replace('}}','').trim()
			}
		}
	}

</script>

<div>
	<p id="{id}" style="{styled}" contenteditable="true"><slot></slot></p>
</div>

<style>
	p {
		background-color: white;
		padding: 10px;
		color: black;
		width: 50%;
	}
</style>
