import {
	createContext,
	useContext,
	type ReactElement,
	type ReactNode,
} from 'react'
import { useLocation } from './use-location'

interface ILocationContextValue {
	pathname: string
	search: string
	navigate: (to: string, options?: { replace?: boolean }) => void
}

const LocationContext = createContext<ILocationContextValue | null>(null)

export const LocationProvider = ({
	children,
}: {
	children: ReactNode
}): ReactElement => {
	const value = useLocation()

	return (
		<LocationContext.Provider value={value}>{children}</LocationContext.Provider>
	)
}

/**
 * Общий pathname playground, чтобы шапка и страницы не расходились.
 * Вызывать только внутри LocationProvider.
 */
export const usePlaygroundLocation = (): ILocationContextValue => {
	const context = useContext(LocationContext)

	if (!context) {
		throw new Error('usePlaygroundLocation must be used within LocationProvider')
	}

	return context
}
