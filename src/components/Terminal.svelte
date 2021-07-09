<!-- <script>
    import '../../node_modules/xterm/css/xterm.css';
    import { Terminal } from 'xterm';
    import { onMount } from 'svelte';
    import fit from 'xterm-addon-fit';
    import WebfontLoader from 'xterm-webfont';
    import pty from 'node-pty';
    import defaultShell from 'default-shell';

    let proc;
    let terminal;
    let dir;
    let ready;

    const term = new Terminal({
        cursorBlink: true,
        cols: 80,
        rows: 40,
        fontFamily: 'Fira Code',
        fontWeight: 300,
        fontSize: 14,
        theme: {
            background: '#222'
        }
    });

    term.loadAddon(fit);
    term.loadAddon(WebfontLoader)
    
    onMount(() => {

    })
        
    </script>
    <svelte:window on:focus={term.focus} on:blur={term.blur}/>

    <main>
            <div id="terminal"></div>
    </main>
    <style>
    </style> -->
<script lang="ts">
	import { onMount } from 'svelte'

	import '../../node_modules/xterm/css/xterm.css'
	import * as xterm from 'xterm'
	import WebfontLoader from 'xterm-webfont';
	import * as fit from 'xterm-addon-fit'
	import { watchResize } from 'svelte-watch-resize'

	let terminalElement
	let proc;


	const SOLARIZED_DARK: xterm.ITheme = Object.freeze<xterm.ITheme>({
		foreground: '#839496',
		background: '#002b36',
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
	let bgColor = '#222'

	$: {
		if (terminalController) {
			bgColor = theme.background
			terminalController.setOption('theme', theme)
		}
	}

	function initializeXterm() {
		terminalController = new xterm.Terminal()

		termFit = new fit.FitAddon()
		terminalController.loadAddon(termFit)

		terminalController.open(terminalElement)
		termFit.fit()
	}

	onMount(async () => {
		initializeXterm()
	})

	function handleTermResize() {
		termFit.fit()
	}
</script>

<div id="terminal" bind:this="{terminalElement}" use:watchResize="{handleTermResize}"></div>

<style>
	:global(.terminal) {
		padding: 5px;
	}
	#terminal {
		margin: 0;
		height: 100%;
		width: 100%;
	}
</style>
