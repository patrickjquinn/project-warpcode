<script lang="ts">
	import {CodeMap} from '../modules/warp/codeMap'
	import { HSplitPane, VSplitPane } from 'svelte-split-pane'
	import Monaco from '../components/Editor.svelte'
	import UIPallete from '../components/UIPallete.svelte'
	import UICanvas from '../components/UICanvas.svelte'
	import ProjectExplorer from '../components/ProjectExplorer.svelte'

	let currentCode = ``

	function handleCanvasChange(event){
		const canvas = event.detail
		const codeMap = new CodeMap('ts')
		currentCode = codeMap.mapToCode(canvas)
		console.log(currentCode)
	}

</script>

<div id="header"></div>
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
						<Monaco code={currentCode} />
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
						<div class="smartphone">
							<div class="content">
								<UICanvas on:message={handleCanvasChange} />
							</div>
						</div>
					</left>
					<right style="width: 200px; !important" slot="right">
						<UIPallete />
					</right>
				</HSplitPane>
			</right>
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
		margin-left: 5vw;
	}
	#header {
		width: 100%;
		height: 5vh;
		line-height: 5vh;
		background-color: darkslategray;
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
	.smartphone {
		position: relative;
		width: 260px;
		height: 500px;
		margin: auto;
		margin-top: 2rem;
		border: 16px black solid;
		border-top-width: 60px;
		border-bottom-width: 60px;
		border-radius: 36px;
		background-color: #1e1e1e;
	}

	/* The horizontal line on the top of the device */
	.smartphone:before {
		content: '';
		display: block;
		width: 60px;
		height: 5px;
		position: absolute;
		top: -30px;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #333;
		border-radius: 10px;
	}

	/* The circle on the bottom of the device */
	.smartphone:after {
		content: '';
		display: block;
		width: 35px;
		height: 35px;
		position: absolute;
		left: 50%;
		bottom: -65px;
		transform: translate(-50%, -50%);
		background: #333;
		border-radius: 50%;
	}

	/* The screen (or content) of the device */
	.smartphone .content {
		width: 100%;
		height: 100%;
		background: white;
	}
</style>
