/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="svelte" />
/// <reference types="vite/client" />

declare type DndEvent = import('svelte-dnd-action').DndEvent
declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onconsider?: (event: CustomEvent<DndEvent> & { target: EventTarget & T }) => void
		onfinalize?: (event: CustomEvent<DndEvent> & { target: EventTarget & T }) => void
	}
}
