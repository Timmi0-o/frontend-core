import type { ReactElement, ReactNode } from 'react'
import { Tooltip } from '../../src/ui'
import { usePlaygroundLocation } from './location-context'
import { useTheme } from './use-theme'

interface IPlaygroundShellProps {
	children: ReactNode
}

export const PlaygroundShell = ({
	children,
}: IPlaygroundShellProps): ReactElement => {
	const { pathname, navigate } = usePlaygroundLocation()
	const { isDark, toggleTheme } = useTheme()

	return (
		<div className='pg'>
			<header className='pg-header'>
				<button
					type='button'
					className='pg-brand'
					onClick={() => navigate('/')}
				>
					<span className='pg-brand__mark'>tg</span>
					<span className='pg-brand__text'>
						<span className='pg-brand__name'>frontend-core</span>
						<span className='pg-brand__sub'>playground</span>
					</span>
				</button>

				<nav className='pg-nav' aria-label='Разделы playground'>
					<a
						href='/'
						className='pg-nav__link'
						data-active={pathname === '/' ? '' : undefined}
						onClick={(event) => {
							event.preventDefault()
							navigate('/')
						}}
					>
						Главная
					</a>
					<a
						href='/ui-kits'
						className='pg-nav__link'
						data-active={pathname === '/ui-kits' ? '' : undefined}
						onClick={(event) => {
							event.preventDefault()
							if (pathname !== '/ui-kits') {
								navigate('/ui-kits')
							}
						}}
					>
						UI киты
					</a>
				</nav>

				<button
					type='button'
					className='pg-theme'
					onClick={toggleTheme}
					aria-pressed={isDark}
				>
					{isDark ? 'Тёмная' : 'Светлая'}
				</button>
			</header>

			<Tooltip.Provider>
				{children}
			</Tooltip.Provider>
		</div>
	)
}
