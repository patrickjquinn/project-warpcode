<script>
	import * as knobby from 'svelte-knobby'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	function styleUpdated() {
		dispatch('message', styleProperties)
	}

	$: {
		styleUpdated()
	}

	export let styleProperties = {
		message: 'Hello World!',
		color: '#ff3e00',
		clicks: 0,
		checked: false,

		increment: (value) => ({
			...value,
			clicks: value.clicks + 1
		}),

		constrained: {
			$label: 'labelled input',
			value: 50,
			min: 0,
			max: 100,
			step: 1
		},

		folder: {
			$label: 'labelled folder',
			a: 1,
			b: 2,
			nested: {
				c: 3,
				d: 4
			}
		}
	}

	const controls = knobby.panel(styleProperties)
</script>
