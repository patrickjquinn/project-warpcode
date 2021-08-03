<script>
	import { dndzone, TRIGGERS } from 'svelte-dnd-action'
	import { createEventDispatcher } from 'svelte'
	import MobileFrame from "./MobileFrame.svelte";

	import {
		Container,
		ScrollContainer,
		Label,
		TextBox,
		TextInput,
		Button,
		VideoPlayer,
		Image
	} from '../warp/widgets/index'


	export let items
	let selectedItem

	const flipDurationMs = 100
	const dispatch = createEventDispatcher()

	const onKeyCombo = (e) => {
		const key = e.keyCode
		if (key === 8 || key === 46) {
			if (selectedItem) {
				const idx = items.findIndex((item) => item.id === selectedItem.id)
				selectedItem = null
				items.splice(idx, 1)
				canvasChanged()
			}
		}
	}

	function canvasChanged() {
		dispatch('message', {
			items
		})
	}

	function handleDndConsider(e) {
		const { trigger, id } = e.detail.info
		// if (trigger === TRIGGERS.DRAGGED_OVER_INDEX){
		items = e.detail.items
		// }
		// if (trigger === TRIGGERS.DRAG_STARTED && trigger === TRIGGERS.DRAGGED_ENTERED_ANOTHER) {
		// 	const idx = items.findIndex((item) => item.id === id)
		// 	if (idx) {
		// 		const item = items[idx]
		// 		const newId = id + Math.round(Math.random() * 100)
		// 		const style = {}
		// 		style[`#${item.widget}${newId}`] = item.style[`#${item.widget}${id}`]
		// 		e.detail.items.splice(idx, 0, { ...items[idx], id: newId, style })
		// 	}
		// }
	}
	function handleDndFinalize(e) {
		const { trigger } = e.detail.info
		if (trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			// items = e.detail.items
			try {
				canvasChanged()
			} catch {
				console.log('no no, dont do that')
			}
		}
	}

	function removeSelectorHighlights() {
		selectedItem = null
		const selectors = document.querySelectorAll('.selector')
		selectors.forEach((selector) => {
			selector.style.border = '0px solid transparent'
		})
	}

	function onItemSelected(e, item) {
		removeSelectorHighlights()
		selectedItem = item
		e.target.parentNode.style.border = '2px solid yellow'
	}
</script>

<svelte:window on:keydown="{onKeyCombo}" />

<div id="canvas_container">
	<div class="temp-wrapper">
		<MobileFrame>
			<section class="board device-content">
				<div class="column">
					<div
						class="column-content"
						use:dndzone="{{ items, flipDurationMs }}"
						on:consider="{(e) => handleDndConsider(e)}"
						on:finalize="{(e) => handleDndFinalize(e)}"
					>
						{#each items as item (item.id)}
							<div on:click="{(e) => onItemSelected(e, item)}" class="selector">
								{#if item.widget === 'container'}
									<Container css="{item.style}" id="{`${`${item.widget}${item.id}`}`}"
										>{item.value ?? ''}</Container
									>
								{:else if item.widget === 'label'}
									<Label css="{item.style}" id="{`${item.widget}${item.id}`}"
										>{item.value ?? ''}</Label
									>
								{:else if item.widget === 'scrollContainer'}
									<ScrollContainer css="{item.style}" id="{`${item.widget}${item.id}`}"
										>{item.value ?? ''}</ScrollContainer
									>
								{:else if item.widget === 'button'}
									<Button css="{item.style}" id="{`${item.widget}${item.id}`}"
										>{item.value ?? ''}</Button
									>
								{:else if item.widget === 'textInput'}
									<TextInput
										css="{item.style}"
										value="{item.value ?? ''}"
										id="{`${item.widget}${item.id}`}"
									/>
								{:else if item.widget === 'textBox'}
									<TextBox
										css="{item.style}"
										value="{item.value ?? ''}"
										id="{`${item.widget}${item.id}`}"
									/>
								{:else if item.widget === 'videoPlayer'}
									<VideoPlayer
										css="{item.style}"
										src="{item.value ?? ''}}"
										id="{`${item.widget}${item.id}`}"
									/>
								{:else if item.widget === 'image'}
									<Image
										css="{item.style}"
										src="{item.value ?? ''}"
										id="{`${item.widget}${item.id}`}"
									/>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</section>
		</MobileFrame>
		<!-- <div class="px">
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
					<div class="px__screen__frame">
						
					</div>
				</div>
			</div>
		</div> -->


	</div>
</div>

<style>
	.board {
		height: 100%;
		width: 100%;
		padding: 0em;
		padding-top: 10px;
		margin-bottom: 0;
		overflow: scroll;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
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
		overflow: hidden;
	}

	.temp-wrapper {
		margin: 0px;
		min-width: 300px;
		padding: 0;
	}

	@media all and (min-width: 480px) {
		.temp-wrapper {
			width: 80%;
			margin: 0px auto;
		}
	}
</style>
