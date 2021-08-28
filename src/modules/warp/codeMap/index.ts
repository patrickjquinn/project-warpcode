import { parse } from 'himalaya'

import cssbeautify from 'cssbeautify'
import * as Css from 'json-to-css'
import { validate } from 'csstree-validator'
import css2json from 'css2json'
export class CodeMap {
	lang: string
	constructor(lang: string) {
		this.lang = lang
	}

	private static capFirstLetter(input: string): string {
		return input.charAt(0).toUpperCase() + input.slice(1)
	}

	public validateCssString(cssString: string): boolean {
		const validateCSS = validate(cssString)
		if (validateCSS.length !== 0) {
			return false
		}
		return true
	}

	public mapToCode(canvas: Record<string, unknown>): string {
		const items: Array<Record<string, unknown>> = canvas.items as Array<Record<string, unknown>>
		let scriptItems = ``
		let mainItems = ``
		let cssItems = ``
		for (const item of items) {
			const widgetType: string = item.widget as string
			const widgetID: string = item.id as string
			let widgetValue: string = item.value as string
			let contentType: string = item.contentsType as string

			if (!widgetValue) {
				widgetValue = ''
			}
			if (!contentType) {
				contentType = 'slot'
			}

			cssItems = cssItems + this.extractStyleAndCodeify(item)

			if (!scriptItems.includes(`{ ${CodeMap.capFirstLetter(widgetType)} }`)) {
				scriptItems =
					scriptItems + `import { ${CodeMap.capFirstLetter(widgetType)} } from "@components/warp/"
	`
			}

			const widget = this.transformTemplateToWidget({
				type: contentType,
				widget: widgetType,
				value: widgetValue,
				id: widgetID,
				item
			})

			if (item === items[items.length - 1]) {
				mainItems = mainItems + `${widget}`
			} else {
				mainItems =
					mainItems +
					`${widget}
            `
			}
		}

		return `
        <script lang="${this.lang}">
            ${scriptItems.trim()}
        </script>

        <main>
            ${mainItems.trim()}
        </main>

		<style>
			${cssItems.trim()}
		</style>
        `
	}

	public convertCSSJSONtoInline(css: Record<string, unknown>, id: string): string {
		let styled = ''

		if (!id.includes('placeholder')) {
			const mapped = this.convertJSONToCSS(css)

			if (mapped) {
				const validateCSS = validate(mapped)
				if (validate(mapped).length !== 0) {
					console.log(`Invalid CSS on widget ${id} : ${validateCSS}`)
					return ``
				}
				const styleSplit = mapped.split(`#${id}`)
				if (styleSplit?.length > 0) {
					const splitValue = styleSplit[1].trim()
					if (splitValue?.includes('{') && splitValue?.includes('}')) {
						styled = styleSplit[1].replace('{', '').replace('}', '').trim()
					}
				}
			}
		}
		return styled
	}

	public convertCodeToCanvas(code: string): Array<unknown> {
		const json = parse(code)

		let canvas = []
		const cssItems = []

		for (const item of json) {
			if (item.tagName === 'main') {
				for (const inner of item.children) {
					if (inner.type === 'element') {
						canvas.push(this.transformCodeToCanvas(inner))
					}
				}
			} else if (item.tagName === 'style') {
				for (const style of item.children) {
					if (style.type === 'text') {
						const formatted = this.convertCSSToJSON(style.content)

						if (formatted) {
							cssItems.push(formatted)
						}
					}
				}
			}
		}

		canvas = this.mapStylesToAllCanvasItems(canvas, cssItems)

		return canvas
	}

	private mapStylesToAllCanvasItems(canvas, cssItems) {
		if (canvas?.length > 0 && cssItems?.length > 0) {
			for (let i = 0; i < canvas.length; i++) {
				const item = canvas[i]
				const id = `#${item.widget}${item.id}`

				const styleItem = this.fetchRelevantCSSTag(id, cssItems)
				if (styleItem) {
					canvas[i].style = styleItem
				}

				const subCanvasItems: Array<Record<string, unknown>> = item.items

				if (subCanvasItems?.length > 0) {
					canvas[i].items = this.mapStylesToAllCanvasItems(subCanvasItems, cssItems)
				}
			}
		}
		return canvas
	}

