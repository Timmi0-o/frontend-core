import type { MouseEvent, ReactElement } from 'react'
import {
	getKitImportPath,
	KIT_OPTIONS,
	serializeKitIds,
	type TKitId,
} from './kit-options'
import { usePlaygroundLocation } from './location-context'

const KIT_COMPONENT_NAMES = [
	'Accordion',
	'AdaptiveDialog',
	'AlertBanner',
	'AutoComplete',
	'Avatar',
	'Badge',
	'BottomSheet',
	'Breadcrumbs',
	'Button',
	'Calendar',
	'Card',
	'Checkbox',
	'Chip',
	'ContextMenu',
	'DatePicker',
	'RangeDatePicker',
	'DateTimePicker',
	'DropdownMenu',
	'Input',
	'InputGroup',
	'Label',
	'Modal',
	'PhotoGallery',
	'Popover',
	'Select',
	'Separator',
	'Skeleton',
	'Slider',
	'Spinner',
	'Switch',
	'SwiperCarousel',
	'Table',
	'Tabs',
	'Textarea',
	'TextField',
	'TimePicker',
	'Toaster',
	'Tooltip',
] as const

/**
 * Собирает URL каталога с выбранными китами.
 * Карточки на главной ведут сразу в нужный набор, а не на дефолтный Social.
 */
const buildKitsHref = (ids: readonly TKitId[]): string => {
	return `/ui-kits?kits=${serializeKitIds([...ids])}`
}

export const HomePage = (): ReactElement => {
	const { navigate } = usePlaygroundLocation()
	const catalogHref = buildKitsHref(KIT_OPTIONS.map((kit) => kit.id))

	const openHref =
		(href: string) =>
		(event: MouseEvent<HTMLAnchorElement>): void => {
			event.preventDefault()
			navigate(href)
		}

	return (
		<main className='pg-main pg-main--home'>
			<section className='pg-hero'>
				<p className='pg-kicker'>Playground</p>
				<h1 className='pg-hero__title'>UI-киты</h1>
				<p className='pg-hero__lead'>
					Общие примитивы из @timmi0-o/frontend-core на одном TSX. Внешний вид
					задаёт CSS кита: Social или Admin.
				</p>
				<p className='pg-hero__meta'>
					<a href={catalogHref} onClick={openHref(catalogHref)}>
						Открыть каталог
					</a>
					<span>
						{KIT_OPTIONS.length} кита · {KIT_COMPONENT_NAMES.length} компонентов
					</span>
				</p>
			</section>

			<section className='pg-section' aria-labelledby='kits-title' id='kits'>
				<div className='pg-section__head'>
					<h2 id='kits-title'>Киты</h2>
					<p className='pg-section__lead'>
						Один набор компонентов, разный CSS. В каталоге остаются только
						выбранные киты.
					</p>
				</div>

				<ul className='pg-kit-list'>
					{KIT_OPTIONS.map((kit) => {
						const href = buildKitsHref([kit.id])

						return (
							<li key={kit.id}>
								<a href={href} onClick={openHref(href)}>
									<div className='pg-kit-list__copy'>
										<h3>{kit.title}</h3>
										<code>{getKitImportPath(kit.id)}</code>
										<p>{kit.hint}</p>
									</div>
									<span className='pg-kit-list__action'>Открыть</span>
								</a>
							</li>
						)
					})}
				</ul>
			</section>

			<section className='pg-section' aria-labelledby='parts-title'>
				<div className='pg-section__head pg-section__head--split'>
					<h2 id='parts-title'>Компоненты</h2>
					<p className='pg-section__count'>{KIT_COMPONENT_NAMES.length}</p>
				</div>
				<ul className='pg-tags'>
					{KIT_COMPONENT_NAMES.map((name) => (
						<li key={name}>{name}</li>
					))}
				</ul>
			</section>
		</main>
	)
}
