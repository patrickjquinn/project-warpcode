<script lang="ts">
	import SvelteLogo from '../../assets/svelte.png'
	export let name: string
	export const type = 'file'
	export let size: number
	export let path: string

	let extension: string

	const fileClicked = () => {
		const event = new CustomEvent('fileSelected', {
			detail: { name, type, path },
			bubbles: true,
			cancelable: true,
			composed: false
		})
		window.dispatchEvent(event)
	}

	$: {
		extension = name.slice(name.lastIndexOf('.') + 1)

		switch (extension) {
			case 'svelte':
				icon = SvelteLogo
				break
			case 'js':
				icon = '/static/assets/js.svg'
				break
			case 'ts':
				icon = '/static/assets/ts.svg'
				break
			case 'json':
				icon = '/static/assets/json.svg'
				break
			case 'xml':
				icon = '/static/assets/xml.svg'
				break
			case 'jpg':
				icon = '/static/assets/jpg.svg'
				break
			case 'jpeg':
				icon = '/static/assets/jpg.svg'
				break
			case 'svg':
				icon = '/static/assets/svg.svg'
				break
			case 'png':
				icon = '/static/assets/png.svg'
				break
			case 'html':
				icon = '/static/assets/html.svg'
				break
			default:
				icon = `https://svelte.dev/tutorial/icons/${extension}.svg`
		}
	}

	let icon: any = `https://svelte.dev/tutorial/icons/${extension}.svg`

	console.log(`${size} + ${path}`)
</script>

<span on:click="{fileClicked}" style="background-image: url({icon});">{name}</span>

<style>
	span {
		padding: 0 0 0 1.5em;
		background: 0 0.1em no-repeat;
		background-size: 1em 1em;
		color: white;
		cursor: pointer;
	}
</style>
