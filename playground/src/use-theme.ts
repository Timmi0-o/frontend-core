import { useCallback, useEffect, useState } from 'react'

const THEME_KEY = 'tg-frontend-core-playground-theme'

/**
 * Держит класс `.dark` на `html` для сверки китов.
 * Вызывать только в playground, не в пакете.
 */
export const useTheme = (): {
	isDark: boolean
	toggleTheme: () => void
} => {
	const [isDark, setIsDark] = useState(false)

	useEffect(() => {
		const stored = window.localStorage.getItem(THEME_KEY)
		const nextIsDark = stored === 'dark'
		setIsDark(nextIsDark)
		document.documentElement.classList.toggle('dark', nextIsDark)
	}, [])

	const toggleTheme = useCallback(() => {
		setIsDark((current) => {
			const nextIsDark = !current
			document.documentElement.classList.toggle('dark', nextIsDark)
			window.localStorage.setItem(THEME_KEY, nextIsDark ? 'dark' : 'light')
			return nextIsDark
		})
	}, [])

	return { isDark, toggleTheme }
}
