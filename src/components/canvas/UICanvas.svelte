<script lang="ts">
	import { dndzone, TRIGGERS, SOURCES, SHADOW_PLACEHOLDER_ITEM_ID } from 'svelte-dnd-action'
	import { createEventDispatcher, onMount } from 'svelte'
	import MobileFrame from './MobileFrame.svelte'
	import selected from './stores/selected'
	import CanvasActions from '../../modules/warp/canvasActions'
	import NestedContent from './NestedContent.svelte'

	import {
		Container,
		ScrollContainer,
		Label,
		Button,
		VideoPlayer,
		Image,
		Generic
	} from '../warp/widgets/index'

	export let items: Array<any>
	let copiedItem

	let dragDisabled = true
	let isFinalCanvas = false

	$: items && canvasChanged()

	selected.subscribe((data: Record<string, unknown>) => {
		if (data && data.style && data.id) {
			const idx = items.findIndex((item) => item.id === data.id)
			const style = {}
			if (data.style.hasOwnProperty(`:global(#${data.widget}${data.id})`)) {
				style[`:global(#${data.widget}${data.id})`] =
					data.style[`:global(#${data.widget}${data.id})`]
			} else {
				style[`#${data.widget}${data.id}`] = data.style[`#${data.widget}${data.id}`]
			}
			if (items[idx]) {
				items[idx].style = style
			}
		}
	})

	const flipDurationMs = 0
	const dispatch = createEventDispatcher()

	const onKeyCombo = (e: {
		preventDefault: () => void
		stopPropagation: () => void
		keyCode: any
	}) => {
		e.preventDefault()
		e.stopPropagation()
		if (
			document.activeElement.className.includes('selector') ||
			document.activeElement.parentElement.className.includes('selector')
		) {
			const key = e.keyCode
			if (key === 8 || key === 46) {
				console.log('delete')
				if ($selected) {
					const localSelect: Record<string, unknown> = $selected as any
					deleteItem(localSelect)
				}
			} else if (interceptCopyKeys(e)) {
				console.log('copy')
				if ($selected) {
					const localSelect: Record<string, unknown> = $selected as any
					copiedItem = localSelect
				}
			} else if (interceptPasteKeys(e)) {
				console.log('paste')
				if (copiedItem) {
					pasteInItem(copiedItem)
				}
			}
		}
	}

	const generateUniqueID = (id): number => {
		const newID = id + Math.round(Math.random() * 100)
		const idExists = items.some((item) => item.id === newID)
		if (idExists) {
			return generateUniqueID(id)
		} else {
			return newID
		}
	}

	const pasteInItem = (item) => {
		const newId = generateUniqueID(item.id)
		let newItem
		const style = {}
		if (item.style.hasOwnProperty(`:global(#${item.widget}${item.id})`)) {
			style[`:global(#${item.widget}${item.id})`] = item.style[`:global(#${item.widget}${item.id})`]
		} else {
			style[`#${item.widget}${newId}`] = item.style[`#${item.widget}${item.id}`]
		}
		newItem = { ...item, id: newId, style }
		items.push(newItem)
		items = [...items]
		console.log(items)
		canvasChanged()
	}

	function disableCopyPaste(elm) {
		elm.oncontextmenu = () => {
			return false
		}
	}

	function interceptCopyKeys(evt) {
		evt = evt || window.event
		const c = evt.keyCode
		const ctrlDown = evt.ctrlKey || evt.metaKey

		if (ctrlDown && c == 67) return true
		else if (ctrlDown && evt.altKey) return false
		else if (ctrlDown && c == 86) return false
		else if (ctrlDown && c == 88) return false

		return false
	}

	function interceptPasteKeys(evt) {
		evt = evt || window.event
		const c = evt.keyCode
		const ctrlDown = evt.ctrlKey || evt.metaKey

		if (ctrlDown && c == 86) return true
		else if (ctrlDown && c == 67) return false
		else if (ctrlDown && c == 86) return false
		else if (ctrlDown && c == 88) return false

		return false
	}

	function canvasChanged() {
		if (isFinalCanvas) {
			dispatch('message', {
				items
			})
		}
	}

	const makeMovable = () => {
		const canvas: HTMLElement = document.querySelector('.column-content') as HTMLElement

		if (canvas) {
			const canvasActions = new CanvasActions(canvas)
			const canvasSelectors = Array.from(canvas.querySelectorAll('.selector')) as HTMLElement[]
			canvasActions.makeItemResizable(canvasSelectors)
		}
	}

	const makeItemMovable = (item: HTMLElement) => {
		const canvas: HTMLElement = document.querySelector('.column-content') as HTMLElement

		if (canvas) {
			const canvasActions = new CanvasActions(canvas)

			canvasActions.makeItemResizable(item)
		}
	}

	const deleteItem = (selectItem) => {
		const idx = items.findIndex((item) => item.id === selectItem.id)
		selected.update((select) => null)
		items.splice(idx, 1)
		items = [...items]
		canvasChanged()
	}

	function handleConsider(e) {
		e.stopPropagation()

		const {
			items: newItems,
			info: { source, trigger }
		} = e.detail
		isFinalCanvas = false
		items = newItems
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			dragDisabled = true
		}
	}
	function handleFinalize(e) {
		e.stopPropagation()
		const {
			items: newItems,
			info: { source }
		} = e.detail
		isFinalCanvas = true
		items = newItems
		if (source === SOURCES.POINTER) {
			dragDisabled = true
		}
	}

	function handleChildAction(e) {
		const detail = e.detail
		if (detail) {
			const item = detail.item
			const type = detail.type
			switch (type) {
				case 0:
					deleteItem(item)
					break
				case 1:
					pasteInItem(item)
					break
				default:
					console.log(type)
			}
		}
	}

	function canvasInFocus(e) {
		e.stopPropagation()
		removeSelectorHighlights()
	}

	function removeSelectorHighlights() {
		selected.update((select) => null)
		const columnContent = document.querySelector('.column-content')
		const selectors = columnContent.querySelectorAll('.selector')
		const handles = columnContent.querySelectorAll('.handle')
		selectors.forEach((selector) => {
			const tmpSelector: HTMLElement = selector as HTMLElement
			tmpSelector.style.border = '0px solid transparent'
		})

		handles.forEach((handle) => {
			const tmpHandle: HTMLElement = handle as HTMLElement
			tmpHandle.style.display = 'none'
		})
	}

	function onItemSelected(e, item) {
		e.stopPropagation()
		if (e.target.parentElement.className.includes('selector')) {
			removeSelectorHighlights()
			selected.update((select) => item)
			console.log(e.target.parentNode.parentElement.className)
			e.target.parentElement.style.border = '2px solid yellow'
			e.target.parentElement.querySelector('.handle').style.display = 'flex'
		}
	}

	function startDrag(e) {
		e.preventDefault()
		dragDisabled = false
	}
	function handleKeyDown(e: KeyboardEvent) {
		if ((e.key === 'Enter' || e.key === ' ') && dragDisabled) dragDisabled = false
	}

	onMount(async () => {
		disableCopyPaste(document.querySelector('.column-content'))
	})
