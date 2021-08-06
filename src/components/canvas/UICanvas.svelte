<script>
	import { dndzone, TRIGGERS, SOURCES } from 'svelte-dnd-action'
	import { createEventDispatcher } from 'svelte'
	import MobileFrame from './MobileFrame.svelte'

	import {
		Container,
		ScrollContainer,
		Label,
		Button,
		VideoPlayer,
		Image
	} from '../warp/widgets/index'

	export let items

	$: items, canvasChanged()

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
				items = [...items]
			}
		}
	}

	

	let selectedItem
	let dragDisabled = true

	function canvasChanged() {
		dispatch('message', {
			items
		})
	}

	function handleDndConsider(e) {
		const { source } = e.detail.info
		console.log(e.detail.items)
		// if (trigger === TRIGGERS.DRAG_STARTED) {
		// 	console.warn(`copying ${id}`)
		// 	const idx = items.findIndex((item) => item.id === id)
		// 	const item = items[idx]
		// 	const newId = `${id}_copy_${Math.round(Math.random() * 100000)}`
		// 	const style = {}
		// 	style[`#${item.widget}${newId}`] = item.style[`#${item.widget}${id}`]
		// 	e.detail.items = e.detail.items.filter((item) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME])
		// 	e.detail.items.splice(idx, 0, { ...items[idx], id: newId, style })
		// }
		items = e.detail.items
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			dragDisabled = true;
		}
	}
	function handleDndFinalize(e) {
		const { source } = e.detail.info
		items = e.detail.items
		if (source === SOURCES.POINTER) {
			dragDisabled = true;
		}
		canvasChanged()
	}

	function handleConsider(e) {
		const {items: newItems, info: {source, trigger}} = e.detail;
		items = newItems;
		// Ensure dragging is stopped on drag finish via keyboard
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			dragDisabled = true;
		}
	}
	function handleFinalize(e) {
		const {items: newItems, info: {source}} = e.detail;
		items = newItems;
		// Ensure dragging is stopped on drag finish via pointer (mouse, touch)
		if (source === SOURCES.POINTER) {
			dragDisabled = true;
		}
		canvasChanged()
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

	function startDrag(e) {
		e.preventDefault();
		dragDisabled = false;
	}
	function handleKeyDown(e) {
		if ((e.key === "Enter" || e.key === " ") && dragDisabled) dragDisabled = false;
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
						use:dndzone="{{ items, dragDisabled, flipDurationMs }}"
						on:consider="{handleConsider}"
						on:finalize="{handleFinalize}"
					>
						{#each items as item (item.id)}
							<div on:click="{(e) => onItemSelected(e, item)}" class="selector">
								<div tabindex={dragDisabled? 0 : -1} 
										aria-label="drag-handle"
										class="handle" 
										style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'}
										on:mousedown={startDrag} 
										on:touchstart={startDrag}
										on:keydown={handleKeyDown}
								/>
								{#if item.widget === 'container'}
									<Container css="{item.style}" id="{`${item.widget}${item.id}`}"
										>{item.value ?? ''}</Container
									>
								{:else if item.widget == 'label'}
									<Label css="{item.style}" id="{`${item.widget}${item.id}`}"
										>{item.value ?? ''}</Label
									>
								{:else if item.widget == 'scrollContainer'}
									<ScrollContainer css="{item.style}" id="{`${item.widget}${item.id}`}"
										>{item.value ?? ''}</ScrollContainer
									>
								{:else if item.widget == 'button'}
									<Button css="{item.style}" id="{`${item.widget}${item.id}`}"
										>{item.value ?? ''}</Button
									>
								{:else if item.widget == 'videoPlayer'}
									<VideoPlayer
										css="{item.style}"
										src="{item.value ?? ''}}"
										id="{`${item.widget}${item.id}`}"
									/>
								{:else if item.widget == 'image'}
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

	.handle {
		position: absolute;
		right: 0;
		width: 1rem;
		height: 1rem;
		background-color: darkslategrey;
	}

	@media all and (min-width: 480px) {
		.temp-wrapper {
			width: 80%;
			margin: 0px auto;
		}
	}
</style>
