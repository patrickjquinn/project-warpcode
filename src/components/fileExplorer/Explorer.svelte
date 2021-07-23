<script lang="ts"> 
	import Folder from './Folder.svelte'
    import { onMount } from 'svelte'

    const { ipcRenderer } = window.require('electron')

	let files = []

	ipcRenderer.on('send-proj-struct', (event, arg) => {
		files = arg
	})

	onMount(async () => {
		ipcRenderer.send('request-proj-struct')
	})

</script>

<Folder name="{files['name']}" children={files["children"]} expanded={false}/>