import { useCallback, useEffect, useState } from 'react'

/**
 * Клиентский pathname + search для playground без роутера.
 * Вызывать в shell и страницах, чтобы синхронизироваться с History API.
 */
export const useLocation = (): {
	pathname: string
	search: string
	navigate: (to: string, options?: { replace?: boolean }) => void
} => {
	const [href, setHref] = useState(
		() => `${window.location.pathname}${window.location.search}`,
	)

	useEffect(() => {
		const sync = (): void => {
			setHref(`${window.location.pathname}${window.location.search}`)
		}

		window.addEventListener('popstate', sync)

		return () => {
			window.removeEventListener('popstate', sync)
		}
	}, [])

	const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
		if (options?.replace) {
			window.history.replaceState(null, '', to)
		} else {
			window.history.pushState(null, '', to)
		}

		setHref(`${window.location.pathname}${window.location.search}`)
	}, [])

	const url = new URL(href, window.location.origin)

	return {
		pathname: url.pathname,
		search: url.search,
		navigate,
	}
}
