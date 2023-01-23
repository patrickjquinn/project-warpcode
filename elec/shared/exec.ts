import * as child_process from 'child_process'
import util from 'util'

const exec_async = util.promisify(child_process.exec)

export const exec = (cmd, opts) => {
	return exec_async(cmd, opts)
}