	private extractStyleAndCodeify(item) {
		const widgetStyle: Record<string, unknown> = item.style as Record<string, unknown>
		let contentType: string = item.contentsType as string
		let cssItems = ``


		if (!contentType) {
			contentType = 'slot'
		}

		cssItems = cssItems + this.convertJSONToCSS(widgetStyle)

		if (contentType === 'slot') {
			const subItems: Array<Record<string, unknown>> = item.items as Array<Record<string, unknown>> | null
			if (subItems?.length > 0) {
				for (const subStyle of subItems) {
					cssItems = cssItems + this.extractStyleAndCodeify(subStyle)
				}
			}
		}

		return cssItems
	}

	private transformTemplateToWidget({ type, widget, value, id, item }): string {
		const defaultWidgets = ['Label', 'Container', 'ScrollContainer', 'TextBox', 'VideoPlayer', 'TextInput', 'Image', 'Button']

		if (type === 'slot') {
			if (item.items?.length > 0) {
				let innerItem = '\n'
				for (const inner of item.items) {
					const widgetType: string = inner.widget as string
					const widgetID: string = inner.id as string
					let widgetValue: string = inner.value as string
					let contentType: string = inner.contentsType as string

					if (!widgetValue) {
						widgetValue = ''
					}
					if (!contentType) {
						contentType = 'slot'
					}
					const transformedInner = this.transformTemplateToWidget({
						type: contentType,
						widget: widgetType,
						value: widgetValue,
						id: widgetID,
						item: inner
					})
					innerItem += `${transformedInner}\n`
				}
				if (defaultWidgets.includes(CodeMap.capFirstLetter(widget))) {
					return `<${CodeMap.capFirstLetter(widget)} id="${widget + id
						}">${innerItem}</${CodeMap.capFirstLetter(widget)}>`
				}
				return `<${widget} id="${widget + id
					}">${innerItem}</${widget}>`

			}
			if (defaultWidgets.includes(CodeMap.capFirstLetter(widget))) {
				return `<${CodeMap.capFirstLetter(widget)} id="${widget + id
					}">${value}</${CodeMap.capFirstLetter(widget)}>`
			}
			return `<${widget} id="${widget + id
				}">${value}</${widget}>`

		}
		if (defaultWidgets.includes(CodeMap.capFirstLetter(widget))) {
			return `<${CodeMap.capFirstLetter(widget)} ${type}="${value}" id="${widget + id}"/>`
		}
		return `<${widget} ${type}="${value}" id="${widget + id}"/>`
	}

	private fetchRelevantCSSTag(id: string, css: Array<Record<string, unknown>>) {
		const obj = { }
		for (const style of css) {
			if (style[id]) {
				obj[`${id}`] = style[id]
				return obj
			}
		}
		return null
	}

	private transformCodeToCanvas(item) {
		let id: number
		const widget = item.tagName
		let contentsType = ''
		let value = ''

		// Come back to this, this is a blind stab of a fix.
		if (!item.attributes) return { }

		for (const obj of item.attributes) {
			if (obj.key === 'src' || obj.key === 'value') {
				contentsType = obj.key
				value = obj.value
			}

			if (obj.key === 'id') {
				id = parseInt(obj.value.split(item.tagName)[1])
			}
		}

		if (contentsType.length === 0) {
			contentsType = 'slot'
		}

		if (value.length === 0 && item.children.length > 0) {
			for (const child of item.children) {
				value += child['content'] as string
			}
		}

		if (item.tagName.toLowerCase() === 'container' && item.children?.length > 0) {
			const items = []
			for (const child of item.children) {
				if (child.type === 'element') {
					items.push(this.transformCodeToCanvas(child))
				}
			}
			console.log("HELLO")
			return {
				id,
				name: widget,
				widget,
				value,
				contentsType,
				items
			}
		}

		return {
			id,
			name: widget,
			widget,
			value,
			contentsType
		}
	}

	private convertCSSToJSON(css: string) {
		css = css.replaceAll('\t', '').trim()

		if (css.length > 0) {
			const beautified = cssbeautify(css, {
				autosemicolon: true
			})

			return css2json(beautified)
		}

		return null
	}

	public convertJSONToCSS(json: Record<string, unknown>): string {
		if (json) {
			const r = Css.of(json)

			const beautified = cssbeautify(r, {
				autosemicolon: true
			})

			return beautified
		}
		return ``
	}
}
