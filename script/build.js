import * as rollup from 'rollup'
import chalk from 'chalk'
import waitOn from 'wait-on'
import electronConnect from 'electron-connect'
import * as rollupConfig from './rollup.config.js'
import net from 'net'
import { URL } from 'url'

const electron = electronConnect.server.create({ stopOnClose: true })
const options = rollupConfig.default
const opt = options('development')
const TAG = '[script/build.js]'
const resource = `http://localhost:${3000}/index.html`

const watchFunc = function () {
	const watcher = rollup.watch(opt)
	watcher.on('change', (filename) => {
		const log = chalk.green(`change -- ${filename}`)
		console.log(TAG, log)
	})
	watcher.on('event', (ev) => {
		if (ev.code === 'END') {
			electron.electronState === 'init' ? electron.start() : electron.restart()
		} else if (ev.code === 'ERROR') {
			console.log(ev.error)
		}
	})
}

waitOn({
	resources: [resource],
	timeout: 5000
}, (err) => {
	if (err) {
		const { port, hostname } = new URL(resource)
		const serverSocket = net.connect(port || 80, hostname, () => {
			watchFunc()
		})
		serverSocket.on('error', (err) => {
			console.log(err)
			process.exit(1)
		})
	} else {
		watchFunc()
	}
}
)

