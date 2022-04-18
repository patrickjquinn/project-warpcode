<script lang="ts">
	import { HSplitPane, VSplitPane } from 'svelte-split-pane'
	import Icon from 'svelte-awesome'
	import { onMount } from 'svelte'
	import { bell, refresh, comment, codeFork } from 'svelte-awesome/icons'
	import { CodeMap } from '../modules/warp/codeMap'
	import Editor from '../components/Editor.svelte'
	import UIPallete from '../components/canvas/UIPallete.svelte'
	import UICanvas from '../components/canvas/UICanvas.svelte'
	import LayoutEditor from '../components/canvas/LayoutEditor.svelte'
	import StyleEditor from '../components/canvas/StyleEditor.svelte'
	import Explorer from '../components/fileExplorer/Explorer.svelte'
	import Terminal from '../components/Terminal.svelte'
	import Warp from '../assets/warpwhite.png'
	import OnlyTabs from '../components/tabs/OnlyTabs.svelte'
	import activeFile from '../stores/activeFile'

	const { ipcRenderer } = window.require('electron')

	let editorItems: Array<any> = []

	let consoleTabs: Array<Record<string, unknown>> = [
		{ label: 'TERMINAL', value: 1 },
		{ label: 'PROBLEMS', value: 2 },
		{ label: 'OUTPUT', value: 3 }
	]

	let shouldShowCanvas = false

	let activeEditorTab = 1

	let lang = 'html'

	const onEditorTabUpdate = (event) => {
		activeEditorTab = event.detail
	}

	let currentCode = '/** Code Will Appear Here **/'

	let editorTabs: Array<Record<string, unknown>> = []

	const upControlTabs: Array<Record<string, unknown>> = [
		{ label: 'Widgets', value: 1 },
		{ label: 'Layout', value: 2 },
		{ label: 'Style', value: 3 }
	]

	const updateCanvas = (code?) => {
		if (!shouldShowCanvas) return

		if (code){
			currentCode = code
		}
		const codeMap = new CodeMap('ts')
		const codeCanvas = codeMap.convertCodeToCanvas(currentCode)

		const isSame = JSON.stringify(codeCanvas) == JSON.stringify(editorItems)

		if (isSame) return

		if (codeCanvas?.length > 0) {
			editorItems = codeCanvas
		} else {
			editorItems = []
		}
	}

	const shouldCanvasShowByFile = (file) => {
		if (
			(file?.path?.includes('components') || file?.path?.includes('pages')) &&
			file.name.toLowerCase().includes('.svelte')
		) {
			setTimeout(() => {
				shouldShowCanvas = true
				updateCanvas()
			}, 300)
			return
		}
		shouldShowCanvas = false
	}

	ipcRenderer.on('file-sent', async () => {
		// Come back to this, pass stuff down from a single call.
		shouldCanvasShowByFile($activeFile)
	})

	window.addEventListener(
		'fileSelectedDirect',
		(event: CustomEvent) => {
			activeFile.update((file) => event.detail)
			for (let [index] of editorTabs.entries()) {
				if (editorTabs[index].path === event.detail.path) {
					editorTabs.splice(index, 1)
				}
			}
			editorTabs.unshift({
				label: event.detail.name,
				value: 1,
				path: event.detail.path,
				type: event.detail.type
			})
			incrementTabs(event.detail)

			lang = fileExtension(event.detail.name)
			ipcRenderer.send('open-file', event.detail.path)
		},
		false
	)

	window.addEventListener(
		'fileSelected',
		(event: CustomEvent) => {
			activeFile.update((file) => event.detail)

			for (let [index] of editorTabs.entries()) {
				if (editorTabs[index].path === event.detail.path) {
					editorTabs.splice(index, 1)
				}
			}

			editorTabs.unshift({
				label: event.detail.name,
				value: 1,
				path: event.detail.path,
				type: event.detail.type
			})

			incrementTabs(event.detail)

			lang = fileExtension(event.detail.name)
			ipcRenderer.send('open-file', event.detail.path)
		},
		false
	)

	const fileExtension = (name: string | string[]) => {
		if (!name) return 'html'
		const extension = name.slice(name.lastIndexOf('.') + 1)

		switch (extension) {
			case 'svelte':
				return 'svelte'
			case 'js':
				return 'javascript'
			case 'ts':
				return 'typescript'
			case 'json':
				return 'json'
			case 'xml':
				return 'html'
			case 'html':
				return 'svelte'
			default:
				return 'html'
		}
	}

	const incrementTabs = (file: any) => {
		for (let [index] of editorTabs.entries()) {
			editorTabs[index].value = index + 1
		}
		editorTabs = [...editorTabs]
	}

	const handleCanvasChange = (items) => {
		const canvas: Record<string, unknown> = {items}
		console.log(canvas)
		if (canvas && shouldCanvasShowByFile) {
			const codeMap: CodeMap = new CodeMap('ts')
			currentCode = codeMap.mapToCode(canvas, currentCode)
		}
	}

	onMount(async () => {
		ipcRenderer.send('open-readme')
	})
