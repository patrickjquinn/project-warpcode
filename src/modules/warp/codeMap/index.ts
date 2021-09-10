/* eslint-disable no-prototype-builtins */
import { parse } from 'himalaya'

import cssbeautify from 'cssbeautify'
import * as Css from 'json-to-css'
import { validate } from 'csstree-validator'
import css2json from 'css2json'

const stockWidgets = ['image', 'button', 'image', 'label', 'textBox', 'textInput', 'videoPlayer']
const importRE = /import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/_-]+)["'\s].*/g

export class CodeMap {
	lang: string
	constructor(lang: string) {
		this.lang = lang
	}

	public validateCssString(cssString: string): boolean {
		const validateCSS = validate(cssString)
		if (validateCSS.length !== 0) {
			return false
		}
		return true
	}

	public mapToCode(canvas: Record<string, unknown>, oldCode: string): string {
		const items: Array<Record<string, unknown>> = canvas.items as Array<Record<string, unknown>>
		let scriptItems = ``
		let mainItems = ``
		let cssItems = ``
		const scriptTag: string = this.removeWarpImports(oldCode)
		const styleTag: string = this.removeWarpStyles(oldCode, items)
		// if (oldCode.includes('<script lang="ts">') && oldCode.includes('</script>')) {
		// 	scriptTag = oldCode.split('<script')[1].split('>')[1].split('</script')[0] ?? ''
		// 	const extractedWarpImports = [...scriptTag.matchAll(importRE)]
		// 	for (const item of extractedWarpImports) {
		// 		if (item[0].includes('warp')) {
		// 			console.log(`stripping old import: ${item[0]}`)
		// 			if (scriptTag.includes(item[0])) {
		// 				console.log('old import existed')
		// 			}
		// 			scriptTag = scriptTag.replaceAll(item[0].trim(), '')
		// 		}
		// 	}
		// }

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

			if (item.style) {
				cssItems = cssItems + this.extractStyleAndCodeify(item)
			}

			if (!scriptItems.includes(`{ ${CodeMap.capFirstLetter(widgetType)} }`)) {
				if (stockWidgets.includes(widgetType)) {
					scriptItems =
						scriptItems + `import { ${CodeMap.capFirstLetter(widgetType)} } from "@components/warp/"
	`
				}

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
			${scriptTag.trim()}
        </script>

        <main>
            ${mainItems.trim()}
        </main>

		<style>
			${cssItems.trim()}
			${styleTag.trim()}
		</style>
        `
	}

	public convertCSSJSONtoInline(css: Record<string, unknown>, id: string): string {
		let styled = ''
		let isGlobalStyle = false
		if (!id.includes('placeholder')) {
			if (css.hasOwnProperty(`:global(${id})`)) {
				isGlobalStyle = true
			}
			const mapped = this.convertJSONToCSS(css)

			if (mapped) {
				const validateCSS = validate(mapped)
				if (validate(mapped).length !== 0) {
					console.log(`Invalid CSS on widget ${id} : ${validateCSS}`)
					return ``
				}
				let styleSplit
				if (isGlobalStyle) {
					styleSplit = mapped.split(`:global(#${id})`)
				} else {
					styleSplit = mapped.split(id)

				}

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
						const mappedElement = this.transformCodeToCanvas(inner)
						if (mappedElement) {
							canvas.push(this.transformCodeToCanvas(inner))
						}
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

	private removeWarpStyles(code: string, canvas: Array<Record<string, unknown>>): string {
		let styleTag = ``
		if (code.includes('<style>') && code.includes('</style>')) {
			styleTag = code.split('<style')[1].split('>')[1].split('</style')[0] ?? ''
			const styleConversion = this.convertCSSToJSON(styleTag)
			for (const item of canvas) {
				if (styleConversion[`#${item.widget}${item.id}`]) {
					delete styleConversion[`#${item.widget}${item.id}`]
				} else if (styleConversion[`:global(#${item.widget}${item.id})`]) {
					delete styleConversion[`:global(#${item.widget}${item.id})`]
				}
			}
			styleTag = this.convertJSONToCSS(styleConversion)
		}
		return styleTag
	}

	private removeWarpImports(code: string): string {
		let scriptTag = ``
		if ((code.includes('<script lang="ts">') || code.includes('<script>')) && code.includes('</script>')) {
			scriptTag = code.split('<script')[1].split('>')[1].split('</script')[0] ?? ''
			const extractedWarpImports = [...scriptTag.matchAll(importRE)]
			for (const item of extractedWarpImports) {
				if (item[0].includes('warp')) {
					scriptTag = scriptTag.replaceAll(item[0].trim(), '')
				}
			}
		}
		return scriptTag
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

	private static capFirstLetter(input: string): string {
		return input.charAt(0).toUpperCase() + input.slice(1)
	}

	private extractStyleAndCodeify(item) {
		const widgetStyle: Record<string, unknown> = item.style as Record<string, unknown>
		let contentType: string = item.contentsType as string
		let cssItems = ``

		const formattetStyle = {}

		for (const [key, value] of Object.entries(widgetStyle)) {
			if (widgetStyle.hasOwnProperty(key)) {
				formattetStyle[key] = value
			}
		}

		if (!contentType) {
			contentType = 'slot'
		}

		cssItems = cssItems + this.convertJSONToCSS(formattetStyle)

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

	private convertAttributesToInline(attributes) {
		let stringAttributes = ``

		if (attributes?.length > 0) {
			for (const attribute of attributes) {
				if (attribute?.key) {
					stringAttributes += `${attribute.key}="${attribute.valye}" `
				}
			}
		}

		

		return stringAttributes
	}

	private transformTemplateToWidget({ type, widget, value, id, item }): string {
		const defaultWidgets = ['Label', 'Container', 'ScrollContainer', 'TextBox', 'VideoPlayer', 'TextInput', 'Image', 'Button']

		const attributes = this.convertAttributesToInline(item.attributes)

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
						}" ${attributes}>${innerItem}</${CodeMap.capFirstLetter(widget)}>`
				}
				return `<${widget} id="${widget + id
					}" ${attributes}>${innerItem}</${widget}>`

			}
			if (defaultWidgets.includes(CodeMap.capFirstLetter(widget))) {
				return `<${CodeMap.capFirstLetter(widget)} id="${widget + id
					}" ${attributes}>${value}</${CodeMap.capFirstLetter(widget)}>`
			}
			return `<${widget} id="${widget + id
				}" ${attributes}>${value}</${widget}>`

		}
		if (defaultWidgets.includes(CodeMap.capFirstLetter(widget))) {
			return `<${CodeMap.capFirstLetter(widget)} ${type}="${value}" id="${widget + id}" ${attributes}/>`
		}
		return `<${widget} ${type}="${value}" id="${widget + id}" ${attributes}/>`
	}

	private fetchRelevantCSSTag(id: string, css: Array<Record<string, unknown>>) {
		const obj = {}
		for (const style of css) {
			if (style.hasOwnProperty(`:global(${id})`)) {
				obj[`:global(${id})`] = style[`:global(${id})`]
				return obj
			} else if (style.hasOwnProperty(id)) {
				obj[id] = style[id]
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
		let attrs: any[] = []

		// Come back to this, this is a blind stab of a fix.
		if (item.attributes?.length == 0) return null

		for (const obj of item.attributes) {
			if (obj.key === 'src' || obj.key === 'value') {
				contentsType = obj.key
				value = obj.value
			} else if (obj.key === 'id') {
				id = parseInt(obj.value.split(item.tagName)[1])
			} else {
				if (obj?.key) {
					const otherObj = {}
					otherObj[obj.key] = obj.value
					attrs.push(obj)
				}
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

		console.log('attrs '+ JSON.stringify(attrs))

		if (item.tagName.toLowerCase() === 'container' && item.children?.length > 0) {
			const items = []
			for (const child of item.children) {
				if (child.type === 'element') {
					const mapped = this.transformCodeToCanvas(child)
					if (mapped) {
						items.push(mapped)
					}
				}
			}
			return {
				id,
				name: widget,
				widget,
				value,
				contentsType,
				items,
				attrs
			}
		}

		return {
			id,
			name: widget,
			widget,
			value,
			contentsType,
			attrs
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
