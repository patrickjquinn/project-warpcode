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
			const widgetType: string = item.widget as string
			const widgetID: string = item.id as string
			scriptItems =
				scriptItems +
				`import {'${CodeMap.capFirstLetter(widgetType)}' } from "@components/warp/
            `

			if (item === items[items.length - 1]) {
				mainItems =
					mainItems + `<${CodeMap.capFirstLetter(widgetType)} id="${widgetType + widgetID}"/>`
			} else {
				mainItems =
					mainItems +
					`<${CodeMap.capFirstLetter(widgetType)} id="${widgetType + widgetID}"/>
            `
			}
		}

		return `
        <script lang=${this.lang}>
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
}
