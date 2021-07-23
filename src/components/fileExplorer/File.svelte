<script lang="ts">
    import SvelteLogo from '../../assets/svelte.png'
	export let name: string
    export const type: string = 'file'
    export let size: number
    export let path: string

    let extension: string

    $: {
        extension = name.slice(name.lastIndexOf('.') + 1)
        if (extension == 'svelte') {
            icon = SvelteLogo
        }
    }

    let icon = `https://svelte.dev/tutorial/icons/${extension}.svg`

    

    console.log(`${size} + ${path}`)
</script>

<span style="background-image: url({icon})">{name}</span>

<style>
	span {
		padding: 0 0 0 1.5em;
		background: 0 0.1em no-repeat;
		background-size: 1em 1em;
        color: white
	}
</style>