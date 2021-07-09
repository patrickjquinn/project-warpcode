/**
 * electron 打包
 */
import path from 'path'
import * as rollup from 'rollup'
import argv from 'minimist'
import chalk from 'chalk'
import ora from 'ora'
import waitOn from 'wait-on'
import electronConnect from 'electron-connect'
import * as rollupConfig from './rollup.config.js'
import net from 'net'
import { URL } from 'url'


const electron = electronConnect.server.create({ stopOnClose: true });
console.log(electron)
const options = rollupConfig.default

const opt = options('development');
const TAG = '[script/build.js]';
const spinner = ora(`${TAG} Electron build...`);

const watchFunc = function () {
    // once here, all resources are available
    const watcher = rollup.watch(opt);
    watcher.on('change', filename => {
      const log = chalk.green(`change -- ${filename}`);
      console.log(TAG, log);
    });
    watcher.on('event', ev => {
      if (ev.code === 'END') {
        electron.electronState === 'init' ? electron.start() : electron.restart();
      } else if (ev.code === 'ERROR') {
        console.log(ev.error)
      }
    });
}

const resource = `http://localhost:${3000}/index.html`;

if (true) {
  waitOn({
    resources: [resource],
    timeout: 5000,
  }, err => {
    if (err) {
        const { port, hostname } = new URL(resource);
        const serverSocket = net.connect(port || 80, hostname, () => {
          watchFunc();
        });
        serverSocket.on('error', (e) => {
          console.log(err);
          process.exit(1);
        });
    } else {
      watchFunc();
    }
  });
} else {
  spinner.start();
  rollup.rollup(opt)
    .then(build => {
      spinner.stop();
      console.log(TAG, chalk.green('Electron build successed.'));
      build.write(opt.output);
    })
    .catch(error => {
      spinner.stop();
      console.log(`\n${TAG} ${chalk.red('构建报错')}\n`, error, '\n')
    });
}
