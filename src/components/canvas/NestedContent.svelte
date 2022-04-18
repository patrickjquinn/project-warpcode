<script lang="ts">
	import { dndzone, TRIGGERS, SOURCES, SHADOW_PLACEHOLDER_ITEM_ID } from 'svelte-dnd-action'
	import NestedContent from './NestedContent.svelte'
	import { createEventDispatcher, onMount } from 'svelte'
	import selected from './stores/selected'

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
	export let parent: { id?: any }
	export let onAction: any
	let copiedItem: Record<string, unknown>

	let dragDisabled = true
	let isFinalCanvas = false

	// $: items && canvasChanged()

	selected.subscribe((data: Record<string, unknown>) => {
		if (data && data.style && data.id) {
			const idx = items.findIndex((item) => item.id === data.id)
			const style = {}
			style[`#${data.widget}${data.id}`] = data.style[`#${data.widget}${data.id}`]
			if (items[idx]) {
				items[idx].style = style
			}
		}
	})

	const flipDurationMs = 50
	// const dispatch = createEventDispatcher()

	const onKeyCombo = (e: {
		preventDefault: () => void
		stopPropagation: () => void
		keyCode: any
	}) => {
		e.preventDefault()
		e.stopPropagation()
		if (
			document.activeElement.className.includes('selector') ||
			document.activeElement.parentElement.className.includes('selector') ||
			document.activeElement.parentElement.parentElement.className.includes('selector')
		) {
			const key = e.keyCode
			if (key === 8 || key === 46) {
				console.log('delete inner')
				const localSelect: Record<string, unknown> = $selected as any

				if (localSelect && localSelect.id != parent.id) {
					const localSelect: Record<string, unknown> = $selected as any
					deleteItem(localSelect)
				} else {
					handleSelfDelete(e)
				}
			} else if (interceptCopyKeys(e)) {
				console.log('copy inner')
				if ($selected) {
					const localSelect: Record<string, unknown> = $selected as any
					copiedItem = localSelect
				}
			} else if (interceptPasteKeys(e)) {
				console.log('paste inner')
				if (copiedItem) {
					if (copiedItem.id != parent.id) {
						pasteInItem(copiedItem)
					} else {
						handleSelfReplicate(e)
					}
				}
			}
		}
	}

	const deleteItem = (selectItem: Record<string, unknown>) => {
		const idx = items.findIndex((item) => item.id === selectItem.id)
		selected.update((select) => {
			return null
		})
		items.splice(idx, 1)
		items = [...items]
	}

	const generateUniqueID = (id: number): number => {
		const newID = id + Math.round(Math.random() * 100)
		const idExists = items.some((item) => item.id === newID)
		if (idExists) {
			return generateUniqueID(id)
		} else {
			return newID
		}
	}

	const pasteInItem = (item: Record<string, unknown>) => {
		const id: number = item.id as number
		const newId = generateUniqueID(id)
		let newItem
		const style = {}
		style[`#${item.widget}${newId}`] = item.style[`#${item.widget}${id}`]
		newItem = { ...item, id: newId, style }
		items.push(newItem)
		items = [...items]
		console.log(items)
	}

	function disableCopyPaste(elm) {
		elm.oncontextmenu = function () {
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

	function removeSelectorHighlights() {
		selected.update((select) => {
			return null
		})
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
			selected.update((select) => {
				return item
			})
			console.log(e.target.parentElement.className)
			e.target.parentElement.style.border = '2px solid yellow'
			e.target.parentElement.querySelector('.handle').style.display = 'flex'
		} else {
			console.log(e.target.firstChild.className)
		}
	}

	function startDrag(e) {
		e.preventDefault()
		dragDisabled = false
	}
	function handleKeyDown(e: KeyboardEvent) {
		if ((e.key === 'Enter' || e.key === ' ') && dragDisabled) dragDisabled = false
	}

	function focusUpper(e) {
		e.stopPropagation()
		if (e.target.parentElement.parentElement.className.includes('selector')) {
			const target = e.target.parentElement.parentElement
			removeSelectorHighlights()
			selected.update((select) => {
				return parent
			})
			console.log(target.className)
			target.style.border = '2px solid yellow'
			target.querySelector('.handle').style.display = 'flex'
		}
	}

	function handleSelfDelete(e) {
		if (onAction) {
			onAction({
				item: parent,
				type: 0
			})
		}
	}

	function handleSelfReplicate(e) {
		if (onAction) {
			onAction({
				item: parent,
				type: 1
			})
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

	onMount(async () => {
		disableCopyPaste(document.querySelector(`#main${parent.id}`))
	})
</script>

<!-- <svelte:window on:keydown="{onKeyCombo}" /> -->

<div
	on:keydown="{onKeyCombo}"
	id="{`main${parent.id}`}"
	class="column"
	use:dndzone="{{ items, dragDisabled, flipDurationMs }}"
	on:consider="{handleConsider}"
	on:finalize="{handleFinalize}"
	on:click="{focusUpper}"
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
							onAction="{handleChildAction}"
						/></Container
					>
				{:else}
					<Container css="{item.style}" id="{`${item.widget}${item.id}`}"
						>{item.value ?? ''}</Container
					>
				{/if}
			{:else if item.widget == 'label'}
				<Label css="{item.style}" id="{`${item.widget}${item.id}`}" bind:value="{item.value}"
					>{item.value ?? ''}</Label
				>
			{:else if item.widget == 'scrollContainer'}
				<ScrollContainer css="{item.style}" id="{`${item.widget}${item.id}`}"
					>{item.value ?? ''}</ScrollContainer
				>
			{:else if item.widget == 'button'}
				<Button css="{item.style}" bind:value="{item.value}" id="{`${item.widget}${item.id}`}"
					>{item.value ?? ''}</Button
				>
			{:else if item.widget == 'videoPlayer'}
				<VideoPlayer
					css="{item.style}"
					src="{item.value ?? ''}}"
					id="{`${item.widget}${item.id}`}"
				/>
			{:else if item.widget == 'image'}
				<Image css="{item.style}" src="{item.value ?? ''}" id="{`${item.widget}${item.id}`}" />
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

<style>
	.column {
		height: 100%;
		width: 100%;
		padding: 0;
		margin: 0em;
		margin-top: 0px;
		float: left;
	}

	.handle {
		position: absolute;
		right: 0;
		width: 1rem;
		height: 1rem;
		background-color: darkslategrey;
		display: none;
	}
</style>
