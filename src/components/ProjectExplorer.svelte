<script lang="ts">
	import { fileExcelO, filePictureO, fileText } from 'svelte-awesome/icons'
	import FileExplorer from '../modules/libs/svelte-file-tree/FileExplorer.svelte'

	const DIRECTORY = 'DIRECTORY'
	const FILE = 'FILE'

	const extensionToIconMap = {
		txt: fileText,
		xlsx: fileExcelO,
		png: filePictureO
	}

	let files = [
		{
			type: DIRECTORY,
			name: 'Project Demo',
			children: [
				{
					type: DIRECTORY,
					name: 'views',
					expanded: false,
					children: [
						{
							type: DIRECTORY,
							name: 'web',
							children: [
								{
									type: FILE,
									name: 'Login'
								},
								{
									type: FILE,
									name: 'Home'
								},
								{
									type: FILE,
									name: 'Article'
								}
							]
						},
						{
							type: DIRECTORY,
							name: 'mobile',
							expanded: false,
							children: [
								{
									type: FILE,
									name: 'Login'
								},
								{
									type: FILE,
									name: 'Home'
								},
								{
									type: FILE,
									name: 'Article'
								}
							]
						},
						{
							type: DIRECTORY,
							name: 'mobile',
							expanded: false,
							children: [
								{
									type: FILE,
									name: 'Login'
								},
								{
									type: FILE,
									name: 'Home'
								},
								{
									type: FILE,
									name: 'Article'
								}
							]
						}
					]
				},
				{
					type: DIRECTORY,
					name: 'components',
					expanded: false,
					children: [
						{
							type: FILE,
							name: 'fancyView'
						},
						{
							type: FILE,
							name: 'styledTextfield'
						},
						{
							type: FILE,
							name: 'file-3.js'
						}
					]
				}
			]
		}
	]
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
