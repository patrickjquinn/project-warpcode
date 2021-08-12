import { join } from 'path'
import { app, BrowserWindow, ipcMain, dialog, nativeTheme } from 'electron'
import is_dev from 'electron-is-dev'
import dotenv from 'dotenv'
import Store from 'electron-store'
import pty from 'node-pty'
import defaultShell from 'default-shell'
import os from 'os'
import fs, { watch } from 'fs'
import util from 'util'
import directoryTree from 'directory-tree'
import createApplicationMenu from './appbar'
import exec from './shared/exec'
import readJSON from './shared/readJSON'
import * as path from 'path'
import degit from 'degit'

const readFile = util.promisify(fs.readFile)
const store = new Store()
let projectDir = `${os.homedir()}/warpspace/Demo`
const darkBackgroundColor = 'black';
const lightBackgroundColor = 'white';

let launcherWindow

const userData = app.getPath('userData')
const recent = readJSON(path.join(userData, 'recent.json')) || []

ipcMain.on('store:set', async (e, args) => {
	store.set(args.key, args.value)
})
ipcMain.handle('store:get', async (e, args) => {
	const value = await store.get(args)
	return value
})
ipcMain.on('store:delete', async (e, args) => {
	store.delete(args)
})

ipcMain.on('request-proj-struct', (e) => {
	e.sender.send('send-proj-struct', buildTree(projectDir))
})

function buildTree(rootPath: string) {
	return directoryTree(rootPath)
}

dotenv.config({ path: join(__dirname, '../../.env') })

let win = null

class createWin {
	constructor() {
		win = new BrowserWindow({
			width: 800,
			height: 600,
			title: 'Warp Code',
			titleBarStyle: 'hidden',
			webPreferences: {
				nodeIntegration: true,
				enableRemoteModule: true,
				contextIsolation: false
			},
			show: false,
			backgroundColor: nativeTheme.shouldUseDarkColors
				? darkBackgroundColor
				: lightBackgroundColor
		})

		win.maximize()
		win.show()


		const URL = is_dev
			? 'http://localhost:3000'
			: `file://${join(__dirname, '../../dist/index.html')}`

		win.loadURL(URL)

		win.on('focus', () => {
			win.webContents.send('focus');
		})
		
		win.on('blur', () => {
			win.webContents.send('blur');
		})

		const ptyProcess = pty.spawn(defaultShell, [], {
			name: 'xterm-color',
			cols: 80,
			rows: 24,
			cwd: projectDir,
			env: process.env
		})

		ptyProcess.on('data', (data) => {
			win.webContents.send('terminal-incData', data)
		})

		ipcMain.on('terminal-into', (event, data) => {
			ptyProcess.write(data)
		})
	}
}

function launch() {
	launcherWindow = new BrowserWindow({
		width: 800,
		height: 600,
		minWidth: 600,
		titleBarStyle: 'hidden',
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false
		},
		show: false,
		backgroundColor: nativeTheme.shouldUseDarkColors
			? darkBackgroundColor
			: lightBackgroundColor
	})

	launcherWindow.loadURL('http://localhost:3000/#/launch')

	launcherWindow.once('ready-to-show', () => {
		launcherWindow.show();
	});
}

async function readFileAt(path) {
	return readFile(path, 'utf8')
}

app.whenReady().then(() => {
	launch()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		new createWin()
	}
})

function openProject(dir) {
	const index = recent.indexOf(dir)
	if (index !== -1) recent.splice(index, 1)
	recent.unshift(dir)
	while (recent.length > 5) recent.pop()
	fs.writeFileSync(path.join(userData, 'recent.json'), JSON.stringify(recent))
	projectDir = dir
	launcherWindow.close()
	createApplicationMenu()
	new createWin()
	// watchProjectForChanges()
	fs.watch(projectDir, { recursive: true }, (eventType, filename) => {
		console.log(eventType)
		win.webContents.send('send-proj-struct', buildTree(projectDir))
		console.log(filename)
	})
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

ipcMain.on('create-new-project', (event) => {
	// dialog.showSaveDialog(launcherWindow, {
	dialog
		.showOpenDialog(launcherWindow, {
			title: 'Create project',
			buttonLabel: 'Create project',
			properties: ['openDirectory', 'createDirectory']
		})
		.then(async (results) => {
			if (!results.filePaths) return

			const [filename] = results.filePaths

			event.sender.send('status', `cloning repo to ${path.basename(filename)}...`)

			const emitter = degit('lukem121/svelte-vite-tailwind-template')
			await emitter.clone(filename)

			event.sender.send('status', `installing dependencies...`)

			// install dependencies
			await exec(`npm install`, { cwd: filename })

			openProject(filename)
		})
})

ipcMain.on('open-existing-project', (event, dir) => {
	if (dir) {
		openProject(dir)
	} else {
		dialog
			.showOpenDialog(launcherWindow, {
				title: 'Open project',
				buttonLabel: 'Open project',
				properties: ['openDirectory']
			})
			.then((result) => {
				if (!result.filePaths) return

				setTimeout(() => {
					openProject(result.filePaths[0])
				}, 0)
			})
	}
})

ipcMain.on('open-file', async (e, filePath) => {
	if (filePath) {
		try {
			const fileContents = await readFileAt(filePath)
			e.sender.send('file-sent', fileContents)
		} catch (err) {
			e.sender.send('file-sent', `And error occured opening ${filePath}`)
		}
	}
})
