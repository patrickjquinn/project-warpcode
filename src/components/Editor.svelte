<script lang="ts">
	import type monaco from 'monaco-editor'
	import { onMount } from 'svelte'
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

	let divEl: HTMLDivElement = null
	let editor: monaco.editor.IStandaloneCodeEditor
	let Monaco: any

	export let code

	$: {
		if (editor?.getValue) {
			editor.setValue(code)
		}
	}

	onMount(async () => {
		// @ts-ignore
		self.MonacoEnvironment = {
			getWorker: function (_moduleId: any, label: string) {
				if (label === 'json') {
					return new jsonWorker()
				}
				if (label === 'css' || label === 'scss' || label === 'less') {
					return new cssWorker()
				}
				if (label === 'html' || label === 'handlebars' || label === 'razor') {
					return new htmlWorker()
				}
				if (label === 'typescript' || label === 'javascript') {
					return new tsWorker()
				}
				return new editorWorker()
			}
		}

		Monaco = await import('monaco-editor')
		editor = Monaco.editor.create(divEl, {
			value: [code].join('\n'),
			language: 'html',
			automaticLayout: true,
			theme: 'vs-dark',
			minimap: {
				enabled: false
			}
		})

		return () => {
			editor.dispose()
		}
	})
</script>

<div bind:this="{divEl}" class="h-screen"></div>

<style>
	.h-screen {
		width: 100%;
		height: 100%;
	}
</style>
