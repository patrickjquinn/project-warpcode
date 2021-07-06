<script lang="ts">
	import { flip } from 'svelte/animate'
	import { dndzone } from 'svelte-dnd-action'
	import { createEventDispatcher } from 'svelte'
	import {
		Container,
		ScrollContainer,
		Label,
		TextBox,
		TextInput,
		Button
	} from './warp/widgets/index'
	import VideoPlayer from './warp/widgets/VideoPlayer.svelte'
	let columnItems = [
		{
			id: 1,
			items: []
		}
	]

	const flipDurationMs = 200
	const dispatch = createEventDispatcher()

	function handleDndConsiderColumns(e) {
		columnItems = e.detail.items
	}
	function handleDndFinalizeColumns(e) {
		columnItems = e.detail.items
	}
	function handleDndConsiderCards(cid, e) {
		const colIdx = columnItems.findIndex((c) => c.id === cid)
		columnItems[colIdx].items = e.detail.items
		columnItems = [...columnItems]
	}
	function handleDndFinalizeCards(cid, e) {
		const colIdx = columnItems.findIndex((c) => c.id === cid)
		columnItems[colIdx].items = e.detail.items
		columnItems = [...columnItems]
		canvasChanged()
	}

	function canvasChanged() {
		dispatch('message', {
			items: columnItems[0].items
		})
	}
</script>

