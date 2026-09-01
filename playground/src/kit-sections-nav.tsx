import {
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
	type ReactElement,
} from 'react'
import { measureKitsTocIndicator } from './measure-kits-toc-indicator'
import { scrollKitColumnsToSection } from './scroll-kit-columns-to-section'

interface IKitSectionNavItem {
	id: string
	title: string
}

interface IKitSectionsNavProps {
	observeKey: string
}

interface IKitsTocIndicatorStyle {
	top: number
	height: number
	ready: boolean
}

/**
 * Собирает секции из первой колонки каталога после монтирования.
 * Список один на все киты — заголовки в колонках совпадают.
 */
const readCatalogSections = (): IKitSectionNavItem[] => {
	const column = document.querySelector('.kit-column')

	if (!column) {
		return []
	}

	return [...column.querySelectorAll('[data-demo-section]')].flatMap(
		(section) => {
			const id = section.getAttribute('data-demo-section')
			const title = section
				.querySelector('.demo-section__title')
				?.textContent?.trim()

			if (!id || !title) {
				return []
			}

			return [{ id, title }]
		},
	)
}

export const KitSectionsNav = ({
	observeKey,
}: IKitSectionsNavProps): ReactElement | null => {
	const listRef = useRef<HTMLUListElement>(null)
	const [items, setItems] = useState<IKitSectionNavItem[]>([])
	const [activeId, setActiveId] = useState<string | null>(null)
	const [indicator, setIndicator] = useState<IKitsTocIndicatorStyle>({
		top: 0,
		height: 0,
		ready: false,
	})

	useLayoutEffect(() => {
		const nextItems = readCatalogSections()
		setItems(nextItems)
		setActiveId(nextItems[0]?.id ?? null)
		setIndicator({ top: 0, height: 0, ready: false })

		const board = document.querySelector('.kits-board')
		const column = document.querySelector('.kit-column')

		if (!column) {
			return
		}

		const sections = column.querySelectorAll('[data-demo-section]')
		const boardScrolls =
			board instanceof HTMLElement && board.scrollHeight > board.clientHeight + 1
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort(
						(left, right) =>
							left.boundingClientRect.top - right.boundingClientRect.top,
					)
				const nextId = visible[0]?.target.getAttribute('data-demo-section')

				if (nextId) {
					setActiveId(nextId)
				}
			},
			{
				root: boardScrolls ? board : null,
				rootMargin: '-72px 0px -55% 0px',
				threshold: 0,
			},
		)

		sections.forEach((section) => observer.observe(section))

		return () => observer.disconnect()
	}, [observeKey])

	useLayoutEffect(() => {
		const list = listRef.current

		if (!list || !activeId) {
			return
		}

		const syncIndicator = (): void => {
			const next = measureKitsTocIndicator(list, activeId)

			if (!next) {
				return
			}

			setIndicator((current) => ({
				...next,
				ready: current.ready,
			}))
		}

		syncIndicator()
		const frame = window.requestAnimationFrame(() => {
			setIndicator((current) =>
				current.height === 0 ? current : { ...current, ready: true },
			)
		})

		const resizeObserver = new ResizeObserver(syncIndicator)
		resizeObserver.observe(list)

		const activeButton = list.querySelector(
			`[data-section-id="${CSS.escape(activeId)}"]`,
		)
		const scroller = list.closest('.kits-toc__scroller')

		if (
			activeButton instanceof HTMLElement &&
			scroller instanceof HTMLElement
		) {
			const itemTop = activeButton.offsetTop
			const itemBottom = itemTop + activeButton.offsetHeight
			const viewTop = scroller.scrollTop
			const viewBottom = viewTop + scroller.clientHeight

			if (itemTop < viewTop) {
				scroller.scrollTop = itemTop
			} else if (itemBottom > viewBottom) {
				scroller.scrollTop = itemBottom - scroller.clientHeight
			}
		}

		return () => {
			window.cancelAnimationFrame(frame)
			resizeObserver.disconnect()
		}
	}, [activeId, items])

	if (items.length === 0) {
		return null
	}

	return (
		<nav className='kits-toc' aria-label='Разделы каталога'>
			<p className='kits-toc__kicker'>
				<span>Разделы</span>
				<span className='kits-toc__count'>{items.length}</span>
			</p>
			<div className='kits-toc__scroller'>
				<ul
					ref={listRef}
					className='kits-toc__list'
					style={
						{
							'--kits-toc-indicator-top': `${indicator.top}px`,
							'--kits-toc-indicator-height': `${indicator.height}px`,
						} as CSSProperties
					}
				>
					<li className='kits-toc__indicator' aria-hidden>
						<span data-ready={indicator.ready ? '' : undefined} />
					</li>
					{items.map((item) => (
						<li key={item.id}>
							<button
								type='button'
								className='kits-toc__link'
								data-section-id={item.id}
								data-active={activeId === item.id ? '' : undefined}
								onClick={() => {
									setActiveId(item.id)
									scrollKitColumnsToSection(item.id)
								}}
							>
								{item.title}
							</button>
						</li>
					))}
				</ul>
			</div>
		</nav>
	)
}
