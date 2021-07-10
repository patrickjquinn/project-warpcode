<script lang="ts">
	const electron = window.require("electron")
	import { CodeMap } from '../modules/warp/codeMap'
	import { HSplitPane, VSplitPane } from 'svelte-split-pane'
	import Monaco from '../components/Editor.svelte'
	import UIPallete from '../components/UIPallete.svelte'
	import UICanvas from '../components/UICanvas.svelte'
	import ProjectExplorer from '../components/ProjectExplorer.svelte'
	import Terminal from '../components/Terminal.svelte'
	
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

	const {remote} = electron


	let currentCode = '<script lang="ts">\n\n</script' + '>\n\n<main>\n\n</main>\n\n<style></style>'

	const win: any = remote.BrowserWindow.getFocusedWindow();

	// win.minimize()

	function handleCanvasChange(event) {
		const canvas = event.detail
		const codeMap = new CodeMap('ts')
		currentCode = codeMap.mapToCode(canvas)
		console.log(currentCode)
	}

</script>
<main>
	<div id="header">
		
	</div>
	<div id="contents_wrapper">
		<div class="sidenav"></div>
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
	#title {
		position: fixed;
		top: 0px;
		right: 30px; 
	}

	#title-bar-btns {
		-webkit-app-region: no-drag;
		position: fixed;
		top: 0px;
		left: 6px;
		-webkit-app-region: no-drag;
	}
	#min-btn {
		border-radius: 100%;
		background-color: yellow;
		border: none
	}
	#max-btn {
		border-radius: 100%;
		background-color: green;
		border: none
	}
	#close-btn {
		border-radius: 100%;
		background-color: red ;
		border: none
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
</style>
