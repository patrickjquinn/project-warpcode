<script lang="ts">
	import { HSplitPane, VSplitPane } from 'svelte-split-pane'
	import Monaco from '../components/Editor.svelte'

	import Tree from 'svelte-tree'
	const tree: Array<Record<string, unknown>> = [
		{
			name: 'This is a root node',
			children: [
				{
					name: 'And it has'
				},
				{
					name: 'two children'
				}
			]
		},
		{
			name: 'This is another root node',
			children: [
				{
					name: 'This one is alone'
				},
				{
					name: 'But this one has nested children',
					children: [
						{
							name: 'Like this'
						},
						{
							name: 'and this'
						}
					]
				}
			]
		}
	]
</script>

<div id="header"></div>
<div id="contents_wrapper">
	<div class="sidenav">
		<Tree tree="{tree}" let:node>
			<div class="name">{node.name}</div>
		</Tree>
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
