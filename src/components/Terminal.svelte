<script lang="ts">
	import { onMount } from 'svelte'
	import '../../node_modules/xterm/css/xterm.css'
	import * as xterm from 'xterm'
	import './xterm.css'
	import * as fit from 'xterm-addon-fit'
	import { watchResize } from 'svelte-watch-resize'
	const { ipcRenderer } = window.require('electron')
	let terminalElement
	const SOLARIZED_DARK: xterm.ITheme = Object.freeze<xterm.ITheme>({
		foreground: '#fffff',
		background: '#1e1e1e',
		black: '#073642',
		blue: '#268bd2',
		cyan: '#2aa198',
		green: '#859900',
		magenta: '#d33682',
		red: '#dc322f',
		white: '#eee8d5',
		yellow: '#b58900',
		brightBlack: '#002b36',
		brightBlue: '#839496',
		brightCyan: '#93a1a1',
		brightGreen: '#586e75',
		brightMagenta: '#6c71c4',
		brightRed: '#cb4b16',
		brightWhite: '#fdf6e3',
		brightYellow: '#657b83'
	})
	let terminalController: xterm.Terminal
	let termFit
	let theme: xterm.ITheme = SOLARIZED_DARK
	let bgColor = '#1e1e1e'
	$: {
		if (terminalController) {
			bgColor = theme.background
			handleTermResize()
			// terminalController.setOption('theme', theme)
		}
	}
	function initializeXterm() {
		terminalController = new xterm.Terminal({
			fontFamily: 'Fira Code, Iosevka, monospace',
			fontSize: 12,
			logLevel: 'debug',
			theme
		})
		termFit = new fit.FitAddon()
		terminalController.loadAddon(termFit)
		terminalController.open(terminalElement)
		// terminalController.setOption('logLevel', 'debug')
		termFit.fit()
		terminalController.write('\x1b[32mWelcome to Warp code!\x1b[m\r\n')
		terminalController.onData((e) => {
			ipcRenderer.send('terminal-into', e)
		})
		ipcRenderer.on('terminal-incData', (event, data) => {
			terminalController.write(data)
		})
	}
	onMount(async () => {
		initializeXterm()
	})
	function handleTermResize() {
		if (termFit) {
			termFit.fit()
		}
	}
</script>

<div id="terminal" bind:this="{terminalElement}" use:watchResize="{handleTermResize}"></div>

<svelte:window on:resize="{handleTermResize}" />

<style>
	:global(.terminal) {
		/* padding: 15px; */
		height: 100%;
		width: 100%;
	}
	:global(.terminal .xterm-viewport) {
		height: 100% !important;
		padding: 10px;
	}
	#terminal {
		margin: 0;
		height: 100%;
		width: 100%;
	}
</style>
