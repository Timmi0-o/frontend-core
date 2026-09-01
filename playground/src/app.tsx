import type { ReactElement } from 'react'
import { HomePage } from './home-page'
import { LocationProvider, usePlaygroundLocation } from './location-context'
import { PlaygroundShell } from './playground-shell'
import { UiKitsPage } from './ui-kits-page'

const PlaygroundRoutes = (): ReactElement => {
	const { pathname } = usePlaygroundLocation()

	return (
		<PlaygroundShell>
			{pathname === '/ui-kits' ? <UiKitsPage /> : <HomePage />}
		</PlaygroundShell>
	)
}

export const App = (): ReactElement => {
	return (
		<LocationProvider>
			<PlaygroundRoutes />
		</LocationProvider>
	)
}
