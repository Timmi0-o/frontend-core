'use client'

import { useState, type ReactElement } from 'react'
import {
	AdaptiveDialog,
	BottomSheet,
	Button,
	Checkbox,
	Chip,
	Modal,
	Popover,
	Separator,
	Switch,
} from '../../src/ui'

export const KitPopoverPreview = (): ReactElement => {
	return (
		<Popover>
			<Popover.Trigger>
				<Button variant='outline'>Что входит в номер</Button>
			</Popover.Trigger>
			<Popover.Content panelClassName='kit-popover-preview'>
				<p className='kit-popover-preview__title'>River Palace, 4*</p>
				<p className='kit-popover-preview__lead'>Казань · 2 ночи · завтрак</p>
				<ul className='kit-popover-preview__list'>
					<li>Завтрак «шведский стол»</li>
					<li>Трансфер из аэропорта</li>
					<li>Бесплатная отмена за 24 часа</li>
				</ul>
				<p className='kit-popover-preview__price'>18 400 ₽</p>
			</Popover.Content>
		</Popover>
	)
}

export const KitAdaptiveDialogPreview = (): ReactElement => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<Button variant='outline' onClick={() => setIsOpen(true)}>
				AdaptiveDialog
			</Button>
			<AdaptiveDialog
				open={isOpen}
				onOpenChange={setIsOpen}
				title='Подтвердить бронь'
			>
				<AdaptiveDialog.Content className='kit-modal-preview'>
					<AdaptiveDialog.Header>
						<AdaptiveDialog.Title>Подтвердить бронь</AdaptiveDialog.Title>
					</AdaptiveDialog.Header>
					<AdaptiveDialog.Body>
						<div className='kit-modal-preview__content'>
							<p className='kit-modal-preview__hotel'>River Palace, 4*</p>
							<p className='kit-modal-preview__meta'>
								Казань · заезд 29 авг, 14:00 · 2 ночи
							</p>
							<div className='kit-row'>
								<Chip variant='accent'>Завтрак</Chip>
								<Chip>2 гостя</Chip>
							</div>
							<p className='kit-modal-preview__sum'>К оплате 18 400 ₽</p>
						</div>
					</AdaptiveDialog.Body>
					<AdaptiveDialog.Footer>
						<Button variant='outline' onClick={() => setIsOpen(false)}>
							Позже
						</Button>
						<Button onClick={() => setIsOpen(false)}>Подтвердить</Button>
					</AdaptiveDialog.Footer>
				</AdaptiveDialog.Content>
			</AdaptiveDialog>
		</>
	)
}

export const KitModalPreview = (): ReactElement => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<Button variant='outline' onClick={() => setIsOpen(true)}>
				Подтвердить бронь
			</Button>
			<Modal
				open={isOpen}
				onOpenChange={setIsOpen}
				className='kit-modal-preview'
			>
				<Modal.Header>
					<Modal.Title>Подтвердить бронь</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className='kit-modal-preview__content'>
						<p className='kit-modal-preview__hotel'>River Palace, 4*</p>
						<p className='kit-modal-preview__meta'>
							Казань · заезд 29 авг, 14:00 · 2 ночи
						</p>
						<div className='kit-row'>
							<Chip variant='accent'>Завтрак</Chip>
							<Chip>2 гостя</Chip>
							<Chip variant='outline'>Бесплатная отмена</Chip>
						</div>
						<dl className='kit-modal-preview__details'>
							<div>
								<dt>Номер</dt>
								<dd>Делюкс с видом на море</dd>
							</div>
							<div>
								<dt>Трансфер</dt>
								<dd>Включён</dd>
							</div>
							<div>
								<dt>Стоимость</dt>
								<dd>18 400 ₽</dd>
							</div>
							<div>
								<dt>Предоплата</dt>
								<dd>4 000 ₽</dd>
							</div>
						</dl>
						<p className='kit-modal-preview__sum'>К оплате 18 400 ₽</p>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='outline' onClick={() => setIsOpen(false)}>
						Позже
					</Button>
					<Button onClick={() => setIsOpen(false)}>Подтвердить</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

const PRICE_OPTIONS = [
	{ label: 'Любая', value: 'any' },
	{ label: 'до 10 000 ₽', value: 'low' },
	{ label: '10–20 000 ₽', value: 'mid' },
	{ label: 'от 20 000 ₽', value: 'high' },
] as const

const STAR_OPTIONS = ['3★', '4★', '5★'] as const

const AMENITY_OPTIONS = [
	{ label: 'Wi-Fi', value: 'wifi' },
	{ label: 'Бассейн', value: 'pool' },
	{ label: 'Парковка', value: 'parking' },
	{ label: 'Спа', value: 'spa' },
	{ label: 'Пляж', value: 'beach' },
	{ label: 'Фитнес', value: 'gym' },
] as const

const DISTRICT_OPTIONS = [
	{ label: 'Центр', value: 'center' },
	{ label: 'Кремль', value: 'kremlin' },
	{ label: 'Озеро Кабан', value: 'kaban' },
	{ label: 'Аэропорт', value: 'airport' },
] as const

/**
 * Включает или выключает значение в мультивыборе фильтров.
 * Нужен чипам BottomSheet, чтобы не дублировать setState по каждой группе.
 */
const toggleFilterValue = (current: string[], value: string): string[] => {
	return current.includes(value)
		? current.filter((item) => item !== value)
		: [...current, value]
}

