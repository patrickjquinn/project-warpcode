<script lang="ts">
	import { flip } from 'svelte/animate'
	import { dndzone } from 'svelte-dnd-action'
    import { createEventDispatcher } from 'svelte';
	import {
		Container,
		ScrollContainer,
		Label,
		TextBox,
		TextInput,
		Button
	} from './warp/widgets/index'
	let columnItems = [
		{
			id: 1,
			items: []
		}
	]

	const flipDurationMs = 200
    const dispatch = createEventDispatcher();

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

    function canvasChanged () {
        dispatch('message', {
			items: columnItems[0].items
		})
    }
</script>

<section
	class="board"
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
						<Container />
					{:else if item.widget === 'label'}
						<Label />
					{:else if item.widget === 'scrollContainer'}
						<ScrollContainer />
					{:else if item.widget === 'button'}
						<Button />
					{:else if item.widget === 'textInput'}
						<TextInput />
					{:else if item.widget === 'textBox'}
						<TextBox />
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</section>

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
		float: left;
		overflow-y: hidden;
	}
	.column-content {
		height: 100%;
		overflow-y: scroll;
	}
</style>
