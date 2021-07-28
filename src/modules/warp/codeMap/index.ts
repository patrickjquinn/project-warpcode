import {parse} from 'himalaya'

import cssbeautify from 'cssbeautify'

export class CodeMap {
	lang: string
	constructor(lang: string) {
		this.lang = lang
	}

	private static capFirstLetter(input: string): string {
		return input.charAt(0).toUpperCase() + input.slice(1)
	}

	public mapToCode(canvas: Record<string, unknown>): string {
		const items: Array<Record<string, unknown>> = canvas.items as Array<Record<string, unknown>>
		let scriptItems = ``
		let mainItems = ``
		for (const item of items) {
			const widgetType: any = item.widget as string
			const widgetID: any = item.id as string
			let widgetValue: any = item.value as string
			let contentType: any = item.contentsType as string
			if (!widgetValue) {
				widgetValue = ''
			}
			if (!contentType) {
				contentType = 'slot'
			}
			scriptItems =
				scriptItems + `import {${CodeMap.capFirstLetter(widgetType)}} from "@components/warp/"\n`

			const widget = this.transformTemplateToWidget({ type: contentType, widget: widgetType, value: widgetValue, id: widgetID })

			if (item === items[items.length - 1]) {
				mainItems =
					mainItems + `${widget}`
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
            ${mainItems}
        </main>

		<style>
		</style>
        `
	}

	public mapToCanvas(code: string): void {
		let mainObject: string = code.split('<main>')[0]
		mainObject = mainObject.split('</main>')[0]

		const components: Array<unknown> = mainObject.split(/\n/)
		console.log(components)
	}

	public convertCodeToCanvas(code: string) {
		
		const json = parse(code)

		const canvas = []

		for (let item of json) {
			if (item.tagName === 'main'){
				for (const inner of item.children) {
					if (inner.type === 'element') {
						canvas.push(this.transformCodeToCanvas(inner))
					}
				}
			}
		}

		return canvas
	}

	private transformTemplateToWidget({ type, widget, value, id }): string {
		if (type === 'slot') {
			return `<${CodeMap.capFirstLetter(widget)} id="${widget + id}">${value}</${CodeMap.capFirstLetter(widget)}>`
		}
		return `<${CodeMap.capFirstLetter(widget)} ${type}="${value}" id="${widget + id}"/>`
	}

	private transformCodeToCanvas(item) {
		let id
		let widget = item.tagName
		let contentsType = ""
		let value = ""

		console.log(item)


		for (const obj of item.attributes) {
			if (obj.key === "src" || obj.key === "value"){
				contentsType = obj.key
				value = obj.value
			}

			if (obj.key === "id") {
				id = parseInt(obj.value.split(item.tagName)[1])
			}
		}

		if (contentsType.length === 0){
			contentsType = 'slot'
		}

		if (value.length === 0 && item.children.length > 0) {
			for (const child of item.children) {
				value += child['content'] as string
			}
		}

		return {
			id,
			name: widget,
			widget,
			value,
			contentsType: 'slot'
		}
	}
}
