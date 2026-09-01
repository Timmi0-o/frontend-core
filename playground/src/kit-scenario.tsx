import { useMemo, useState, type ReactElement } from 'react'
import {
	AlertBanner,
	AutoComplete,
	Avatar,
	BottomSheet,
	Breadcrumbs,
	Button,
	Card,
	Checkbox,
	Chip,
	DatePicker,
	Input,
	Modal,
	Popover,
	Select,
	Skeleton,
	Spinner,
	Switch,
	SwiperCarousel,
	Table,
	Tabs,
	TextField,
	TimePicker,
} from '../../src/ui'
import { KitSlide } from './kit-slide'
import { HOTEL_SLIDES } from './kit-slides'

const CITY_OPTIONS = [
	{ label: 'Казань', value: 'kzn' },
	{ label: 'Санкт-Петербург', value: 'spb' },
	{ label: 'Сочи', value: 'soc' },
]

const HOTEL_OPTIONS = [
	{ label: 'River Palace', value: 'rp' },
	{ label: 'Old Town Loft', value: 'ot' },
	{ label: 'Kazakhstanskaya', value: 'kz' },
]

const NIGHTS_OPTIONS = [
	{ label: '2 ночи', value: '2' },
	{ label: '3 ночи', value: '3' },
	{ label: '4 ночи', value: '4' },
]

const TOURS = [
	{
		id: 'rp',
		hotel: 'River Palace',
		room: 'Делюкс с видом на реку',
		nights: '2 ночи',
		meal: 'Завтрак',
		price: '18 400 ₽',
		prepay: '4 000 ₽',
	},
	{
		id: 'ot',
		hotel: 'Old Town Loft',
		room: 'Студия в центре',
		nights: '3 ночи',
		meal: 'Завтрак',
		price: '21 900 ₽',
		prepay: '5 500 ₽',
	},
	{
		id: 'kz',
		hotel: 'Kazakhstanskaya',
		room: 'Стандарт плюс',
		nights: '2 ночи',
		meal: 'Без питания',
		price: '16 200 ₽',
		prepay: '3 200 ₽',
	},
] as const

const REVIEWS = [
	{
		name: 'Мария К.',
		initials: 'МК',
		stay: 'июль 2026',
		text: 'Тихий номер, завтрак до 11:00, до Кремля 10 минут пешком. Завтрак шведский стол — без очередей.',
	},
	{
		name: 'Игорь С.',
		initials: 'ИС',
		stay: 'июнь 2026',
		text: 'Заезд прошёл быстро, трансфер ждал у выхода. Номер чистый, вид на реку как на фото.',
	},
] as const

/**
 * Короткая дата заезда для шапки сценария и модалки подтверждения.
 * Нужна, когда в сценарии уже есть Date, а в подписи нужен «29 авг».
 */
const formatStayDate = (value: Date | null): string => {
	if (!value) {
		return 'дата не выбрана'
	}

	return new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'short',
	}).format(value)
}