export const KitSheetPreview = (): ReactElement => {
	const [isOpen, setIsOpen] = useState(false)
	const [price, setPrice] = useState('any')
	const [stars, setStars] = useState<string[]>(['4★'])
	const [amenities, setAmenities] = useState(['wifi', 'pool'])
	const [districts, setDistricts] = useState(['center'])
	const [breakfast, setBreakfast] = useState(true)
	const [allInclusive, setAllInclusive] = useState(false)
	const [halfBoard, setHalfBoard] = useState(false)
	const [freeCancel, setFreeCancel] = useState(true)
	const [withPhoto, setWithPhoto] = useState(true)
	const [instantConfirm, setInstantConfirm] = useState(false)
	const [pets, setPets] = useState(false)
	const [lateCheckout, setLateCheckout] = useState(true)

	const resultCount =
		18 +
		(breakfast ? 3 : 0) +
		(freeCancel ? 2 : 0) +
		amenities.length +
		districts.length +
		(stars.length === 0 ? -4 : stars.length)

	const resetFilters = (): void => {
		setPrice('any')
		setStars(['4★'])
		setAmenities(['wifi', 'pool'])
		setDistricts(['center'])
		setBreakfast(true)
		setAllInclusive(false)
		setHalfBoard(false)
		setFreeCancel(true)
		setWithPhoto(true)
		setInstantConfirm(false)
		setPets(false)
		setLateCheckout(true)
	}

	return (
		<>
			<Button variant='outline' onClick={() => setIsOpen(true)}>
				Фильтры поиска
			</Button>
			<BottomSheet
				open={isOpen}
				onOpenChange={setIsOpen}
				title='Фильтры поиска'
				height='min(86vh, 760px)'
			>
				<div className='kit-sheet-preview'>
					<p className='kit-sheet-preview__lead'>
						Казань · 29–31 авг · 2 взрослых · без детей
					</p>

					<div className='kit-sheet-preview__group'>
						<p className='kit-sheet-preview__label'>Стоимость за ночь</p>
						<div className='kit-row'>
							{PRICE_OPTIONS.map((option) => (
								<Chip
									key={option.value}
									clickable
									variant={price === option.value ? 'accent' : 'outline'}
									onClick={() => setPrice(option.value)}
								>
									{option.label}
								</Chip>
							))}
						</div>
					</div>

					<div className='kit-sheet-preview__group'>
						<p className='kit-sheet-preview__label'>Категория отеля</p>
						<div className='kit-row'>
							{STAR_OPTIONS.map((option) => (
								<Chip
									key={option}
									clickable
									variant={stars.includes(option) ? 'accent' : 'outline'}
									onClick={() =>
										setStars((current) => toggleFilterValue(current, option))
									}
								>
									{option}
								</Chip>
							))}
						</div>
					</div>

					<div className='kit-sheet-preview__group'>
						<p className='kit-sheet-preview__label'>Питание</p>
						<Checkbox
							label='Завтрак включён'
							checked={breakfast}
							onCheckedChange={setBreakfast}
						/>
						<Checkbox
							label='Всё включено'
							checked={allInclusive}
							onCheckedChange={setAllInclusive}
						/>
						<Checkbox
							label='Полупансион'
							checked={halfBoard}
							onCheckedChange={setHalfBoard}
						/>
					</div>

					<Separator />

					<div className='kit-sheet-preview__group'>
						<p className='kit-sheet-preview__label'>Удобства</p>
						<div className='kit-row'>
							{AMENITY_OPTIONS.map((option) => (
								<Chip
									key={option.value}
									clickable
									variant={
										amenities.includes(option.value) ? 'accent' : 'outline'
									}
									onClick={() =>
										setAmenities((current) =>
											toggleFilterValue(current, option.value),
										)
									}
								>
									{option.label}
								</Chip>
							))}
						</div>
					</div>

					<div className='kit-sheet-preview__group'>
						<p className='kit-sheet-preview__label'>Район</p>
						<div className='kit-row'>
							{DISTRICT_OPTIONS.map((option) => (
								<Chip
									key={option.value}
									clickable
									variant={
										districts.includes(option.value) ? 'accent' : 'outline'
									}
									onClick={() =>
										setDistricts((current) =>
											toggleFilterValue(current, option.value),
										)
									}
								>
									{option.label}
								</Chip>
							))}
						</div>
					</div>

					<Separator />

					<div className='kit-sheet-preview__group'>
						<p className='kit-sheet-preview__label'>Условия брони</p>
						<Checkbox
							label='Бесплатная отмена за 24 часа'
							checked={freeCancel}
							onCheckedChange={setFreeCancel}
						/>
						<Checkbox
							label='Можно с питомцами'
							checked={pets}
							onCheckedChange={setPets}
						/>
						<Checkbox
							label='Поздний выезд до 16:00'
							checked={lateCheckout}
							onCheckedChange={setLateCheckout}
						/>
					</div>

					<div className='kit-sheet-preview__group'>
						<p className='kit-sheet-preview__label'>Выдача результатов</p>
						<Switch
							label='Только с фото номеров'
							isChecked={withPhoto}
							onCheckedChange={setWithPhoto}
						/>
						<Switch
							label='Мгновенное подтверждение'
							isChecked={instantConfirm}
							onCheckedChange={setInstantConfirm}
						/>
					</div>

					<div className='kit-sheet-preview__actions'>
						<Button variant='ghost' onClick={resetFilters}>
							Сбросить
						</Button>
						<Button onClick={() => setIsOpen(false)}>
							Показать {Math.max(resultCount, 3)} номеров
						</Button>
					</div>
				</div>
			</BottomSheet>
		</>
	)
}
