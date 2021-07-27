<!-- <script>
	import { draggable } from 'svelte-agnostic-draggable'
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
	} from '../warp/widgets/index'
	import mapTouchToMouseFor from 'svelte-touch-to-mouse'
	mapTouchToMouseFor('.draggable')

	/**** Svelte Event Handling ****/

	function onDraggableInit() {
		console.log('Draggable was created')
	}
	function onDragStart() {
		console.log('dragging started')
	}
	function onDragMove() {
		console.log('dragging continues')
	}
	function onDragStop(item) {
    console.log(item)
		console.log('dragging was stopped')
	}
	function onDraggableDestroy() {
		console.log('Draggable was destroyed')
	}

	export let canvas = [
		{ id: 51, name: 'label', widget: 'label' },
		{ id: 52, name: 'text box', widget: 'textBox' },
		{ id: 53, name: 'container', widget: 'container' },
		{ id: 54, name: 'scroll container', widget: 'scrollContainer' },
		{ id: 55, name: 'image', widget: 'image' },
		{ id: 56, name: 'button', widget: 'button' },
		{ id: 57, name: 'video player', widget: 'videoPlayer' },
		{ id: 58, name: 'audio player', widget: 'container' },
		{ id: 59, name: 'checkbox', widget: 'container' },
		{ id: 60, name: 'list view', widget: 'container' },
		{ id: 61, name: 'text input', widget: 'textInput' }
	]
</script>

<div
	style="
  display:block; position:relative;
  width:100%; height:100%;
  margin:0;
"
>
	{#each canvas as item (item.id)}
		<div
      id="{item.id}"
			class="draggable"
			use:draggable={{
        containment:'parent', 
        cursor:'grabbing'
      }}
			on:draggable:init="{onDraggableInit}"
			on:draggable:destroy="{onDraggableDestroy}"
			on:drag:start="{onDragStart}"
			on:drag:move="{onDragMove}"
			on:drag:stop="{() => onDragStop(item)}"
		>

    
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
			{:else if item.widget === 'image'}
				<Image id="{item.id}" />
			{/if}
    </div>
	{/each}
</div>

<style>
	.draggable {
		-webkit-touch-callout: none;
		-ms-touch-action: none;
		touch-action: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

  .title {
    display:block; 
    position:absolute;
    left:2px; 
    top:-10px; 
    width:20px; 
    height:20px; 
    background-color:white;
    border-radius: 3px;
    cursor:grab;
  }
</style> -->

<!------------------------------------------------------------------------------
--  for additional, more detailled examples visit                             --
--  https://github.com/rozek/svelte-agnostic-draggable/blob/main/README.md    --
------------------------------------------------------------------------------->

<style>
  .draggable {
    -webkit-touch-callout:none;
    -ms-touch-action:none; touch-action:none;
    -moz-user-select:none; -webkit-user-select:none; -ms-user-select:none; user-select:none;
  }

  .resizable {
    display:block; position:absolute;
    right:0px; bottom:0px; width:32px; height:32px;
    background-color:transparent;
    background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAiklEQVRYR+WUwQ3AIAwDm3UzUNZtxQ8hhBpIbGhZIKezsVzkJ4z7ZnaXu6oq/wSorVMMwAHqzNvOQQzQAUY/DWIADjBSXmDSd4AO4FnXb3TAozxlB+gAnsxTDMABVpSH7AAdYEX5mR2IVD5lgA4QmfmUAThApvJXO0AHyFS+ZweQyrsG6ADIzNtbD4OSoCHdTWtaAAAAAElFTkSuQmCC");
    cursor:nwse-resize;
  }
  
</style>

<script>
  import { draggable } from 'svelte-agnostic-draggable'
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

/**** map all touch events to mouse events ****/

  import mapTouchToMouseFor from 'svelte-touch-to-mouse'
  mapTouchToMouseFor('.draggable')

/**** Svelte Event Handling ****/

  function onDraggableInit ()    { console.log('Draggable was created') }
  function onDragStart ()        { console.log('dragging started') }
  function onDragMove ()         { console.log('dragging continues') }
  function onDragStop ()         { console.log('dragging was stopped') }
  function onDraggableDestroy () { console.log('Draggable was destroyed') }


  let Width    = 200, Height    = 120
  let minWidth = 200, minHeight = 80
  let maxWidth = 300, maxHeight = 300

  let resizing = false
  let initialX, initialY, initialWidth, initialHeight

/**** Svelte Event Handling ****/

  function onDragMoveResize (Event) {
    if (resizing) {
      Width  = Math.max(minWidth,  Math.min(maxWidth, initialWidth  + (Event.detail.position.left-initialX)))
      Height = Math.max(minHeight, Math.min(maxHeight,initialHeight + (Event.detail.position.top -initialY)))
    } else {
      initialX = Event.detail.position.left; initialWidth  = Width
      initialY = Event.detail.position.top;  initialHeight = Height
      resizing = true
    }
  }
  function onDragStopResize () { resizing = false }


</script>

<div style="
  display:block; position:relative;
  width:100%; height:100%;
  border:solid 1px black
">
  <div class="draggable" use:draggable={{
    containment:'parent', cursor:'grabbing'
  }} style="
    display:block; position:absolute;
    
    padding:10px; background:forestgreen; color:white; cursor:grab
  " on:draggable:init={onDraggableInit} on:draggable:destroy={onDraggableDestroy}
    on:drag:start={onDragStart} on:drag:move={onDragMove} on:drag:stop={onDragStop}
  ><Container/><div class="draggable resizable" use:draggable={{
    helper:'clone', revert:true
  }}
    on:drag:move={onDragMoveResize} on:drag:stop={onDragStopResize}
  ></div></div>
</div>