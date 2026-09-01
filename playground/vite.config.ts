import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const playgroundRoot = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(playgroundRoot, '..')

export default defineConfig({
	root: playgroundRoot,
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(packageRoot, 'src'),
		},
	},
	appType: 'spa',
	server: {
		port: 5173,
	},
})
