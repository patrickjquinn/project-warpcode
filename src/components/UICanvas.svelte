<script>
	import { dndzone, TRIGGERS } from 'svelte-dnd-action'
	import { createEventDispatcher } from 'svelte'
	import {
		Container,
		ScrollContainer,
		Label,
		TextBox,
		TextInput,
		Button,
		VideoPlayer,
		Image
	} from './warp/widgets/index'

	export let items = []
	let selectedItem

	const flipDurationMs = 100
	const dispatch = createEventDispatcher()

	$: {
		console.log(`❤️${JSON.stringify(items, null, 2)}`)
	}

	const onKeyCombo = (e) => {
		const key = e.keyCode;
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
		if (trigger === TRIGGERS.DROPPED_INTO_ZONE){
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

<svelte:window on:keydown={onKeyCombo}/>

<div id="canvas_container">
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
					<div class="px__screen__frame">
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
												<Container id="{`${item.widget}${`${item.widget}${item.id}`}`}"
													>{item.value ?? ''}</Container
												>
											{:else if item.widget === 'label'}
												<Label css="{item.style}" id="{`${item.widget}${item.id}`}"
													>{item.value ?? ''}</Label
												>
											{:else if item.widget === 'scrollContainer'}
												<ScrollContainer id="{`${item.widget}${item.id}`}"
													>{item.value ?? ''}</ScrollContainer
												>
											{:else if item.widget === 'button'}
												<Button id="{`${item.widget}${item.id}`}">{item.value ?? ''}</Button>
											{:else if item.widget === 'textInput'}
												<TextInput value="{item.value ?? ''}" id="{`${item.widget}${item.id}`}" />
											{:else if item.widget === 'textBox'}
												<TextBox value="{item.value ?? ''}" id="{`${item.widget}${item.id}`}" />
											{:else if item.widget === 'videoPlayer'}
												<VideoPlayer src="{item.value ?? ''}}" id="{`${item.widget}${item.id}`}" />
											{:else if item.widget === 'image'}
												<Image src="{item.value ?? ''}" id="{`${item.widget}${item.id}`}" />
											{/if}
										</div>
									{/each}
								</div>
							</div>
						</section>
						<!-- <section
							class="board device-content"
							use:dndzone="{{ items: items, flipDurationMs, type: 'columns' }}"
							on:consider="{handleDndConsiderColumns}"
							on:finalize="{handleDndFinalizeColumns}"
						>
							{#each items as column (column.id)}
								<div class="column" animate:flip="{{ duration: flipDurationMs }}">
									<div
										class="column-content"
										use:dndzone="{{ items: column.items, flipDurationMs }}"
										on:consider="{(e) => handleDndConsiderCards(column.id, e)}"
										on:finalize="{(e) => handleDndFinalizeCards(column.id, e)}"
									>
										{#each column.items as item (item.id)}
											{#if item.widget === 'container'}
												<Container id="{`${item.widget}${item.id}`}">{item.value ?? ''}</Container>
											{:else if item.widget === 'label'}
												<Label css="{item.style}" id="{`${item.widget}${item.id}`}">{item.value ?? ''}</Label>
											{:else if item.widget === 'scrollContainer'}
												<ScrollContainer id="{`${item.widget}${item.id}`}">{item.value ?? ''}</ScrollContainer>
											{:else if item.widget === 'button'}
												<Button id="{`${item.widget}${item.id}`}">{item.value ?? ''}</Button>
											{:else if item.widget === 'textInput'}
												<TextInput value={item.value ?? ''} id="{`${item.widget}${item.id}`}"/>
											{:else if item.widget === 'textBox'}
												<TextBox id="{`${item.widget}${item.id}`}" />
											{:else if item.widget === 'videoPlayer'}
												<VideoPlayer src="{item.value ?? ''}}" id="{`${item.widget}${item.id}`}" />
											{:else if item.widget === 'image'}
												<Image src="{item.value ?? ''}" id="{`${item.widget}${item.id}`}" />
											{/if}
										{/each}
									</div>
								</div>
							{/each}
						</section> -->
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.selector {
	}
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

	.px {
		position: relative;
		padding: 6% 7%;
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

	.px__body__speaker,
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

	.px__body__sensor {
		top: 4%;
		left: 61%;
		width: 2.2%;
		height: 1.1%;
		border-radius: 50%;
		background-color: #2a4a73;
		box-shadow: inset 0 0 2px 1px #000;
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

	.px__body__mute {
		top: 14.7%;
		left: -0.7%;
		width: 0.7%;
		height: 4%;
		border-radius: 1px 0 0 1px;
	}

	.px__body__up,
	.px__body__down {
		left: -1%;
		width: 1%;
		height: 7.5%;
		border-radius: 2px 0 0 2px;
	}

	.px__body__up {
		top: 25%;
	}

	.px__body__down {
		top: 34%;
	}

	.px__body__right {
		top: 25%;
		right: -1%;
		width: 1%;
		height: 7.5%;
		border-radius: 0 2px 2px 0;
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
</style>
