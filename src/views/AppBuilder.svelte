<script lang="ts">
	const electron = window.require('electron')
	import { CodeMap } from '../modules/warp/codeMap'
	import { HSplitPane, VSplitPane } from 'svelte-split-pane'
	import Monaco from '../components/Editor.svelte'
	import UIPallete from '../components/UIPallete.svelte'
	import UICanvas from '../components/UICanvas.svelte'
	import ProjectExplorer from '../components/ProjectExplorer.svelte'
	import Terminal from '../components/Terminal.svelte'
	import Warp from "../assets/warp.png"

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

	let currentCode = '<script lang="ts">\n\n</script' + '>\n\n<main>\n\n</main>\n\n<style></style>'

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
				<a class="active" href="#"><img width="50" height="50" src={Warp} alt=""/></a>
				<a href="#"><i class="fa fa-search"></i></a>
				<a href="#"><i class="fa fa-envelope"></i></a>
				<a href="#"><i class="fa fa-globe"></i></a>
				<a href="#"><i class="fa fa-trash"></i></a>
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
									<Monaco code="{currentCode}" />
								</top>
								<down slot="down">
									<Terminal />
								</down>
							</VSplitPane>
						</right>
					</HSplitPane>
				</left>
				<right slot="right">
					<HSplitPane
						leftPaneSize="78%"
						rightPaneSize="22%"
						updateCallback="{() => {
							console.log('HSplitPane Updated!')
						}}"
					>
						<left slot="left">
							<UICanvas on:message="{handleCanvasChange}" />
						</left>
						<right slot="right">
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
		margin-left: 5vw;
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
		width: 5vw;
		z-index: 1;
		float: left;
		top: 0;
		left: 0;
		background-color: black;
		overflow-x: hidden;
		padding-top: 0px;
		color: white !important;
	}
	.icon-bar {
    height: 100%;
    width: 90px;
    text-align: center;
    background-color: #555;
}

.icon-bar a {
    padding: 16px;
    display: block;
    transition: all 0.3s ease;
    color: white;
    font-size: 36px;
}

.icon-bar a:hover {
    background-color: #000;
}

.active {
}
</style>
