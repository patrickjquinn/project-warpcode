<script lang="ts">
	import { fileExcelO, filePictureO, fileText } from 'svelte-awesome/icons'
	import svelte from '../assets/svelte.png'
	import FileExplorer from '../modules/libs/svelte-file-tree/FileExplorer.svelte'
	import { onMount } from 'svelte'



	const { remote, ipcRenderer } = window.require('electron')	
	const DIRECTORY = 'DIRECTORY'
	const FILE = 'FILE'
	const SVELTE = 'SVELTE'

	let files = [
	]

	ipcRenderer.on('send-proj-struct', (event, arg) => {
    	console.log(arg)
		files[0] = arg
	})

	onMount(async () => {
		ipcRenderer.send('request-proj-struct');
	})

	

	const extensionToIconMap = {
		txt: fileText,
		xlsx: fileText,
		png: fileText,
		svelte: fileText
	}

	
	let icons = (extension) => extensionToIconMap[extension]
	let expanded = true
	let selected = false
</script>

<div class="project_nav">
	<FileExplorer files="{files}" icons="{icons}" expanded="{expanded}" selected="{selected}" />
</div>

<style>
	.project_nav {
		width: 100%;
		height: 100%;
		float: left;
		background-color: #1e1e1e;
	}
</style>
