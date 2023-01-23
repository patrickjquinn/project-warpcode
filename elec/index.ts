import 'v8-compile-cache'
import { join } from 'path'
import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from 'electron'
import is_dev from 'electron-is-dev'
import dotenv from 'dotenv'
import Store from 'electron-store'
import pty from 'node-pty'
import defaultShell from 'default-shell'
import os from 'os'
import fs from 'fs'
import util from 'util'
import directoryTree from 'directory-tree'
import exec from './shared/exec'
import readJSON from './shared/readJSON'
import * as path from 'path'
import degit from 'degit'
// import chokidar from 'chokidar'

const readFile = util.promisify(fs.readFile)
const store = new Store()
const darkBackgroundColor = 'black'

let ptyProcess
let watcher
let projectDir = ``
let launcherWindow: BrowserWindow
let win: BrowserWindow

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

class createWin {
	constructor() {
		win = new BrowserWindow({
			width: 800,
			height: 600,
			title: 'Warp Code',
			titleBarStyle: 'hidden',
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false
			},
			show: false,
			backgroundColor: '#2f4f4f'
		})

		win.maximize()
		win.show()

		const URL = is_dev
			? 'http://localhost:5173'
			: `file://${join(__dirname, '../../dist/index.html')}`

		win.loadURL(URL)

		win.on('ready-to-show', () => {
			watcher = fs.watch(projectDir, { recursive: true }, (eventType, filename) => {
				if (
					!filename.includes('node_modules') &&
					!filename.includes('_tmp_') &&
					!filename.includes('pnpm-lock') &&
					!filename.includes('.routify') &&
					!filename.includes('.DS_Store')
				) {
					console.log(eventType)
					win.webContents.send('send-proj-struct', buildTree(projectDir))
					console.log(filename)
				}
			})
		})

		win.on('focus', () => {
			win.webContents.send('focus')
		})

		win.on('blur', () => {
			win.webContents.send('blur')
		})