<div id="canvas_container">
	<!-- <div class="device device-iphone-x">
		<div class="device-frame">
			<section
				class="board device-content"
				use:dndzone="{{ items: columnItems, flipDurationMs, type: 'columns' }}"
				on:consider="{handleDndConsiderColumns}"
				on:finalize="{handleDndFinalizeColumns}"
			>
				{#each columnItems as column (column.id)}
					<div class="column" animate:flip="{{ duration: flipDurationMs }}">
						<div
							class="column-content"
							use:dndzone="{{ items: column.items, flipDurationMs }}"
							on:consider="{(e) => handleDndConsiderCards(column.id, e)}"
							on:finalize="{(e) => handleDndFinalizeCards(column.id, e)}"
						>
							{#each column.items as item (item.id)}
								{#if item.widget === 'container'}
									<Container id="{item.id}" />
								{:else if item.widget === 'label'}
									<Label id="{item.id}" />
								{:else if item.widget === 'scrollContainer'}
									<ScrollContainer id="{item.id}" />
								{:else if item.widget === 'button'}
									<Button id="{item.id}" />
								{:else if item.widget === 'textInput'}
									<TextInput id="{item.id}" />
								{:else if item.widget === 'textBox'}
									<TextBox id="{item.id}" />
								{:else if item.widget === 'videoPlayer'}
									<VideoPlayer id="{item.id}" />
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</section>
		</div>
		<div class="device-stripe"></div>
		<div class="device-header"></div>
		<div class="device-sensors"></div>
		<div class="device-btns"></div>
		<div class="device-power"></div>
	</div>

	 -->

	<div class="temp-wrapper">
		<div class="px">
			<div class="px__body">
				<div class="px__body__cut"></div>
				<div class="px__body__speaker"></div>
				<div class="px__body__sensor"></div>

				<div class="px__body__mute"></div>
				<div class="px__body__up"></div>
				<div class="px__body__down"></div>
				<div class="px__body__right"></div>
			</div>

			<div class="px__screen">
				<div class="px__screen__">
					<div
						class="px__screen__frame"
					>
					<section
					class="board device-content"
					use:dndzone="{{ items: columnItems, flipDurationMs, type: 'columns' }}"
					on:consider="{handleDndConsiderColumns}"
					on:finalize="{handleDndFinalizeColumns}"
				>
					{#each columnItems as column (column.id)}
						<div class="column" animate:flip="{{ duration: flipDurationMs }}">
							<div
								class="column-content"
								use:dndzone="{{ items: column.items, flipDurationMs }}"
								on:consider="{(e) => handleDndConsiderCards(column.id, e)}"
								on:finalize="{(e) => handleDndFinalizeCards(column.id, e)}"
							>
								{#each column.items as item (item.id)}
									{#if item.widget === 'container'}
										<Container id="{item.id}" />
									{:else if item.widget === 'label'}
										<Label id="{item.id}" />
									{:else if item.widget === 'scrollContainer'}
										<ScrollContainer id="{item.id}" />
									{:else if item.widget === 'button'}
										<Button id="{item.id}" />
									{:else if item.widget === 'textInput'}
										<TextInput id="{item.id}" />
									{:else if item.widget === 'textBox'}
										<TextBox id="{item.id}" />
									{:else if item.widget === 'videoPlayer'}
										<VideoPlayer id="{item.id}" />
									{/if}
								{/each}
							</div>
						</div>
					{/each}
				</section>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.board {
		height: 100%;
		width: 100%;
		padding: 0em;
		margin-bottom: 0;
		overflow: scroll;
	}
	.column {
		height: 100%;
		width: 100%;
		padding: 0;
		margin: 0em;
		margin-top: 40px;
		float: left;
		overflow-y: hidden;
	}
	.column-content {
		height: 100%;
		overflow-y: scroll;
	}

	#canvas_container {
		width: 100%;
		height: 100%;
		padding: 0;
		background-color: #1e1e1e;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		overflow:hidden
	}

	.temp-wrapper {
		margin: 20px;
		/* min-width: 526px; */
		min-width: 300px;
	}

	@media all and (min-width: 480px) {
		.temp-wrapper {
			width: 80%;
			margin: 20px auto;
		}

		.temp-wrapper--wide {
			width: 80%;
		}

		.temp-wrapper--wider {
			width: 80%;
		}
	}

	/* @media all and (min-width: 768px) {
		.temp-wrapper {
			width: 33.33337%;
		}

		.temp-wrapper--wide {
			width: 66.66667%;
		}

		.temp-wrapper--wider {
			width: 100%;
		}
	} */

	/* @media all and (min-width: 1024px) {
		.temp-wrapper {
			width: 25%;
		}

		.temp-wrapper--wide {
			width: 50%;
		}

		.temp-wrapper--wider {
			width: 75%;
		}
	} */

	/*------------*\
   #IPHONE X
\*------------*/

	.px {
		position: relative;
		padding: 6% 7%;
	}

	.px--ls {
		padding: 3.3% 3%;
	}

	.px__body {
		position: absolute;
		top: 0;
		right: 1%;
		bottom: 0;
		left: 1%;
		background: linear-gradient(to top, #e5e5e5 0%, #f7f7f9 10%, #eeeef0 90%);
		border-radius: 14%/7%;
		box-shadow: inset 0 0 3px 1px #000;
	}

	.px--ls > .px__body {
		top: 1%;
		right: 0;
		bottom: 1%;
		left: 0;
		border-radius: 7%/14%;
	}

	.px__body:before {
		content: '';
		position: absolute;
		top: 0.7%;
		right: 1.4%;
		bottom: 0.7%;
		left: 1.4%;
		background-color: #000;
		border-radius: 13%/7%;
		box-shadow: 0 0 3px #000;
	}

	.px--ls > .px__body:before {
		top: 1.4%;
		right: 0.7%;
		bottom: 1.4%;
		left: 0.7%;
		border-radius: 7%/13%;
	}

	.px__body:after {
		content: '';
		position: absolute;
		top: 1%;
		right: 2.3%;
		bottom: 1%;
		left: 2.3%;
		background-color: #000;
		box-shadow: inset 0 0 10px 2px #fff;
		border-radius: 13%/6.5%;
	}

	.px--ls > .px__body:after {
		top: 2.3%;
		right: 1%;
		bottom: 2.3%;
		left: 1%;
		border-radius: 6.5%/13%;
	}

	.px__body__cut {
		position: absolute;
		z-index: 2;
		top: 3%;
		left: 50%;
		width: 50%;
		height: 3.5%;
		background-color: #000;
		border-radius: 0 0 10% 10%/80%;
		transform: translate3d(-50%, 0, 0);
	}

	.px--ls .px__body__cut {
		top: 50%;
		left: 3%;
		width: 3.5%;
		height: 50%;
		border-radius: 0 80% 80% 0/10%;
		transform: translate3d(0, -50%, 0);
	}

	.px__body__speaker,
	.px__body__camera,
	.px__body__sensor {
		position: absolute;
		z-index: 2;
		background-color: #222;
		transform: translate(-50%, -50%);
	}

	.px__body__speaker {
		top: 4%;
		left: 50%;
		width: 12%;
		height: 0.8%;
		border-radius: 5px;
	}

	.px--ls .px__body__speaker {
		top: 50%;
		left: 4%;
		width: 0.8%;
		height: 12%;
	}

	.px__body__camera {
		top: 4%;
		left: 36%;
		width: 3.5%;
		height: 1.7%;
		border-radius: 50%;
		box-shadow: inset 0 0 2px 1px #000;
	}

	.px--ls .px__body__camera {
		top: 64%;
		left: 4%;
		width: 1.7%;
		height: 3.5%;
	}

	.px__body__sensor {
		top: 4%;
		left: 61%;
		width: 2.2%;
		height: 1.1%;
		border-radius: 50%;
		background-color: #2a4a73;
		box-shadow: inset 0 0 2px 1px #000;
	}

	.px--ls .px__body__sensor {
		top: 39%;
		left: 4%;
		width: 1.1%;
		height: 2.2%;
	}

	.px__body__mute,
	.px__body__up,
	.px__body__down,
	.px__body__right {
		position: absolute;
		background-color: #b5b8ba;
		box-shadow: inset 0 5px 5px -3px rgba(0, 0, 0, 0.5), inset 0 -5px 5px -3px rgba(0, 0, 0, 0.5);
		transform: translate(0, -50%);
	}

	.px--ls .px__body__mute,
	.px--ls .px__body__up,
	.px--ls .px__body__down,
	.px--ls .px__body__right {
		box-shadow: inset 5px 0 5px -3px rgba(0, 0, 0, 0.5), inset -5px 0 5px -3px rgba(0, 0, 0, 0.5);
		transform: translate(-50%, 0);
	}

	.px--ls .px__body__right {
		background-color: #f4f6f6;
	}

	.px__body__mute {
		top: 14.7%;
		left: -0.7%;
		width: 0.7%;
		height: 4%;
		border-radius: 1px 0 0 1px;
	}

	.px--ls .px__body__mute {
		top: auto;
		left: 14.7%;
		bottom: -0.7%;
		width: 4%;
		height: 0.7%;
		border-radius: 0 0 1px 1px;
	}

	.px__body__up,
	.px__body__down {
		left: -1%;
		width: 1%;
		height: 7.5%;
		border-radius: 2px 0 0 2px;
	}

	.px--ls .px__body__up,
	.px--ls .px__body__down {
		bottom: -1%;
		width: 7.5%;
		height: 1%;
		border-radius: 0 0 2px 2px;
	}

	.px__body__up {
		top: 25%;
	}

	.px--ls .px__body__up {
		top: auto;
		left: 25%;
	}

	.px__body__down {
		top: 34%;
	}

	.px--ls .px__body__down {
		top: auto;
		left: 34%;
	}

	.px__body__right {
		top: 25%;
		right: -1%;
		width: 1%;
		height: 7.5%;
		border-radius: 0 2px 2px 0;
	}

	.px--ls .px__body__right {
		top: -1%;
		right: auto;
		left: 25%;
		width: 7.5%;
		height: 1%;
		border-radius: 2px 2px 0 0;
	}

	.px__screen {
		position: relative;
		z-index: 1;
	}

	.px__screen__ {
		position: relative;
		padding-bottom: 218%;
		background-color: #888;
		border-radius: 10%/5%;
		box-shadow: 0 0 10px #000;
	}

	.px--ls .px__screen__ {
		padding-bottom: 46%;
		border-radius: 5%/10%;
	}

	.px__screen__frame {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: hidden;
		border-radius: inherit;
		background-size: cover;
		background-position: center center;
	}

	.px__screen__frame > .fa {
		position: absolute;
		top: 50%;
		left: 50%;
		font-size: 5em;
		transform: translate(-50%, -50%);
	}
</style>
