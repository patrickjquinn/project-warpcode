<script lang="ts">
	// import CodeMirror from './CodeMirror.svelte'
	import Monaco from './Monaco.svelte'
	import { DirectoryData, openTabs } from '../stores/directoryStore'
	const { ipcRenderer } = window.require('electron')
	const fs = window.require('fs')
	const path = window.require('path')

	export let activeTabValue = 0
	export let lang = 'html'
	export let code = ''
	export let onAction: any
	let activeEditor = 0

	let [filePath, fileName, readData] = ['', '', '']
	let title = 'WarpCode'
	let count = 0
	function addTab(newFile) {
		let duplicate = false
		let focusTabId = newFile.tabId
		$openTabs.map((tab) => {
			if (tab.filePath === newFile.filePath) {
				duplicate = true
				focusTabId = tab.tabId
			}
		})
		if (!duplicate) {
			$openTabs = [...$openTabs, newFile]
			count = count + 1
		}
		activeTabValue = focusTabId
		activeEditor = activeTabValue
	}

	function deleteTab(targetId) {
		$openTabs = $openTabs
			.filter((t) => t.tabId != targetId)
			.map((t, i) => ({
				editorValue: t.editorValue,
				ext: t.ext,
				editorLang: t.editorLang,
				filePath: t.filePath,
				fileName: t.fileName,
				tabId: i
			}))
		count = count - 1
		activeTabValue = 0
		activeEditor = activeTabValue

		let active: any = $openTabs.filter((obj) => {
			return obj.tabId === activeTabValue
		})

		if (active?.length > 0) {
			active = active[0]
			console.log(active)
			code = active.editorValue
			const event = new CustomEvent('fileSelectedDirect', {
				detail: { name: active.fileName, type: 'file', path: active.filePath },
				bubbles: true,
				cancelable: true,
				composed: false
			})
			window.dispatchEvent(event)
		}
	}
	const handleClick = (tabId) => () => {
		activeTabValue = tabId
		activeEditor = activeTabValue
		let active: any = $openTabs.filter((obj) => {
			return obj.tabId === tabId
		})

		if (active?.length > 0) {
			active = active[0]
			console.log(active)
			code = active.editorValue
			const event = new CustomEvent('fileSelectedDirect', {
				detail: { name: active.fileName, type: 'file', path: active.filePath },
				bubbles: true,
				cancelable: true,
				composed: false
			})
			window.dispatchEvent(event)
		}
	}
	const modes = {
		js: {
			name: 'javascript',
			json: false
		},
		json: {
			name: 'javascript',
			json: true
		},
		svelte: {
			name: 'htmlmixed'
		},
		md: {
			name: 'markdown',
			highlightFormatting: true,
			fencedCodeBlockHighlighting: true,
			base: 'text/x-markdown'
		},
		css: {
			name: 'css'
		},
		html: {
			name: 'html'
		}
	}

	ipcRenderer.on('file-opened', function (evt, file, content) {
		const newTab: any = {}
		filePath = file
		process.platform === 'win32'
			? (fileName = file.slice().split('\\').pop())
			: (fileName = file.slice().split('/').pop())
		const language = file.slice().split('.').pop()
		code = content
		newTab.editorValue = content
		newTab.ext = language
		newTab.editorLang = modes[language]
		lang = modes[language].name
		newTab.filePath = filePath
		newTab.fileName = fileName
		newTab.tabId = count
		addTab(newTab)
		if (file) {
			title = `${path.basename(file)} - ${title}`
		}
	})

	const unsub = DirectoryData.subscribe((data) => {
		console.log('subscribing to the store', data.openFilePath)
		const newTab: any = {}
		if (data.fileRead) {
			readData = fs.readFileSync(data.openFilePath).toString()
			fileName = data.openFilePath.slice().split('/').pop()
			const language = path.basename(data.openFilePath).split('.').pop()
			if (data.openFilePath) {
				title = `${path.basename(data.openFilePath)} - WarpCode`
			}
			newTab.editorValue = readData
			code = readData
			newTab.ext = language
			newTab.editorLang = modes[language]
			lang = modes[lang].name
			newTab.filePath = data.openFilePath
			newTab.fileName = fileName
			newTab.tabId = count
			console.log('NEW TAB', newTab)
			addTab(newTab)
		}
	})

	ipcRenderer.on('file-saved', (event, arg) => {
		console.log('file saved.')
		if (onAction) {
			onAction(code)
		}
	})
</script>

<ul>
	{#each $openTabs as tab}
		<li
			style="{activeTabValue === tab.tabId ? '' : 'border: none !important;'}"
			class="{activeTabValue === tab.tabId ? 'active' : ''}"
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span class="tab-span" on:click="{handleClick(tab.tabId)}">
				<img src="../src/icons/file_type_{tab.ext}.svg" alt="{''}" />
				{tab.fileName}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span class="delete-button" on:click="{() => deleteTab(tab.tabId)}"> &times </span>
			</span>
		</li>
	{/each}
</ul>

{#if $openTabs.length > 0}
	<div class="editor-body">
		<Monaco bind:code="{code}" bind:lang="{lang}" />
	</div>
{/if}

<style>
	.editor-body {
		width: 100%;
		height: 98%;
		overflow: hidden;
		padding: 0;
	}
	ul {
		font-size: 10px;
		display: flex;
		flex-direction: row;
		overflow: auto;
		white-space: nowrap;
		scrollbar-width: thin;
		padding-left: 0;
		margin-top: 0;
		margin-bottom: 0;
		list-style: none;
		border-bottom: 1px solid #dee2e6;
		background-color: rgb(27, 27, 26);
		/* border-radius: 5px; */
	}
	li {
		margin-bottom: -1px;
		background-color: rgb(37, 37, 37);
		color: #fff;
	}
	.tab-span {
		border: 1px solid transparent;
		display: flex;
		flex-direction: row;
		padding: 0 1rem;
		cursor: pointer;
		font-size: 12px;
	}
	.tab-span:hover {
		border-color: #e9ecef #e9ecef #dee2e6;
	}
	li.active > span {
		color: #ffffff;
		background-color: rgb(53, 50, 50);
		border-color: #dee2e6 #dee2e6 #fff;
	}
	img {
		height: 1em;
		background-color: inherit;
		margin-top: 3px;
		/* margin-bottom: 0; */
	}
	.delete-button {
		margin-left: 5px;
		border-right: black;
		border-left: black;
	}
</style>