export const KitScenario = (): ReactElement => {
	const [guest, setGuest] = useState('Анна Петрова')
	const [city, setCity] = useState<string | null>('kzn')
	const [hotel, setHotel] = useState<string | null>('rp')
	const [nights, setNights] = useState<string | null>('2')
	const [date, setDate] = useState<Date | null>(new Date())
	const [checkInTime, setCheckInTime] = useState('14:00')
	const [breakfast, setBreakfast] = useState(true)
	const [agree, setAgree] = useState(true)
	const [isSearching, setIsSearching] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isSheetOpen, setIsSheetOpen] = useState(false)
	const [resultTab, setResultTab] = useState('tours')
	const [selectedTourId, setSelectedTourId] = useState<string>('rp')
	const [freeCancel, setFreeCancel] = useState(true)
	const [lateCheckout, setLateCheckout] = useState(true)

	const cityLabel =
		CITY_OPTIONS.find((option) => option.value === city)?.label ?? 'Казань'
	const hotelLabel =
		HOTEL_OPTIONS.find((option) => option.value === hotel)?.label ??
		'River Palace'
	const nightsLabel =
		NIGHTS_OPTIONS.find((option) => option.value === nights)?.label ?? '2 ночи'
	const selectedTour =
		TOURS.find((tour) => tour.id === selectedTourId) ?? TOURS[0]

	const stayLabel = useMemo(
		() => `${formatStayDate(date)}, ${checkInTime} · ${nightsLabel}`,
		[checkInTime, date, nightsLabel],
	)

	const handleSearch = (): void => {
		setIsSearching(true)
		window.setTimeout(() => setIsSearching(false), 700)
	}

	const handlePickTour = (tourId: string): void => {
		setSelectedTourId(tourId)
		setHotel(tourId)
	}

	return (
		<div className='scenario'>
			<Breadcrumbs>
				<Breadcrumbs.Home href='#home' />
				<Breadcrumbs.Item href='#tours'>Туры</Breadcrumbs.Item>
				<Breadcrumbs.Item>{cityLabel}</Breadcrumbs.Item>
			</Breadcrumbs>

			<AlertBanner variant='success'>
				<AlertBanner.Description>
					На эти даты ещё есть свободные номера — бронь держится 15 минут.
				</AlertBanner.Description>
			</AlertBanner>

			<div className='scenario__hero'>
				<div>
					<p className='scenario__kicker'>Выбранный вариант</p>
					<p className='scenario__hero-title'>{selectedTour.hotel}</p>
					<p className='scenario__hero-meta'>
						{cityLabel} · {stayLabel} · {guest}
					</p>
					<div className='kit-row'>
						<Chip variant='accent'>
							{breakfast ? 'Завтрак' : 'Без завтрака'}
						</Chip>
						<Chip>2 взрослых</Chip>
						<Chip variant='outline'>Отмена 24 ч</Chip>
					</div>
				</div>
				<div className='scenario__hero-price'>
					<strong>{selectedTour.price}</strong>
					<span>за номер</span>
				</div>
			</div>

			<Card>
				<Card.Header>
					<Card.Title>Подбор тура на выходные</Card.Title>
					<Card.Description>
						Поиск, сравнение отелей и подтверждение брони в одном сценарии.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<SwiperCarousel slidesPerView={1} spaceBetween={8} grabCursor>
						{HOTEL_SLIDES.map((slide) => (
							<KitSlide key={slide.src} src={slide.src} title={slide.title} />
						))}
					</SwiperCarousel>

					<div className='scenario__chips'>
						<Chip variant='accent'>Выходные</Chip>
						<Chip>{nightsLabel}</Chip>
						<Chip variant='outline'>Гибкие даты</Chip>
					</div>

					<div className='scenario__form'>
						<TextField name='guest'>
							<TextField.Label>Гость</TextField.Label>
							<TextField.Input
								size='sm'
								value={guest}
								onChange={(event) => setGuest(event.target.value)}
							/>
						</TextField>

						<Select
							label='Город'
							size='sm'
							options={CITY_OPTIONS}
							value={city}
							onChange={setCity}
						/>

						<AutoComplete
							label='Отель'
							size='sm'
							options={HOTEL_OPTIONS}
							value={hotel}
							onChange={(value) => {
								setHotel(value)
								if (value) {
									setSelectedTourId(tourIdFromHotel(value))
								}
							}}
						/>

						<Select
							label='Длительность'
							size='sm'
							options={NIGHTS_OPTIONS}
							value={nights}
							onChange={setNights}
						/>

						<DatePicker
							label='Заезд'
							value={date}
							onChange={setDate}
							minDate={new Date(2020, 0, 1)}
						/>

						<TimePicker
							label='Время заезда'
							size='sm'
							value={checkInTime}
							onChange={setCheckInTime}
						/>

						<Input
							size='sm'
							placeholder='Комментарий к брони: поздний заезд, люлька, трансфер'
							aria-label='Комментарий'
						/>
					</div>

					<div className='scenario__toggles'>
						<Switch
							label='Завтрак включён'
							isChecked={breakfast}
							onCheckedChange={setBreakfast}
						/>
						<Checkbox
							label='Согласен с правилами отмены'
							checked={agree}
							onCheckedChange={setAgree}
						/>
					</div>
				</Card.Content>
				<Card.Footer>
					<div className='scenario__actions'>
						<Button isPending={isSearching} onClick={handleSearch}>
							Найти варианты
						</Button>
						<Popover>
							<Popover.Trigger>
								<Button variant='ghost'>Что входит</Button>
							</Popover.Trigger>
							<Popover.Content panelClassName='kit-popover-preview'>
								<p className='kit-popover-preview__title'>{hotelLabel}</p>
								<p className='kit-popover-preview__lead'>
									{cityLabel} · {nightsLabel} ·{' '}
									{breakfast ? 'завтрак' : 'без завтрака'}
								</p>
								<ul className='kit-popover-preview__list'>
									<li>Завтрак «шведский стол»</li>
									<li>Трансфер из аэропорта</li>
									<li>Бесплатная отмена за 24 часа</li>
								</ul>
								<p className='kit-popover-preview__price'>
									{selectedTour.price}
								</p>
							</Popover.Content>
						</Popover>
						<Button variant='outline' onClick={() => setIsSheetOpen(true)}>
							Фильтры
						</Button>
					</div>
				</Card.Footer>
			</Card>

			{isSearching ? (
				<div className='scenario__loading'>
					<Spinner size='md' />
					<Skeleton style={{ height: 14, width: '40%' }} />
					<Skeleton style={{ height: 72, width: '100%' }} />
					<Skeleton style={{ height: 72, width: '100%' }} />
				</div>
			) : (
				<Tabs
					value={resultTab}
					onChange={setResultTab}
					items={[
						{ value: 'tours', label: 'Варианты' },
						{ value: 'reviews', label: 'Отзывы' },
					]}
				>
					<Tabs.Panel value='tours'>
						<Table>
							<Table.ScrollContainer>
								<Table.Element>
									<Table.Head>
										<Table.HeaderRow>
											<Table.HeaderCell>
												<Table.HeaderCellContent sortable sortDirection='asc'>
													Отель
												</Table.HeaderCellContent>
											</Table.HeaderCell>
											<Table.HeaderCell>Номер</Table.HeaderCell>
											<Table.HeaderCell>Ночи</Table.HeaderCell>
											<Table.HeaderCell>Цена</Table.HeaderCell>
											<Table.HeaderCell width={118} />
										</Table.HeaderRow>
									</Table.Head>
									<Table.Body>
										{TOURS.map((tour) => (
											<Table.Row
												key={tour.id}
												data-selected={
													tour.id === selectedTourId ? '' : undefined
												}
											>
												<Table.Cell>{tour.hotel}</Table.Cell>
												<Table.Cell>{tour.room}</Table.Cell>
												<Table.Cell>{tour.nights}</Table.Cell>
												<Table.Cell>{tour.price}</Table.Cell>
												<Table.Cell width={118}>
													<Button
														size='sm'
														variant={
															tour.id === selectedTourId
																? 'primary'
																: 'outline'
														}
														onClick={() => handlePickTour(tour.id)}
													>
														{tour.id === selectedTourId
															? 'Выбран'
															: 'Выбрать'}
													</Button>
												</Table.Cell>
											</Table.Row>
										))}
									</Table.Body>
								</Table.Element>
							</Table.ScrollContainer>
						</Table>
					</Tabs.Panel>
					<Tabs.Panel value='reviews'>
						<div className='scenario__reviews'>
							{REVIEWS.map((review) => (
								<article key={review.name} className='scenario__review'>
									<Avatar size='sm'>
										<Avatar.Fallback>{review.initials}</Avatar.Fallback>
									</Avatar>
									<div>
										<div className='scenario__review-head'>
											<strong>{review.name}</strong>
											<Chip variant='outline'>{review.stay}</Chip>
										</div>
										<p>{review.text}</p>
									</div>
								</article>
							))}
						</div>
					</Tabs.Panel>
				</Tabs>
			)}

			<div className='scenario__actions scenario__actions--end'>
				<Button
					isDisabled={!agree}
					onClick={() => setIsModalOpen(true)}
				>
					Забронировать {selectedTour.hotel}
				</Button>
			</div>

			<Modal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				className='kit-modal-preview'
			>
				<Modal.Header>
					<Modal.Title>Подтвердить бронь</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className='kit-modal-preview__content'>
						<p className='kit-modal-preview__hotel'>{selectedTour.hotel}</p>
						<p className='kit-modal-preview__meta'>
							{cityLabel} · {stayLabel} · {guest}
						</p>
						<div className='kit-row'>
							<Chip variant='accent'>
								{breakfast ? 'Завтрак' : 'Без завтрака'}
							</Chip>
							<Chip>2 гостя</Chip>
							<Chip variant='outline'>Бесплатная отмена</Chip>
						</div>
						<dl className='kit-modal-preview__details'>
							<div>
								<dt>Номер</dt>
								<dd>{selectedTour.room}</dd>
							</div>
							<div>
								<dt>Питание</dt>
								<dd>{breakfast ? selectedTour.meal : 'Без питания'}</dd>
							</div>
							<div>
								<dt>Стоимость</dt>
								<dd>{selectedTour.price}</dd>
							</div>
							<div>
								<dt>Предоплата</dt>
								<dd>{selectedTour.prepay}</dd>
							</div>
						</dl>
						<p className='kit-modal-preview__sum'>
							К оплате {selectedTour.price}
						</p>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='outline' onClick={() => setIsModalOpen(false)}>
						Позже
					</Button>
					<Button onClick={() => setIsModalOpen(false)}>Подтвердить</Button>
				</Modal.Footer>
			</Modal>

			<BottomSheet
				open={isSheetOpen}
				onOpenChange={setIsSheetOpen}
				title='Фильтры поиска'
				height='min(72vh, 560px)'
			>
				<div className='kit-sheet-preview'>
					<p className='kit-sheet-preview__lead'>
						{cityLabel} · {stayLabel} · 2 взрослых
					</p>
					<div className='kit-sheet-preview__group'>
						<p className='kit-sheet-preview__label'>Условия</p>
						<Checkbox
							label='Бесплатная отмена за 24 часа'
							checked={freeCancel}
							onCheckedChange={setFreeCancel}
						/>
						<Checkbox
							label='Поздний выезд до 16:00'
							checked={lateCheckout}
							onCheckedChange={setLateCheckout}
						/>
						<Checkbox
							label='Только отели 4 звезды и выше'
							defaultChecked
						/>
					</div>
					<div className='kit-sheet-preview__group'>
						<p className='kit-sheet-preview__label'>Дополнительно</p>
						<div className='kit-row'>
							<Chip variant='accent' clickable>
								Центр
							</Chip>
							<Chip clickable variant='outline'>
								Бассейн
							</Chip>
							<Chip clickable variant='outline'>
								Парковка
							</Chip>
						</div>
					</div>
					<div className='kit-sheet-preview__actions'>
						<Button variant='ghost' onClick={() => setIsSheetOpen(false)}>
							Сбросить
						</Button>
						<Button onClick={() => setIsSheetOpen(false)}>
							Показать варианты
						</Button>
					</div>
				</div>
			</BottomSheet>
		</div>
	)
}

/**
 * Сопоставляет value отеля из автокомплита с id строки в таблице туров.
 */
const tourIdFromHotel = (value: string): string => {
	return TOURS.some((tour) => tour.id === value) ? value : 'rp'
}
