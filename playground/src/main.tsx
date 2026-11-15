import './playground.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app'

const rootElement = document.getElementById('root')

if (!rootElement) {
	throw new Error('playground root element is missing')
}

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
