<script lang="ts">
	import { HSplitPane, VSplitPane } from 'svelte-split-pane'
	import Monaco from '../components/Editor.svelte'
	import { fileExcelO, filePictureO, fileText } from 'svelte-awesome/icons'

	const DIRECTORY = 'DIRECTORY'
	const FILE = 'FILE'

	const extensionToIconMap = {
		txt: fileText,
		xlsx: fileExcelO,
		png: filePictureO
	}

	import FileExplorer from '../modules/libs/svelte-file-tree/FileExplorer.svelte'
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

<div id="header"></div>
<div id="contents_wrapper">
	<div class="sidenav">
		<FileExplorer files="{files}" icons="{icons}" expanded="{expanded}" selected="{selected}" />
	</div>
	<div class="wrapper">
		<HSplitPane
			updateCallback="{() => {
				console.log('HSplitPane Updated!')
			}}"
		>
			<left slot="left"> <Monaco /> </left>
			<right slot="right"> Visual Editor </right>
		</HSplitPane>
	</div>
</div>

<style>
	#contents_wrapper {
		width: 100vw;
		height: 95vh;
	}
	.wrapper {
		height: 100%;
		margin-left: 10vw;
	}
	#header {
		width: 100%;
		height: 5vh;
		line-height: 5vh;
		background-color: darkslategray;
	}
	.sidenav {
		height: 100%;
		width: 10vw;
		z-index: 1;
		float: left;
		/* position: absolute; */
		top: 0;
		left: 0;
		background-color: #111;
		overflow-x: hidden;
		padding-top: 20px;
		color: white !important;
	}
</style>
