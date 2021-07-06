<script land="ts">
	import { flip } from 'svelte/animate'
	import { dndzone, TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action'
	import Icon from 'svelte-awesome'
	import { image, square, camera, videoCamera, textWidth, textHeight } from 'svelte-awesome/icons'

	let items = [
		{ id: 51, name: 'label', icon: textHeight, widget: 'label' },
		{ id: 52, name: 'text box', icon: textWidth, widget: 'textBox' },
		{ id: 53, name: 'container', icon: square, widget: 'container' },
		{ id: 54, name: 'scroll container', icon: square, widget: 'scrollContainer' },
		{ id: 55, name: 'image', icon: image, widget: 'container' },
		{ id: 56, name: 'button', icon: square, widget: 'button' },
		{ id: 57, name: 'video player', icon: videoCamera, widget: 'container' },
		{ id: 58, name: 'audio player', icon: textWidth, widget: 'container' },
		{ id: 59, name: 'checkbox', icon: square, widget: 'container' },
		{ id: 60, name: 'list view', icon: square, widget: 'container' },
		{ id: 61, name: 'text input', icon: textWidth, widget: 'textInput' }
	]

	const flipDurationMs = 300
	let shouldIgnoreDndEvents = false
	function handleDndConsider(e) {
		const { trigger, id } = e.detail.info
		if (trigger === TRIGGERS.DRAG_STARTED) {
			const idx = items.findIndex((item) => item.id === id)
			const newId = `${id}_copy_${Math.round(Math.random() * 100000)}`

			e.detail.items = e.detail.items.filter((item) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME])
			e.detail.items.splice(idx, 0, { ...items[idx], id: newId })
			items = e.detail.items
			shouldIgnoreDndEvents = true
		} else if (!shouldIgnoreDndEvents) {
			items = e.detail.items
		} else {
			items = [...items]
		}
	}
	function handleDndFinalize(e) {
		console.warn(`got finalize ${JSON.stringify(e.detail, null, 2)}`)
		if (!shouldIgnoreDndEvents) {
			items = e.detail.items
		} else {
			items = [...items]
			shouldIgnoreDndEvents = false
		}
	}
</script>

<section
	id="ui_controls"
	use:dndzone="{{ items, flipDurationMs }}"
	on:consider="{handleDndConsider}"
	on:finalize="{handleDndFinalize}"
>
	{#each items as item (item.id)}
		<div animate:flip="{{ duration: flipDurationMs }}">
			<Icon data="{item.icon}" />{item.name}
		</div>
	{/each}
</section>

<style>
	#ui_controls {
		position: relative;
		margin-top: 0;
		height: 100%;
		width: 100%;
		color: white;
		background-color: #1e1e1e;
	}
	#ui_controls div {
		width: 95%;
		border-radius: 0.2rem;
		border: 1px solid white;
		height: 20px;
		padding: 10px;
		padding-right: 0;
	}
</style>
