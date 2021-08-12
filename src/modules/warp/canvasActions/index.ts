import Moveable from 'moveable'

class CanvasActions {
	canvas: HTMLElement
	constructor(canvas: HTMLElement | undefined) {
		if (!canvas) throw new Error('Please provide a valid canvas element')
		this.canvas = canvas
	}

	public makeItemResizable(items: Array<HTMLElement> | HTMLElement): void {
		const moveable = new Moveable(this.canvas, {
			target: items,
			resizable: true,
			keepRatio: false,
			throttleResize: 1,
			edge: true,
			zoom: 0.5,
			origin: true
		})

		const frame = {
			translate: [0, 0]
		}
		moveable
			.on('resizeStart', (e) => {
				e.setOrigin(['%', '%'])
				e.dragStart && e.dragStart.set(frame.translate)
			})
			.on('resize', (e) => {
				const beforeTranslate = e.drag.beforeTranslate

				frame.translate = beforeTranslate
				e.target.style.width = `${e.width}px`
				e.target.style.height = `${e.height}px`
				e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`
			})
	}
}

export default CanvasActions