		ptyProcess = pty.spawn(defaultShell, [], {
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
	const warpspace = `${os.homedir()}/warpspace`
	if (!fs.existsSync(warpspace)) {
		fs.mkdirSync(warpspace)
	}

	launcherWindow = new BrowserWindow({
		width: 800,
		height: 600,
		minWidth: 600,
		titleBarStyle: 'hidden',
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		show: false,
		backgroundColor: darkBackgroundColor
	})

	launcherWindow.loadURL('http://localhost:5173/#/launch')

	launcherWindow.once('ready-to-show', () => {
		launcherWindow.show()
	})
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

function pushToRecents(dir) {
	if (!fs.existsSync(dir)) return
	const index = recent.indexOf(dir)
	if (index !== -1) recent.splice(index, 1)
	recent.unshift(dir)
	while (recent.length > 5) recent.pop()
	fs.writeFileSync(path.join(userData, 'recent.json'), JSON.stringify(recent))
}

function openProject(dir) {
	pushToRecents(dir)
	projectDir = dir
	console.log(`Project Dir = ${projectDir}`)
	launcherWindow.close()
	createApplicationMenu()
	new createWin()

	// watcher = chokidar.watch(projectDir, {
	// 	usePolling: true,
	// 	ignored: (path) => path.includes('node_modules')
	// }).on('all', (event, path) => {
	// 	console.log(event)
	// 	if (!path.includes('node_modules') && !path.includes('_tmp_')
	// 		&& !path.includes('pnpm-lock') && !path.includes('.routify') && !path.includes('.DS_Store')) {
	// 		win.webContents.send('send-proj-struct', buildTree(projectDir))
	// 	}
	// })
}

function existingProjectDialog(dir) {
	const focusedWindow: BrowserWindow | null = BrowserWindow.getFocusedWindow()
	if (dir) {
		openProject(dir)
	} else {
		if (!focusedWindow) return
		dialog
			.showOpenDialog(focusedWindow, {
				title: 'Open project',
				buttonLabel: 'Open project',
				properties: ['openDirectory'],
				defaultPath: `${os.homedir()}/warpspace`
			})
			.then((result) => {
				if (result.canceled || !result.filePaths || result.filePaths.length === 0) return
				setTimeout(() => {
					openProject(result.filePaths[0])
				}, 0)
			})
			.catch((err) => {
				console.log(err)
			})
	}
}

function createProjectDialog(event) {
	const focusedWindow: BrowserWindow | null = BrowserWindow.getFocusedWindow()
	if (!focusedWindow) return

	dialog
		.showOpenDialog(focusedWindow, {
			title: 'Create project',
			buttonLabel: 'Create project',
			properties: ['openDirectory', 'createDirectory'],
			defaultPath: `${os.homedir()}/warpspace`
		})
		.then(async (results) => {
			if (results.canceled || !results.filePaths || results.filePaths.length === 0) return

			const [filename] = results.filePaths

			if (event) event.sender.send('status', `cloning repo to ${path.basename(filename)}...`)

			try {
				const emitter = degit('patrickjquinn/warp-project-template')
				await emitter.clone(filename)

				if (event) event.sender.send('status', `installing dependencies...`)

				// install dependencies
				await exec(`npm i -g pnpm`, { cwd: filename })
				await exec(`pnpm install`, { cwd: filename })

				if (event) event.sender.send('status', `opening project...`)
				openProject(filename)
			} catch (err) {
				if (event) event.sender.send('status', `an error occured: ${err}`)
			}
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

ipcMain.on('term-resize', async (event, size, term) => {
	try {
		ptyProcess.resize(
			Math.max(size ? size.cols : term.cols, 1),
			Math.max(size ? size.rows : term.rows, 1)
		)
	} catch (err) {
		console.log(err)
	}
})

ipcMain.on('save-file', async (event, fileDetails) => {
	try {
		await fs.promises.writeFile(fileDetails.path, fileDetails.contents)
		event.sender.send('file-saved')
	} catch (err) {
		event.sender.send('file-saved')
	}
})

ipcMain.on('create-new-project', (event) => {
	createProjectDialog(event)
})

ipcMain.on('open-existing-project', (event, dir) => {
	existingProjectDialog(dir)
})

ipcMain.on('open-file', async (e, filePath) => {
	if (filePath) {
		try {
			const fileContents = await readFileAt(filePath)
			e.sender.send('file-opened', filePath, fileContents.toString())
			e.sender.send('file-sent', fileContents)
		} catch (err) {
			e.sender.send('file-sent', `And error occured opening ${filePath}`)
		}
	}
})

ipcMain.on('open-readme', async (e) => {
	try {
		const filePath = `${projectDir}/README.md`
		if (fs.existsSync(filePath)) {
			const fileContents = await readFileAt(filePath)
			e.sender.send('file-opened', filePath, fileContents.toString())
			e.sender.send('file-sent', fileContents)
		}
	} catch (err) {
		console.log(err)
	}
})

ipcMain.on('read-recents', async (event) => {
	try {
		const recents = await getRecents()
		event.sender.send('recents-sent', recents)
	} catch (err) {
		console.log(err)
		event.sender.send('recents-sent', null)
	}
})

const getRecents = async () => {
	const userData = app.getPath('userData')
	const file = path.join(userData, 'recent.json')
	return fs.existsSync(file) ? JSON.parse(await fs.promises.readFile(file, 'utf-8')) : null
}

const saveCurrentFile = async () => {
	console.log('not yet done.')
}

const openMenuProject = async () => {
	existingProjectDialog(null)
}

const createMenuProject = async () => {
	createProjectDialog(null)
}

const quitMenuProject = async () => {
	ptyProcess.kill('9')
	watcher.close()
	win.close()
	launch()
}

const runMenuWeb = async () => {
	console.log('running web...')
	await exec('pnpm dev:start', { cwd: projectDir })
	await shell.openExternal('http://localhost:5001')
	return
}

const runMenuAndroid = async () => {
	console.log('running android...')
}

const runMenuIOS = async () => {
	console.log('running iOS...')
}

const buildMenuProject = async () => {
	console.log('building project...')
}

const createApplicationMenu = () => {
	const template: Array<Record<string, unknown>> = [
		{
			label: 'File',
			submenu: [
				{
					label: 'Create Project',
					accelerator: 'CommandOrControl+P',
					click() {
						createMenuProject()
					}
				},
				{
					label: 'New File',
					accelerator: 'CommandOrControl+N',
					click() {
						console.log('new file')
					}
				},
				{
					label: 'Open File',
					accelerator: 'CommandOrControl+O',
					click() {
						console.log('not yet done.')
					}
				},
				{
					label: 'Save File',
					accelerator: 'CommandOrControl+S',
					enabled: true,
					click() {
						saveCurrentFile()
					}
				},
				{
					label: 'Open Project',
					accelerator: 'CommandOrControl+O',
					click() {
						openMenuProject()
					}
				},
				{
					label: 'Close Project',
					accelerator: 'CommandOrControl+Q+P',
					enabled: true,
					click() {
						quitMenuProject()
					}
				}
			]
		},
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					accelerator: 'CommandOrControl+Z',
					role: 'undo'
				},
				{
					label: 'Redo',
					accelerator: 'Shift+CommandOrControl+Z',
					role: 'redo'
				},
				{ type: 'separator' },
				{
					label: 'Cut',
					accelerator: 'CommandOrControl+X',
					role: 'cut'
				},
				{
					label: 'Copy',
					accelerator: 'CommandOrControl+C',
					role: 'copy'
				},
				{
					label: 'Paste',
					accelerator: 'CommandOrControl+V',
					role: 'paste'
				},
				{
					label: 'Select All',
					accelerator: 'CommandOrControl+A',
					role: 'selectall'
				}
			]
		},
		{
			label: 'Run + Build',
			submenu: [
				{
					label: 'Run Web',
					accelerator: 'CommandOrControl+R+W',
					click: async () => {
						await runMenuWeb()
					}
				},
				{
					label: 'Run Android',
					accelerator: 'CommandOrControl+R+A',
					click() {
						runMenuAndroid()
					}
				},
				{
					label: 'Run IOS',
					accelerator: 'CommandOrControl+R+I',
					click() {
						runMenuIOS()
					}
				},
				{
					label: 'Build',
					accelerator: 'CommandOrControl+B',
					click() {
						buildMenuProject()
					}
				}
			]
		},
		{
			label: 'Editor',
			submenu: [
				{
					label: 'Increase Font Size',
					accelerator: 'CommandOrControl+]',
					click() {
						// ipcMain.increaseFontSize();
					}
				},
				{
					label: 'Decrease Font Size',
					accelerator: 'CommandOrControl+[',
					click() {
						// ipcMain.decreaseFontSize();
					}
				}
			]
		},
		{
			label: 'Window',
			submenu: [
				{
					label: 'Minimize',
					accelerator: 'CommandOrControl+M',
					role: 'minimize'
				},
				{
					label: 'Close',
					accelerator: 'CommandOrControl+W',
					role: 'close'
				}
			]
		},
		{
			label: 'Help',
			role: 'help',
			submenu: [
				{
					label: 'Visit Warp Website',
					click: async () => {
						await shell.openExternal('https://warpcode.io/')
					}
				},
				{
					label: 'Toggle Debug Tools',
					click(item, focusedWindow) {
						if (focusedWindow) focusedWindow.webContents.toggleDevTools()
					}
				}
			]
		}
	]

	if (process.platform === 'darwin') {
		const name = 'Warp'
		template.unshift({
			label: name,
			submenu: [
				{
					label: `About ${name}`,
					role: 'about'
				},
				{ type: 'separator' },
				{
					label: 'Services',
					role: 'services',
					submenu: []
				},
				{ type: 'separator' },
				{
					label: `Hide ${name}`,
					accelerator: 'Command+H',
					role: 'hide'
				},
				{
					label: 'Hide Others',
					accelerator: 'Command+Alt+H',
					role: 'hideothers'
				},
				{
					label: 'Show All',
					role: 'unhide'
				},
				{ type: 'separator' },
				{
					label: `Quit ${name}`,
					accelerator: 'Command+Q',
					click() {
						app.quit()
					}
				}
			]
		})

		const windowMenu = template.find((item) => item.label === 'Window')
		if (!windowMenu) return
		windowMenu.role = 'window'
	}
	return Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
