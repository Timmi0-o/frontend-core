import { Chip, Separator } from '../../src/ui'
import type { ISelectOption } from '../../src/ui/select/select'
import type { ReactElement } from 'react'

export interface IHotelSelectItem {
	value: string
	name: string
	stars: number
	category: string
	status: string
}

export const HOTEL_SELECT_ITEMS: IHotelSelectItem[] = [
	{
		value: 'sea',
		name: 'Отель у моря',
		stars: 3,
		category: 'Гостиница',
		status: 'Размещается',
	},
	{
		value: 'grand',
		name: 'Гранд Отель',
		stars: 5,
		category: 'Гостиница',
		status: 'Размещается',
	},
	{
		value: 'apartments',
		name: 'Апартаменты в центре',
		stars: 4,
		category: 'Апартаменты',
		status: 'Размещается',
	},
	{
		value: 'rent',
		name: 'Автопрокат Юг',
		stars: 0,
		category: 'Авто',
		status: 'Размещается',
	},
	{
		value: 'north',
		name: 'Северные маршруты',
		stars: 0,
		category: 'Туры',
		status: 'Размещается',
	},
]

export const HOTEL_SELECT_OPTIONS: Array<ISelectOption<string>> =
	HOTEL_SELECT_ITEMS.map((item) => ({
		label: item.name,
		value: item.value,
	}))

/**
 * Находит карточку отеля по value опции Select.
 * Нужен кастомному Value/Option, чтобы не дублировать lookup в playground.
 */
export function findHotelSelectItem(
	value: string | number | undefined,
): IHotelSelectItem | undefined {
	if (value == null) {
		return undefined
	}

	return HOTEL_SELECT_ITEMS.find((item) => item.value === String(value))
}

const HotelStars = ({ count }: { count: number }): ReactElement | null => {
	if (count <= 0) {
		return null
	}

	return (
		<span aria-hidden style={{ display: 'inline-flex', gap: 2, flexShrink: 0 }}>
			{Array.from({ length: count }, (_, index) => (
				<svg
					key={index}
					width='12'
					height='12'
					viewBox='0 0 12 12'
					fill='#E8B931'
				>
					<path d='M6 0.8l1.4 3 3.3.5-2.4 2.3.6 3.3L6 8.4 3.1 9.9l.6-3.3L1.3 4.3l3.3-.5L6 .8z' />
				</svg>
			))}
		</span>
	)
}

/**
 * Строка выбранного отеля: название, звёзды, тип, статус.
 * Используется в Select.Value playground.
 */
export function HotelSelectValueContent({
	hotel,
}: {
	hotel: IHotelSelectItem
}): ReactElement {
	return (
		<>
			<span style={{ fontWeight: 700 }}>{hotel.name}</span>
			<HotelStars count={hotel.stars} />
			<Separator
				orientation='vertical'
				style={{ height: '0.875rem', alignSelf: 'center' }}
			/>
			<span style={{ color: 'var(--text, var(--gray))' }}>{hotel.category}</span>
			<Chip variant='success'>{hotel.status}</Chip>
		</>
	)
}

/**
 * Строка опции с названием, звёздами и типом — без статуса.
 */
export function HotelSelectOptionContent({
	hotel,
}: {
	hotel: IHotelSelectItem
}): ReactElement {
	return (
		<>
			<span>{hotel.name}</span>
			<HotelStars count={hotel.stars} />
			<span style={{ color: 'var(--text, var(--gray))', fontSize: '0.75rem' }}>
				{hotel.category}
			</span>
		</>
	)
}