</script>

<!-- <svelte:window on:keydown="{onKeyCombo}" /> -->

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
						on:click="{canvasInFocus}"
						on:keydown="{onKeyCombo}"
					>
						{#each items.filter((item) => item.id !== SHADOW_PLACEHOLDER_ITEM_ID) as item (item.id)}
							<div on:click="{(e) => onItemSelected(e, item)}" class="selector">
								<div
									tabindex="{dragDisabled ? 0 : -1}"
									aria-label="drag-handle"
									class="handle"
									style="{dragDisabled ? 'cursor: grab' : 'cursor: grabbing'}"
									on:mousedown="{startDrag}"
									on:touchstart="{startDrag}"
									on:keydown="{handleKeyDown}"
								></div>
								{#if item.widget === 'container'}
									{#if item.hasOwnProperty('items')}
										<Container css="{item.style}" id="{`${item.widget}${item.id}`}"
											><NestedContent
												bind:items="{item.items}"
												parent="{item}"
												on:message="{handleChildAction}"
											/></Container
										>
									{:else}
										<Container css="{item.style}" id="{`${item.widget}${item.id}`}"
											>{item.value ?? ''}</Container
										>
									{/if}
								{:else if item.widget == 'label'}
									<Label
										css="{item.style}"
										id="{`${item.widget}${item.id}`}"
										bind:value="{item.value}">{item.value ?? ''}</Label
									>
								{:else if item.widget == 'scrollContainer'}
									<ScrollContainer css="{item.style}" id="{`${item.widget}${item.id}`}"
										>{item.value ?? ''}</ScrollContainer
									>
								{:else if item.widget == 'button'}
									<Button
										css="{item.style}"
										bind:value="{item.value}"
										id="{`${item.widget}${item.id}`}">{item.value ?? ''}</Button
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
								{:else}
									<Generic
										tag="{item.widget}"
										css="{item.style}"
										id="{`${item.widget}${item.id}`}"
										bind:value="{item.value}"
									/>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</section>
		</MobileFrame>
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
		height: calc(100% - 40px);
		width: 100%;
		padding: 0;
		margin: 0em;
		margin-top: 0px;
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
		display: none;
	}

	@media all and (min-width: 480px) {
		.temp-wrapper {
			width: 80%;
			margin: 0px auto;
		}
	}
</style>
