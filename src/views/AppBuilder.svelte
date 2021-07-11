<script lang="ts">
	const electron = window.require('electron')
	import { CodeMap } from '../modules/warp/codeMap'
	import { HSplitPane, VSplitPane } from 'svelte-split-pane'
	import Monaco from '../components/Editor.svelte'
	import UIPallete from '../components/UIPallete.svelte'
	import UICanvas from '../components/UICanvas.svelte'
	import ProjectExplorer from '../components/ProjectExplorer.svelte'
	import Terminal from '../components/Terminal.svelte'
	import Warp from '../assets/warpwhite.png'
	import OnlyTabs from '../components/warp/OnlyTab.svelte'
	import Icon from 'svelte-awesome';
	import { bell, refresh, comment, codeFork } from 'svelte-awesome/icons';

	const consoleTabs = [
		{ label: 'OUTPUT', value: 1 },
		{ label: 'PROBLEM', value: 2},
		{ label: 'TERMINAL', value: 3}
	]

	let currentCode = '<script lang="ts">\n\n</script' + '>\n\n<main>\n\n</main>\n\n<style></style>'

	const editorTabs = [
		{ label: 'Start.svelte', value: 1}
	]

	const upControlTabs = [
		{ label: 'Widgets', value: 1},
		{ label: 'Layout', value: 2},
		{ label: 'Style', value: 3}
	]

	function minimize() {
		let window: any = remote.BrowserWindow.getFocusedWindow()
		window.minimize()
	}

	function maximize() {
		let window: any = remote.BrowserWindow.getFocusedWindow()
		window.maximize()
	}

	function close() {
		let window: any = remote.BrowserWindow.getFocusedWindow()
		window.close()
	}

	const { remote } = electron
	const win: any = remote.BrowserWindow.getFocusedWindow()

	// win.minimize()

	function handleCanvasChange(event) {
		const canvas = event.detail
		const codeMap = new CodeMap('ts')
		currentCode = codeMap.mapToCode(canvas)
		console.log(currentCode)
	}
</script>

<main>
	<div id="header"></div>
	<div id="contents_wrapper">
		<div class="sidenav">
			<div class="icon-bar">
				<a class="active first-nav" href="/#"><img width="20" height="20" src="{Warp}" alt="" /></a>
				<a href="/#"><Icon data={refresh} style="color: white; width: 20px; height: 20px" /></a>
				<a href="/#"><Icon data={codeFork} style="color: white; width: 20px; height: 20px" /></a>
				<a href="/#"><Icon data={bell} style="color: white; width: 20px; height: 20px" /></a>
				<a href="/#"><Icon data={comment} style="color: white; width: 20px; height: 20px" /></a>
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
				<left slot="left">
					<HSplitPane
						leftPaneSize="22%"
						rightPaneSize="78%"
						updateCallback="{() => {
							console.log('HSplitPane Updated!')
						}}"
					>
						<left slot="left">
							<ProjectExplorer />
						</left>
						<right slot="right">
							<VSplitPane
								topPanelSize="100%"
								downPanelSize="0%"
								minTopPaneSize="50px"
								minDownPaneSize="0px"
							>
								<top slot="top">
									<OnlyTabs items={editorTabs} add={true}/>
									<Monaco code={currentCode}/>
								</top>
								<down slot="down">
									<OnlyTabs items={consoleTabs} add={false}/>
									<Terminal/>
								</down>
							</VSplitPane>
						</right>
					</HSplitPane>
				</left>
				<right slot="right">
					<HSplitPane
						leftPaneSize="60%"
						rightPaneSize="40%"
						updateCallback="{() => {
							console.log('HSplitPane Updated!')
						}}"
					>
						<left slot="left">
							<UICanvas on:message="{handleCanvasChange}" />
						</left>
						<right slot="right">
							<OnlyTabs items={upControlTabs} add={false}/>
							<UIPallete />
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
