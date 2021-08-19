<script lang="ts">
	import type monaco from 'monaco-editor'
	import { onMount } from 'svelte'
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
	import { createEventDispatcher } from 'svelte'

	const { ipcRenderer } = window.require('electron')
	const dispatch = createEventDispatcher()

	function codeSaved() {
		dispatch('message')
	}

	let divEl: HTMLDivElement
	let editor: monaco.editor.IStandaloneCodeEditor
	let Monaco: any

	export let code
	export let lang = 'html'

	ipcRenderer.on('file-sent', (event, file) => {
		console.log(event)
		code = file
	})

	const updatedCode = () => {
		if (editor?.getValue() && editor.getValue() != code) {
			editor.setValue(code)
			editor.trigger('anyString', 'editor.action.formatDocument', null)
		}
	}

	$: code && updatedCode()

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

		document.addEventListener(
			'keydown',
			function (e) {
				if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
					e.preventDefault()
					if (code != editor.getValue()) {
						code = editor.getValue()
						codeSaved()
					}
				}
			},
			false
		)

		// editor.onDidChangeModelContent ((e) => {
		// 	code = editor.getValue()
		// })

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
