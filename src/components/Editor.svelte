<script lang="ts">
	import type monaco from 'monaco-editor'
	import type * as _monaco from 'monaco-editor'
	import { onMount } from 'svelte'
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
	import * as htmllang from '../modules/warp/editor/syntax'
	import { Document, DocumentManager } from 'svelte-language-server/dist/src/lib/documents'
	import {
		MonacoToProtocolConverter,
		ProtocolToMonacoConverter
	} from 'monaco-languageclient/lib/monaco-converter'
	import { LSConfigManager } from 'svelte-language-server/dist/src/ls-config'
	import { getSemanticTokenLegends } from 'svelte-language-server/dist/src/lib/semanticToken/semanticTokenLegend'
	import {
		SveltePlugin,
		HTMLPlugin,
		CSSPlugin,
		TypeScriptPlugin,
		PluginHost,
		LSAndTSDocResolver
	} from 'svelte-language-server/dist/src/plugins'
	import { debounce } from 'lodash'
	import type { CompletionEntry } from 'typescript'

	export { MonacoToProtocolConverter, ProtocolToMonacoConverter }

	let divEl: HTMLDivElement = null
	let editor: monaco.editor.IStandaloneCodeEditor
	let Monaco: any

	export let code

	const LANGUAGE_ID = 'svelte'
	const MODEL_URI = 'file://fs/test.svelte'

	$: {
		if (editor?.getValue) {
			editor.setValue(code)
			editor.getAction('editor.action.formatDocument').run()
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
		const MONACO_URI = Monaco.Uri.parse(MODEL_URI)

		Monaco.languages.register({
			id: LANGUAGE_ID,
			extensions: ['.svelte'],
			aliases: ['Svelte', 'svelte'],
			mimetypes: ['application/svelte']
		})

		Monaco.languages.setLanguageConfiguration(
			LANGUAGE_ID,
			htmllang.conf as _monaco.languages.LanguageConfiguration
		)

		// editor = Monaco.editor.create(divEl, {
		// 	value: [code].join('\n'),
		// 	language: 'html',
		// 	automaticLayout: true,
		// 	theme: 'vs-dark',
		// 	minimap: {
		// 		enabled: false
		// 	}
		// })

		let doDiagnostics = () => {}

		editor = Monaco.editor.create(divEl, {
			model: Monaco.editor.createModel(code, LANGUAGE_ID, MONACO_URI),
			'semanticHighlighting.enabled': true,
			theme: 'vs-dark',
			glyphMargin: true,
			lightbulb: {
				enabled: true
			}
		})

		setTimeout(() => doDiagnostics(), 1)

		Monaco.languages.setMonarchTokensProvider(
			LANGUAGE_ID,
			htmllang.language as _monaco.languages.IMonarchLanguage
		)

		const { tokenTypes } = getSemanticTokenLegends()
		const t = (editor as any)._themeService._theme
		t.getTokenStyleMetadata = (type: any, modifiers: any) => {
			//   console.log('getTokenStyleMetadata',type,modifiers)
			return {
				foreground: 3 + tokenTypes.indexOf(type), // color id 5
				bold: false,
				underline: false,
				italic: true
			}
		}

		const m2p = new MonacoToProtocolConverter()
		const p2m = new ProtocolToMonacoConverter()

		const docManager = new DocumentManager((textDocument) => {
			// debugger
			return new Document(textDocument.uri, textDocument.text)
		})

		const configManager = new LSConfigManager()
		const pluginHost = new PluginHost(docManager)

		pluginHost.initialize({
			filterIncompleteCompletions: true,

			// !evt.initializationOptions?.dontFilterIncompleteCompletions,
			definitionLinkSupport: true //!!evt.capabilities.textDocument?.definition?.linkSupport
		})

		const workspaceUris = ['file://fs/']
		let sveltePlugin = new SveltePlugin(configManager)
		pluginHost.register(sveltePlugin)
		pluginHost.register(new HTMLPlugin(docManager, configManager))
		pluginHost.register(new CSSPlugin(docManager, configManager))
		pluginHost.register(
			new TypeScriptPlugin(
				configManager,
				new LSAndTSDocResolver(docManager, workspaceUris, configManager)
			)
		)

		Monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, {
			async provideCompletionItems(model, position: _monaco.Position, context, token) {
				// monaco.Thenable<monaco.languages.CompletionList>
				docManager.openDocument({
					text: model.getValue(),
					uri: model.uri.toString()
				})
				// const document = createDocument(model);
				const wordUntil = model.getWordUntilPosition(position)
				const defaultRange = new Monaco.Range(
					position.lineNumber,
					wordUntil.startColumn,
					position.lineNumber,
					wordUntil.endColumn
				)
				// const jsonDocument = jsonService.parseJSONDocument(document);
				return pluginHost
					.getCompletions(
						{ uri: model.uri.toString() },
						m2p.asPosition(position.lineNumber, position.column),
						m2p.asCompletionContext(context)
					)
					.then((list: any) => {
						return p2m.asCompletionResult(list, defaultRange)
					})
			},

			async resolveCompletionItem(item, token) {
				//monaco.languages.CompletionItem | monaco.Thenable<monaco.languages.CompletionItem>
				const model = editor.getModel()
				return pluginHost
					.resolveCompletion(
						{ uri: model?.uri?.toString() ?? '' },
						m2p.asCompletionItem(item),
						token
					)
					.then((result: any) => p2m.asCompletionItem(result, item.range))
			}
		})

		Monaco.languages.registerDocumentRangeFormattingEditProvider(LANGUAGE_ID, {
			async provideDocumentRangeFormattingEdits(model, range, options, token) {
				//: monaco.languages.TextEdit[] | monaco.Thenable<monaco.languages.TextEdit[]>
				docManager.openDocument({
					text: model.getValue(),
					uri: model.uri.toString()
				})
				// const document = createDocument(model);
				// const edits = jsonService.format(document, m2p.asRange(range), m2p.asFormattingOptions(options));
				const edits = await pluginHost.formatDocument({ uri: model.uri.toString() }, { ...options })
				return p2m.asTextEdits(edits)
			}
		})

		Monaco.languages.registerDocumentSymbolProvider(LANGUAGE_ID, {
			async provideDocumentSymbols(model, token) {
				//monaco.languages.DocumentSymbol[] | monaco.Thenable<monaco.languages.DocumentSymbol[]>
				// const document = createDocument(model);
				// const jsonDocument = jsonService.parseJSONDocument(document);
				// return p2m.asSymbolInformations(jsonService.findDocumentSymbols(document, jsonDocument));
				docManager.openDocument({
					text: model.getValue(),
					uri: model.uri.toString()
				})
				const symobls = await pluginHost.getDocumentSymbols(
					{
						uri: model.uri.toString()
					},
					token
				)
				return p2m.asSymbolInformations(symobls)
			}
		})

		Monaco.languages.registerHoverProvider(LANGUAGE_ID, {
			provideHover(model, position: _monaco.Position, token) {
				docManager.openDocument({
					text: model.getValue(),
					uri: model.uri.toString()
				})
				return pluginHost
					.doHover(
						{ uri: model.uri.toString() },
						m2p.asPosition(position.lineNumber, position.column)
					)
					.then((res) => p2m.asHover(res))
			}
		})

		Monaco.languages.registerSignatureHelpProvider(LANGUAGE_ID, {
			signatureHelpTriggerCharacters: ['(', ',', '<'],
			signatureHelpRetriggerCharacters: [')'],
			async provideSignatureHelp(
				model,
				position: _monaco.Position,
				token: _monaco.CancellationToken,
				context
			) {
				docManager.openDocument({
					text: model.getValue(),
					uri: model.uri.toString()
				})
				const help = await pluginHost.getSignatureHelp(
					{ uri: model.uri.toString() },
					m2p.asPosition(position.lineNumber, position.column),
					m2p.asSignatureHelpContext(context),
					token
				)
				return p2m.asSignatureHelpResult(help)
			}
		})

		Monaco.languages.registerDocumentSemanticTokensProvider(LANGUAGE_ID, {
			getLegend: getSemanticTokenLegends,

			provideDocumentSemanticTokens: async (model, lastResultId, token) => {
				// console.log('ddd',model)
				docManager.openDocument({
					text: model.getValue(),
					uri: model.uri.toString()
				})
				const st = await pluginHost.getSemanticTokens({
					uri: model.uri.toString()
				})
				if (!st) return null
				return {
					resultId: st.resultId,
					data: Uint32Array.from(st.data)
				}
			},

			releaseDocumentSemanticTokens: () => {}
		})

		doDiagnostics = debounce(async () => {
			const model = editor.getModel()
			if (!model) return
			docManager.openDocument({
				text: model.getValue(),
				uri: model.uri.toString()
			})
			const diagnostics = await pluginHost.getDiagnostics({
				uri: model.uri.toString()
			})
			const markers = p2m.asDiagnostics(diagnostics)
			Monaco.editor.setModelMarkers(model, 'default', markers)
		}, 500)

		//  const debounced = undefined;
		editor.onDidChangeModelContent(async (event) => {
			return doDiagnostics()
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
