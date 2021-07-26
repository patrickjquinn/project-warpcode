<script lang="ts">
	import type monaco from 'monaco-editor'
	import { onMount } from 'svelte'
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
	const { remote, ipcRenderer } = window.require('electron')

	let divEl: HTMLDivElement
	let editor: monaco.editor.IStandaloneCodeEditor
	let Monaco: any

	export let code
	let lang = 'html'

	window.addEventListener(
		'fileSelected',
		(event: CustomEvent) => {
			ipcRenderer.send('open-file', event.detail.path)
			lang = fileExtension(event.detail.name)
		},
		false
	)

	window.addEventListener(
		'fileSelectedDirect',
		(event: CustomEvent) => {
			ipcRenderer.send('open-file', event.detail.path)
			lang = fileExtension(event.detail.name)
		},
		false
	)

	ipcRenderer.on('file-sent', (event, file) => {
		code = file
	})

	const fileExtension = (name) => {
		const extension = name.slice(name.lastIndexOf('.') + 1)

		switch (extension) {
			case 'svelte':
				return 'svelte'
			case 'js':
				return 'javascript'
			case 'ts':
				return 'typescript'
			case 'json':
				return 'json'
			case 'xml':
				return 'html'
			case 'html':
				return 'svelte'
			default:
				return 'html'
		}
	}

	$: {
		if (editor?.getValue()) {
			editor.setValue(code)
			editor.trigger('anyString', 'editor.action.formatDocument', null)
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
				if (label === 'html' || label === 'svelte' || label === 'handlebars' || label === 'razor') {
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
			language: lang,
			automaticLayout: true,
			theme: 'vs-dark',
			formatOnType: true,
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
		height: 95%;
		min-height: 50px;
	}
</style>