</script>

<main>
	<div id="header"></div>
	<div id="contents_wrapper">
		<div class="sidenav">
			<div class="icon-bar">
				<a class="active first-nav" href="/#"><img width="20" height="20" src="{Warp}" alt="" /></a>
				<a href="/#"><Icon data="{refresh}" style="color: white; width: 20px; height: 20px" /></a>
				<a href="/#"><Icon data="{codeFork}" style="color: white; width: 20px; height: 20px" /></a>
				<a href="/#"><Icon data="{bell}" style="color: white; width: 20px; height: 20px" /></a>
				<a href="/#"><Icon data="{comment}" style="color: white; width: 20px; height: 20px" /></a>
			</div>
		</div>
		<div class="wrapper">
			<HSplitPane
				leftPaneSize="{shouldShowCanvas ? '60%' : '100%'}"
				rightPaneSize="{shouldShowCanvas ? '40%' : '0%'}"
				minLeftPaneSize="{shouldShowCanvas ? '250px' : ''}"
				minRightPaneSize=""
				updateCallback="{() => {
					console.log('HSplitPane Updated!')
				}}"
			>
				<!-- Files explorer and editor -->
				<left slot="left">
					<HSplitPane
						leftPaneSize="{shouldShowCanvas ? '20%' : '15%'}"
						rightPaneSize="{shouldShowCanvas ? '80%' : '90%'}"
						updateCallback="{() => {
							console.log('HSplitPane Updated!')
						}}"
					>
						<left slot="left">
							<Explorer />
						</left>
						<right slot="right">
							<VSplitPane
								topPanelSize="97.4%"
								downPanelSize="3.6%"
								minTopPaneSize="50px"
								minDownPaneSize="0px"
							>
								<top slot="top">
									<Editor bind:lang bind:code="{currentCode}" onAction="{updateCanvas}" />
								</top>
								<down slot="down">
									<!-- Terminal, console,  output -->
									<div style="max-height=25%">
										<OnlyTabs items="{consoleTabs}" add="{false}" />
										<Terminal />
									</div>
								</down>
							</VSplitPane>
						</right>
					</HSplitPane>
				</left>
				<!-- Canvas and palette -->
				<right slot="right">
					{#if shouldShowCanvas}
						<HSplitPane
							leftPaneSize="60%"
							rightPaneSize="40%"
							updateCallback="{() => {
								console.log('HSplitPane Updated!')
							}}"
						>
							<left slot="left">
								<!-- UI canvas -->
								<UICanvas bind:items="{editorItems}" onAction="{handleCanvasChange}" />
							</left>
							<right slot="right">
								<!-- Widget, style, layout tabs for the active item -->
								<OnlyTabs on:message="{onEditorTabUpdate}" items="{upControlTabs}" add="{false}" />
								{#if activeEditorTab === 1}
									<UIPallete />
								{:else if activeEditorTab === 2}
									<LayoutEditor />
								{:else}
									<StyleEditor />
								{/if}
							</right>
						</HSplitPane>
					{/if}
				</right>
			</HSplitPane>
		</div>
	</div>
</main>

<style>
	#contents_wrapper {
		width: 100vw;
		height: 95vh;
	}
	.wrapper {
		height: 100%;
		margin-left: 3vw;
	}
	#header {
		width: 100%;
		height: 5vh;
		line-height: 5vh;
		background-color: #2f4f4f;
		-webkit-app-region: drag;
	}
	.sidenav {
		height: 95vh;
		width: 3vw;
		z-index: 1;
		float: left;
		top: 0;
		left: 0;
		background-color: #282828;
		overflow-x: hidden;
		padding-top: 0px;
		color: white !important;
	}
	.icon-bar {
		height: 100%;
		width: 100%;
		text-align: center;
	}

	.first-nav {
		margin-top: 0 !important;
	}

	.icon-bar a {
		padding: 15px;
		opacity: 70%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20px;
	}

	.icon-bar a:hover {
		background-color: #555;
	}

	.active {
		background-color: black;
		opacity: 100% !important;
	}
</style>
