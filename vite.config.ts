import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import dts from 'vite-plugin-dts'

const root = dirname(fileURLToPath(import.meta.url))

const kitEntries = {
	'kits/ui-kit/index': resolve(root, 'src/kits/ui-kit/index.ts'),
	'kits/social/index': resolve(root, 'src/kits/social/index.ts'),
	'kits/admin/index': resolve(root, 'src/kits/admin/index.ts'),
	'hooks/index': resolve(root, 'src/hooks/index.ts'),
	'actions/index': resolve(root, 'src/actions/index.ts'),
	'utils/index': resolve(root, 'src/utils/index.ts'),
} as const

const kits = ['social', 'admin'] as const

const isServerEntry = (fileName: string): boolean =>
	fileName.startsWith('actions/') ||
	fileName.startsWith('utils/') ||
	fileName === 'shared-server.js'

/**
 * Собирает styles.css каждого кита в dist с разрешёнными @import.
 * `layer(components)` сохраняется: className/Tailwind перекрывают кит,
 * не сбрасывая его. Подключает CSS из kit entry, чтобы Next видел `'use client'`.
 */
const emitKitStyles = (): Plugin => {
	const flattenCss = (filePath: string, seen = new Set<string>()): string => {
		if (seen.has(filePath)) {
			return ''
		}

		seen.add(filePath)

		const source = readFileSync(filePath, 'utf8')
		const directory = dirname(filePath)

		return source.replace(
			/@import\s+['"](.+)['"](?:\s+layer\(([^)]+)\))?\s*;/g,
			(_match, importPath: string, layerName?: string) => {
				const css = flattenCss(resolve(directory, importPath), seen)

				if (layerName == null || css.trim() === '') {
					return css
				}

				return `@layer ${layerName} {\n${css}\n}`
			},
		)
	}

	return {
		name: 'emit-kit-styles',
		generateBundle(_options, bundle) {
			for (const fileName of Object.keys(bundle)) {
				if (/^index\d*\.css$/.test(fileName)) {
					delete bundle[fileName]
				}
			}

			const socialCss = flattenCss(
				resolve(root, 'src/kits/social/styles.css'),
			)

			for (const kit of kits) {
				const entryName = `kits/${kit}/index.js`
				const entry = bundle[entryName]

				if (entry?.type === 'chunk') {
					const withoutDirective = entry.code.replace(
						/^['"]use client['"];?\n/,
						'',
					)
					entry.code = `'use client';\nimport './styles.css';\n${withoutDirective}`
				}

				this.emitFile({
					type: 'asset',
					fileName: `kits/${kit}/styles.css`,
					source:
						kit === 'social'
							? socialCss
							: flattenCss(resolve(root, `src/kits/${kit}/styles.css`)),
				})
			}

			this.emitFile({
				type: 'asset',
				fileName: 'kits/ui-kit/styles.css',
				source: socialCss,
			})
		},
	}
}

export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(root, 'src'),
		},
	},
	build: {
		lib: {
			entry: kitEntries,
			formats: ['es'],
			fileName: (_format, entryName) => `${entryName}.js`,
		},
		cssCodeSplit: true,
		emptyOutDir: true,
		rollupOptions: {
			external: [
				'react',
				'react-dom',
				'react/jsx-runtime',
				'react/jsx-dev-runtime',
				/^@base-ui\/react(?:\/|$)/,
				/^swiper(?:\/|$)/,
				/^framer-motion(?:\/|$)/,
				'sonner',
				'vaul',
				'next',
				/^next(?:\/|$)/,
				'zod',
			],
			output: {
				chunkFileNames: (chunkInfo) => {
					const moduleIds = chunkInfo.moduleIds ?? []
					const isServerChunk =
						moduleIds.some((id) => id.includes('/src/actions/')) &&
						!moduleIds.some(
							(id) =>
								id.includes('/src/ui/') ||
								id.includes('/src/hooks/') ||
								id.includes('/src/kits/'),
						)

					return isServerChunk ? 'shared-server.js' : 'shared.js'
				},
				banner: (chunk) =>
					chunk.fileName.endsWith('.js') && !isServerEntry(chunk.fileName)
						? `'use client';\n`
						: '',
			},
		},
	},
	plugins: [
		emitKitStyles(),
		dts({
			tsconfigPath: resolve(root, 'tsconfig.build.json'),
			include: ['src'],
			exclude: ['playground'],
		}),
	],
})
