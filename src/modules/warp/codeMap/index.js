export class CodeMap {
    lang;
    constructor(lang) {
        this.lang = lang;
    }
    static capFirstLetter(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }
    mapToCode(canvas) {
        const items = canvas.items;
        let scriptItems = ``;
        let mainItems = ``;
        for (const item of items) {
            const widgetType = item.widget;
            const widgetID = item.id;
            scriptItems =
                scriptItems +
                    `import {'${CodeMap.capFirstLetter(widgetType)}' } from "@components/warp/
            `;
            if (item === items[items.length - 1]) {
                mainItems =
                    mainItems + `<${CodeMap.capFirstLetter(widgetType)} id="${widgetType + widgetID}"/>`;
            }
            else {
                mainItems =
                    mainItems +
                        `<${CodeMap.capFirstLetter(widgetType)} id="${widgetType + widgetID}"/>
            `;
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
        `;
    }
    mapToCanvas(code) {
        let mainObject = code.split('<main>')[0];
        mainObject = mainObject.split('</main>')[0];
        const components = mainObject.split(/\n/);
        console.log(components);
    }
}
//# sourceMappingURL=index.js.map