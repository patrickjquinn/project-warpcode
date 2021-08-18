<script lang="ts">
	import { CodeMap } from '../modules/warp/codeMap'
	import { HSplitPane, VSplitPane } from 'svelte-split-pane'
	import Monaco from '../components/Editor.svelte'
	import UIPallete from '../components/canvas/UIPallete.svelte'
	import UICanvas from '../components/canvas/UICanvas.svelte'
	import LayoutEditor from '../components/canvas/LayoutEditor.svelte'
	import StyleEditor from '../components/canvas/StyleEditor.svelte'
	import Explorer from '../components/fileExplorer/Explorer.svelte'
	import Terminal from '../components/Terminal.svelte'
	import Warp from '../assets/warpwhite.png'
	import OnlyTabs from '../components/tabs/OnlyTabs.svelte'
	import RemovableTabs from '../components/tabs/RemovableTabs.svelte'

	import Icon from 'svelte-awesome'
	import { bell, refresh, comment, codeFork } from 'svelte-awesome/icons'

	let editorItems: Array<any> = []

	let consoleTabs: Array<Record<string, unknown>> = [
		{ label: 'TERMINAL', value: 1 },
		{ label: 'PROBLEMS', value: 2 },
		{ label: 'OUTPUT', value: 3 }
	]

	let activeEditorTab: number = 1

	const onEditorTabUpdate = (event) => {
		activeEditorTab = event.detail
	}

	let currentCode: string =
		'<script lang="ts">\n\n</script' + '>\n\n<main>\n\n</main>\n\n<style></style>'

	// $: currentCode && updateCanvas()
	let editorTabs: Array<Record<string, unknown>> = [
		{ label: 'Start.svelte', value: 1, path: './start.svelte', type: 'file' }
	]

	const upControlTabs: Array<Record<string, unknown>> = [
		{ label: 'Widgets', value: 1 },
		{ label: 'Layout', value: 2 },
		{ label: 'Style', value: 3 }
	]

	const updateCanvas = () => {
		console.log('canvas update')
		const codeMap = new CodeMap('ts')
		const codeCanvas = codeMap.convertCodeToCanvas(currentCode)
		const isSame = JSON.stringify(codeCanvas) == JSON.stringify(editorItems)

		if (!isSame) {
			if (codeCanvas?.length > 0) {
				editorItems = codeCanvas
			} else {
				editorItems = []
			}
		}
	}

	window.addEventListener(
		'fileSelected',
		(event: CustomEvent) => {
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
		},
		false
	)

	const incrementTabs = (file) => {
		editorTabs = editorTabs.filter((el) => {
			return el.label != file.name && el.path != file.path
		})
		for (let [index] of editorTabs.entries()) {
			editorTabs[index].value = index + 1
		}
	}

	const handleCanvasChange = (event) => {
		const canvas: Record<string, unknown> = event.detail
		if (canvas) {
			const codeMap: CodeMap = new CodeMap('ts')
			currentCode = codeMap.mapToCode(canvas)
		}
	}
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
				leftPaneSize="60%"
				rightPaneSize="40%"
				minLeftPaneSize="250px"
				minRightPaneSize="250px"
				updateCallback="{() => {
					console.log('HSplitPane Updated!')
				}}"
			>
				<!-- Files explorer and editor -->
				<left slot="left">
					<HSplitPane
						leftPaneSize="22%"
						rightPaneSize="78%"
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
									<!-- Code editor, open files -->
									<RemovableTabs bind:items="{editorTabs}" add="{true}" />
									<Monaco bind:code="{currentCode}" on:message="{updateCanvas}" />
								</top>
								<down slot="down">
									<!-- Terminal, console,  output -->
									<OnlyTabs items="{consoleTabs}" add="{false}" />
									<Terminal />
								</down>
							</VSplitPane>
						</right>
					</HSplitPane>
				</left>
				<!-- Canvas and palette -->
				<right slot="right">
					<HSplitPane
						leftPaneSize="60%"
						rightPaneSize="40%"
						updateCallback="{() => {
							console.log('HSplitPane Updated!')
						}}"
					>
						<left slot="left">
							<!-- UI canvas -->
							<UICanvas items="{editorItems}" on:message="{handleCanvasChange}" />
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
