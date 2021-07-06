<script lang="ts">
	import { CodeMap } from '../modules/warp/codeMap'
	import { HSplitPane, VSplitPane } from 'svelte-split-pane'
	import Monaco from '../components/Editor.svelte'
	import UIPallete from '../components/UIPallete.svelte'
	import UICanvas from '../components/UICanvas.svelte'
	import ProjectExplorer from '../components/ProjectExplorer.svelte'

	let currentCode = '<script lang="ts"></script' + '><main></main>\n\n<style></style>'

	function handleCanvasChange(event) {
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
						<Monaco code="{currentCode}" />
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
								<UICanvas on:message="{handleCanvasChange}" />
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

<style></style>
