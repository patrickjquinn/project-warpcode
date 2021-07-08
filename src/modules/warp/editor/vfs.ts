import { System } from 'typescript'
// import ts from "typescript";
import type _vfs from '@typescript/vfs'
import nodefs from 'fs'
type nodefs_type = typeof nodefs

export class VFS implements System {
	args: string[]
	newLine: string
	useCaseSensitiveFileNames: boolean
	protected constructor(protected sys: System) {
		this.args = sys.args
		this.newLine = sys.newLine
		this.useCaseSensitiveFileNames = sys.useCaseSensitiveFileNames
	}

	public static normalize(path: string) {
		return path.replace(/^(file:)?(\/)*(fs\/)?/, '')
	}

	get_node_fs(this: this): Partial<nodefs_type> {
		const that = this
		return {
			//@ts-ignore
			readFile: (path: string, second: any, third: any) => {
				const callback = third ? third : second
				const is_utf8 = second && (second === 'utf8' || second === 'utf-8')
				const text = that.readFile(path, 'utf8')
				if (!is_utf8) {
					return new TextEncoder().encode(text)
				}
				return text
			},
			existsSync: (path: nodefs.PathLike) => {
				return that.sys.fileExists(path as string)
			},
			//@ts-ignore
			writeFileSync: (path: string, content: string) => {
				return that.sys.writeFile(path, content)
			}
			// stat(){

			// }
		}
	}

	write = (s: string) => {
		return this.sys.write(s)
	}
	readFile = (path: string, encoding?: string) => {
		return this.sys.readFile(VFS.normalize(path), encoding)
	}
	writeFile = (path: string, data: string, writeByteOrderMark?: boolean) => {
		return this.sys.writeFile(VFS.normalize(path), data, writeByteOrderMark)
	}
	resolvePath = (path: string) => {
		return this.sys.resolvePath(VFS.normalize(path))
	}
	fileExists = (path: string) => {
		return this.sys.fileExists(VFS.normalize(path))
	}
	directoryExists = (path: string) => {
		return this.sys.directoryExists(path)
	}
	createDirectory = (path: string) => {
		return this.sys.createDirectory(path)
	}
	getExecutingFilePath = () => {
		return this.sys.getExecutingFilePath()
	}
	getCurrentDirectory = () => {
		return this.sys.getCurrentDirectory()
	}
	getDirectories = (path: string) => {
		return this.sys.getDirectories(path)
	}
	readDirectory = (
		path: string,
		extensions?: readonly string[],
		exclude?: readonly string[],
		include?: readonly string[],
		depth?: number
	) => {
		return this.sys.readDirectory('/', extensions, exclude, include, depth).map(VFS.normalize)
	}
	exit = (exitCode?: number) => {
		return this.sys.exit(exitCode)
	}
	public static async create_and_fetch_types(
		files: Record<string, string>,
		typescript: any,
		vfs: typeof _vfs // module loaded from cdn
	) {
		const fsMap = await vfs.createDefaultMapFromCDN(
			{
				lib: ['DOM', 'ES6']
			},
			typescript.version,
			true,
			typescript
		)
		const final_map = new Map<string, string>()
		for (const [filename, content] of Object.entries(files)) {
			final_map.set(VFS.normalize(filename), content)
		}
		for (const [filename, content] of fsMap.entries()) {
			final_map.set(VFS.normalize(filename), content)
		}
		const sys = vfs.createSystem(final_map)
		const new_vfs = new VFS(sys)
		typescript.sys = new_vfs
		typescript.getDefaultLibFilePath = () => ''
		return new_vfs
	}
}
