import { writable } from 'svelte/store'

export const activeStyle = writable({
	color: 'black',
	'background-color': 'white',
	'line-height': '0.2rem'
})
