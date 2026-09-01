import { useState, type ReactElement } from 'react'
import {
	AlertBanner,
	Accordion,
	AutoComplete,
	Avatar,
	Badge,
	Breadcrumbs,
	Calendar,
	Button,
	Checkbox,
	Chip,
	DatePicker,
	RangeDatePicker,
	DateTimePicker,
	Input,
	InputGroup,
	Label,
	PhotoGallery,
	Separator,
	Select,
	Spinner,
	Slider,
	Switch,
	SwiperCarousel,
	Table,
	Tabs,
	Textarea,
	TextField,
	TimePicker,
	Tooltip,
	Toaster,
} from '../../src/ui'
import type { IButtonSize, IButtonVariant } from '../../src/ui/button/types/i-button-props'
import type { IDateRangeValue } from '../../src/ui'
import { toast } from 'sonner'
import { DemoSection } from './demo-section'
import { KitMenuPreview } from './kit-menu-preview'
import { KitOfferCard } from './kit-offer-card'
import { KitOfferSkeleton } from './kit-offer-skeleton'
import {
	KitAdaptiveDialogPreview,
	KitModalPreview,
	KitPopoverPreview,
	KitSheetPreview,
} from './kit-overlay-previews'
import { KitScenarioDialog } from './kit-scenario-dialog'
import { KitSlide } from './kit-slide'
import { CATALOG_SLIDES } from './kit-slides'
import {
	findHotelSelectItem,
	HOTEL_SELECT_ITEMS,
	HOTEL_SELECT_OPTIONS,
	HotelSelectOptionContent,
	HotelSelectValueContent,
} from './kit-select-previews'
import { getKitStyleEntry, type TKitId } from './kit-options'

const VARIANTS: IButtonVariant[] = [
	'primary',
	'secondary',
	'tertiary',
	'outline',
	'ghost',
	'light',
	'danger',
	'soft-danger',
]

const SIZES: IButtonSize[] = ['xxs', 'xs', 'sm', 'md', 'lg']

const CITY_OPTIONS = [
	{ label: 'Москва', value: 'msk' },
	{ label: 'Санкт-Петербург', value: 'spb' },
	{ label: 'Казань', value: 'kzn' },
]

const TAB_ITEMS = [
	{ label: 'Отели', value: 'hotels' },
	{ label: 'Перелёты', value: 'flights' },
	{ label: 'Отзывы', value: 'reviews', isDisabled: true },
]

const GALLERY_IMAGES = CATALOG_SLIDES.map((slide) => ({
	src: slide.src,
	alt: slide.title,
	fileName: `${slide.title}.jpg`,
}))

interface IKitColumnProps {
	kitId: TKitId
	title: string
	hint: string
	uiKit: string
}

/** Число `DemoSection` в колонке. Нужно subgrid, чтобы ряды китов совпадали по высоте. */
export const KIT_CATALOG_SECTION_COUNT = 32

/** Шапка колонки плюс секции каталога — сколько рядов занимает кит в общей сетке. */
export const KIT_COLUMN_GRID_ROWS = 1 + KIT_CATALOG_SECTION_COUNT

export const KitColumn = ({
	kitId,
	title,
	hint,
	uiKit,
}: IKitColumnProps): ReactElement => {
	const [isChecked, setIsChecked] = useState(true)
	const [isSwitchOn, setIsSwitchOn] = useState(true)
	const [isBreakfastOn, setIsBreakfastOn] = useState(true)
	const [isNotifyOn, setIsNotifyOn] = useState(false)
	const [isMarketingOn, setIsMarketingOn] = useState(true)
	const [commission, setCommission] = useState(14)
	const [volume, setVolume] = useState(40)
	const [priceRange, setPriceRange] = useState<readonly number[]>([20, 80])
	const [city, setCity] = useState<string | null>('msk')
	const [cityLight, setCityLight] = useState<string | null>('msk')
	const [hotelId, setHotelId] = useState<string | null>('sea')
	const [hotelRichId, setHotelRichId] = useState<string | null>('sea')
	const [queryCity, setQueryCity] = useState<string | null>(null)
	const [date, setDate] = useState<Date | null>(new Date())
	const [dateRange, setDateRange] = useState<IDateRangeValue>({
		start: new Date(),
		end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3),
	})
	const [calendarDate, setCalendarDate] = useState<Date | null>(new Date())
	const [timeValue, setTimeValue] = useState('09:30')
	const [dateTimeValue, setDateTimeValue] = useState('2026-08-29T09:30')
	const [tab, setTab] = useState('hotels')
	const [solidTab, setSolidTab] = useState('hotels')
	const [lightTab, setLightTab] = useState('hotels')
	const [galleryOpen, setGalleryOpen] = useState(false)
	const [galleryIndex, setGalleryIndex] = useState(0)
	const [isScenarioOpen, setIsScenarioOpen] = useState(false)

	return (
		<article className='kit-column' data-ui-kit={uiKit}>
			<div className='kit-column__portals'>
				<Toaster id={uiKit} />
				<KitScenarioDialog
					open={isScenarioOpen}
					onClose={() => setIsScenarioOpen(false)}
				/>
			</div>
			<header className='kit-column__head'>
				<div className='kit-column__intro'>
					<h2 className='kit-column__title'>{title}</h2>
					<p className='kit-column__package'>{getKitStyleEntry(kitId)}</p>
					<p className='kit-column__hint'>{hint}</p>
				</div>
				<Button
					variant='outline'
					size='sm'
					onClick={() => setIsScenarioOpen(true)}
				>
					Сценарий
				</Button>
			</header>

			<div className='kit-column__catalog'>
				<DemoSection title='Accordion'>
					<div className='kit-stack kit-stack--full'>
						<div>
							<p className='kit-caption'>один открытый</p>
							<Accordion defaultValue={['included']}>
								<Accordion.Item value='included'>
									<Accordion.Header>
										<Accordion.Trigger>
											Что входит в тур
										</Accordion.Trigger>
									</Accordion.Header>
									<Accordion.Panel>
										Перелёт, трансфер, проживание и завтраки.
										Экскурсии — по желанию.
									</Accordion.Panel>
								</Accordion.Item>
								<Accordion.Item value='cancel'>
									<Accordion.Header>
										<Accordion.Trigger>
											Отмена и возврат
										</Accordion.Trigger>
									</Accordion.Header>
									<Accordion.Panel>
										Бесплатная отмена за 48 часов до заезда.
										Позже удерживается стоимость первой ночи.
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</div>
						<div>
							<p className='kit-caption'>несколько открытых</p>
							<Accordion multiple>
								<Accordion.Item value='docs'>
									<Accordion.Header>
										<Accordion.Trigger>
											Документы
										</Accordion.Trigger>
									</Accordion.Header>
									<Accordion.Panel>
										Загранпаспорт сроком не менее 6 месяцев
										на дату вылета.
									</Accordion.Panel>
								</Accordion.Item>
								<Accordion.Item value='kids'>
									<Accordion.Header>
										<Accordion.Trigger>
											С детьми
										</Accordion.Trigger>
									</Accordion.Header>
									<Accordion.Panel>
										До 2 лет без места. Детский стул в
										ресторане — по запросу.
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</div>
					</div>
				</DemoSection>

				<DemoSection title='AdaptiveDialog'>
					<KitAdaptiveDialogPreview />
				</DemoSection>

				<DemoSection title='AlertBanner'>
					<div className='kit-stack kit-stack--full'>
						<AlertBanner variant='default'>
							<AlertBanner.Description>
								Информация: тариф можно изменить до заезда без доплаты.
							</AlertBanner.Description>
						</AlertBanner>
						<AlertBanner variant='warning'>
							<AlertBanner.Description>
								Свободных номеров мало: подтвердите бронь в течение 15 минут.
							</AlertBanner.Description>
						</AlertBanner>
						<AlertBanner variant='danger'>
							<AlertBanner.Description>
								Не удалось подтвердить бронь: платёж не прошёл.
								Проверьте карту или выберите другой способ оплаты.
							</AlertBanner.Description>
						</AlertBanner>
						<AlertBanner variant='success'>
							<AlertBanner.Description>
								Бронь подтверждена. Ваучер отправлен на почту гостя,
								номер закреплён на эти даты.
							</AlertBanner.Description>
						</AlertBanner>
						<AlertBanner variant='soft-danger'>
							<AlertBanner.Description>
								Часть услуг недоступна. Можно продолжить без трансфера.
							</AlertBanner.Description>
						</AlertBanner>
					</div>
				</DemoSection>

				<DemoSection title='AutoComplete'>
					<div className='kit-stack kit-stack--full'>
						<p className='kit-caption'>default</p>
						<AutoComplete
							label='Поиск'
							options={CITY_OPTIONS}
							value={queryCity}
							onChange={setQueryCity}
						/>
						<p className='kit-caption'>light</p>
						<AutoComplete
							label='Поиск'
							options={CITY_OPTIONS}
							value={queryCity}
							onChange={setQueryCity}
							variant='light'
						/>
					</div>
				</DemoSection>

				<DemoSection title='Avatar + Badge'>
					<div className='kit-row'>
						<Avatar>
							<Avatar.Image src='/slides/stay.jpg' alt='Анна Петрова' />
							<Avatar.Fallback>АП</Avatar.Fallback>
							<Avatar.Badge />
						</Avatar>
						<Avatar size='sm'>
							<Avatar.Fallback>ТП</Avatar.Fallback>
						</Avatar>
						<Avatar size='lg'>
							<Avatar.Image src='/slides/stay-v2.jpg' alt='Михаил Орлов' />
							<Avatar.Fallback>МО</Avatar.Fallback>
						</Avatar>
						<Avatar.Group>
							<Avatar>
								<Avatar.Fallback>А</Avatar.Fallback>
							</Avatar>
							<Avatar>
								<Avatar.Fallback>Б</Avatar.Fallback>
							</Avatar>
							<Avatar>
								<Avatar.Fallback>В</Avatar.Fallback>
							</Avatar>
						</Avatar.Group>
						<Avatar.GroupCount>+4</Avatar.GroupCount>
					</div>
					<div className='kit-row'>
						<Badge>new</Badge>
						<Badge variant='success'>online</Badge>
						<Badge variant='error'>overdue</Badge>
						<Badge variant='outline'>outline</Badge>
					</div>
					<div className='kit-row'>
						<Badge content={5} placement='top' variant='error'>
							<Avatar>
								<Avatar.Image src='/slides/stay.jpg' alt='Уведомления' />
								<Avatar.Fallback>АП</Avatar.Fallback>
							</Avatar>
						</Badge>
						<Badge content={2} placement='bottom' variant='error'>
							<Button variant='outline' size='sm'>
								Корзина
							</Button>
						</Badge>
						<Badge placement='bottom' variant='success'>
							<Avatar size='lg'>
								<Avatar.Fallback>МО</Avatar.Fallback>
							</Avatar>
						</Badge>
					</div>
				</DemoSection>

				<DemoSection title='BottomSheet'>
					<KitSheetPreview />
				</DemoSection>

				<DemoSection title='Breadcrumbs'>
					<div className='kit-stack kit-stack--full'>
						{(
							['default', 'solid', 'light'] as const
						).map((variant) => (
							<div key={variant}>
								<p className='kit-caption'>{variant}</p>
								<Breadcrumbs variant={variant}>
									<Breadcrumbs.Home href='#home' />
									<Breadcrumbs.Item href='#catalog'>
										Каталог
									</Breadcrumbs.Item>
									<Breadcrumbs.Item>Текущая</Breadcrumbs.Item>
								</Breadcrumbs>
							</div>
						))}
					</div>
				</DemoSection>

				<DemoSection title='Button'>
					<div className='kit-row'>
						{VARIANTS.map((variant) => (
							<Button key={variant} variant={variant}>
								{variant}
							</Button>
						))}
					</div>
					<div className='kit-row'>
						{SIZES.map((size) => (
							<Button key={size} size={size}>
								{size}
							</Button>
						))}
					</div>
					<div className='kit-row'>
						<Button isPending>pending</Button>
						<Button isDisabled>disabled</Button>
						<Button isIconOnly aria-label='icon'>
							•
						</Button>
						<Button fullWidth>full width</Button>
					</div>
				</DemoSection>

				<DemoSection title='Calendar'>
					<div className='kit-stack kit-stack--full'>
						<Calendar value={calendarDate} onChange={setCalendarDate} />
						<p className='kit-caption'>extendMonthCount=1</p>
						<Calendar
							value={calendarDate}
							onChange={setCalendarDate}
							extendMonthCount={1}
						/>
					</div>
				</DemoSection>

				<DemoSection title='Card'>
					<KitOfferCard />
				</DemoSection>

				<DemoSection title='Checkbox'>
					<div className='kit-stack'>
						<Checkbox
							label='checked'
							checked={isChecked}
							onCheckedChange={setIsChecked}
						/>
						<Checkbox label='unchecked' defaultChecked={false} />
						<Checkbox label='disabled' isDisabled defaultChecked />
						<Checkbox label='small' size='sm' />
						<Checkbox label='radio' variant='radio' defaultChecked />
					</div>
				</DemoSection>

				<DemoSection title='Chip'>
					<div className='kit-stack kit-stack--full'>
						<div>
							<p className='kit-caption'>статичные — без hover и клика</p>
							<div className='kit-row'>
								<Chip>default</Chip>
								<Chip variant='secondary'>secondary</Chip>
								<Chip variant='accent'>accent</Chip>
								<Chip variant='outline'>outline</Chip>
								<Chip variant='warning'>warning</Chip>
								<Chip variant='danger'>danger</Chip>
								<Chip variant='soft-danger'>soft-danger</Chip>
							</div>
						</div>
						<div>
							<p className='kit-caption'>clickable — реагируют на hover</p>
							<div className='kit-row'>
								<Chip clickable>default</Chip>
								<Chip variant='secondary' clickable>
									secondary
								</Chip>
								<Chip variant='warning' clickable>
									warning
								</Chip>
								<Chip variant='danger' clickable>
									danger
								</Chip>
								<Chip variant='soft-danger' clickable>
									soft-danger
								</Chip>
							</div>
						</div>
					</div>
				</DemoSection>

				<DemoSection title='DatePicker'>
					<div className='kit-stack kit-stack--full'>
						<p className='kit-caption'>default</p>
						<DatePicker
							label='Дата'
							value={date}
							onChange={setDate}
						/>
						<p className='kit-caption'>light</p>
						<DatePicker
							label='Дата'
							value={date}
							onChange={setDate}
							variant='light'
						/>
						<p className='kit-caption'>extendMonthCount=1</p>
						<DatePicker
							label='Дата'
							value={date}
							onChange={setDate}
							extendMonthCount={1}
						/>
					</div>
				</DemoSection>

				<DemoSection title='RangeDatePicker'>
					<div className='kit-stack kit-stack--full'>
						<p className='kit-caption'>default</p>
						<RangeDatePicker
							label='Период'
							value={dateRange}
							onChange={setDateRange}
						/>
						<p className='kit-caption'>light</p>
						<RangeDatePicker
							label='Период'
							value={dateRange}
							onChange={setDateRange}
							variant='light'
						/>
						<p className='kit-caption'>extendMonthCount=1</p>
						<RangeDatePicker
							label='Период'
							value={dateRange}
							onChange={setDateRange}
							extendMonthCount={1}
						/>
					</div>
				</DemoSection>

				<DemoSection title='DropdownMenu + ContextMenu'>
					<KitMenuPreview />
				</DemoSection>

				<DemoSection title='Input'>
					<Input placeholder='Обычный input' size='sm' />
				</DemoSection>

				<DemoSection title='InputGroup'>
					<div className='kit-stack kit-stack--full'>
						<InputGroup size='sm'>
							<InputGroup.Input placeholder='С суффиксом' />
							<InputGroup.Suffix>
								<Spinner size='sm' />
							</InputGroup.Suffix>
						</InputGroup>
						<InputGroup size='sm'>
							<InputGroup.Input
								type='password'
								placeholder='Пароль'
								defaultValue='secret'
							/>
							<InputGroup.Suffix>
								<InputGroup.PasswordToggle
									showPasswordLabel='Показать пароль'
									hidePasswordLabel='Скрыть пароль'
								/>
							</InputGroup.Suffix>
						</InputGroup>
					</div>
				</DemoSection>

				<DemoSection title='Label + Textarea + Separator'>
					<div className='kit-stack kit-stack--full'>
						<div className='kit-stack kit-stack--compact'>
							<Label htmlFor='notes'>Комментарий для гостя</Label>
							<Textarea
								id='notes'
								placeholder='Поздний заезд, подготовить детскую кровать...'
								size='sm'
							/>
						</div>
						<Separator />
						<div className='kit-row'>
							<span>Период</span>
							<Separator orientation='vertical' style={{ height: 16 }} />
							<span>2 ночи</span>
							<Separator orientation='vertical' style={{ height: 16 }} />
							<span>С завтраком</span>
						</div>
					</div>
				</DemoSection>

				<DemoSection title='Modal'>
					<KitModalPreview />
				</DemoSection>

				<DemoSection title='PhotoGallery'>
					<PhotoGallery.Grid
						images={GALLERY_IMAGES}
						onSelect={(index) => {
							setGalleryIndex(index)
							setGalleryOpen(true)
						}}
					/>
					<PhotoGallery
						images={GALLERY_IMAGES}
						open={galleryOpen}
						initialIndex={galleryIndex}
						onOpenChange={setGalleryOpen}
					/>
				</DemoSection>

				<DemoSection title='Popover'>
					<KitPopoverPreview />
				</DemoSection>

				<DemoSection title='Select'>
					<div className='kit-stack kit-stack--full'>
						<p className='kit-caption'>default</p>
						<Select
							label='Город'
							options={CITY_OPTIONS}
							value={city}
							onChange={setCity}
						/>
						<p className='kit-caption'>light</p>
						<Select
							label='Категория'
							options={CITY_OPTIONS}
							value={cityLight}
							onChange={setCityLight}
							variant='light'
						/>
						<p className='kit-caption'>Select.Value — кастомный триггер</p>
						<Select
							label='Объект'
							options={HOTEL_SELECT_OPTIONS}
							value={hotelId}
							onChange={setHotelId}
						>
							<Select.Trigger>
								<Select.Value>
									{({ defaultChildren, isPlaceholder, state }) => {
										if (isPlaceholder) {
											return defaultChildren
										}

										const hotel = findHotelSelectItem(
											state.selectedItems[0]?.value,
										)

										if (!hotel) {
											return defaultChildren
										}

										return <HotelSelectValueContent hotel={hotel} />
									}}
								</Select.Value>
								<Select.Indicator />
							</Select.Trigger>
							<Select.Dropdown />
						</Select>
						<p className='kit-caption'>Select.Value + кастомные Option</p>
						<Select
							label='Объект с опциями'
							options={HOTEL_SELECT_OPTIONS}
							value={hotelRichId}
							onChange={setHotelRichId}
						>
							<Select.Trigger>
								<Select.Value>
									{({ defaultChildren, isPlaceholder, state }) => {
										if (isPlaceholder) {
											return defaultChildren
										}

										const hotel = findHotelSelectItem(
											state.selectedItems[0]?.value,
										)

										if (!hotel) {
											return defaultChildren
										}

										return <HotelSelectValueContent hotel={hotel} />
									}}
								</Select.Value>
								<Select.Indicator />
							</Select.Trigger>
							<Select.Dropdown>
								{HOTEL_SELECT_ITEMS.map((hotel) => (
									<Select.Option
										key={hotel.value}
										option={{ label: hotel.name, value: hotel.value }}
									>
										{({ option }) => {
											const item = findHotelSelectItem(option.value)

											return item ? (
												<HotelSelectOptionContent hotel={item} />
											) : (
												option.label
											)
										}}
									</Select.Option>
								))}
							</Select.Dropdown>
						</Select>
					</div>
				</DemoSection>

				<DemoSection title='Skeleton'>
					<KitOfferSkeleton />
				</DemoSection>

				<DemoSection title='Slider'>
					<div className='kit-stack kit-stack--full'>
						<Slider
							label='Комиссия с продвижением'
							minLabel='Базовая комиссия — 13%'
							maxLabel='Максимум — 20%'
							min={13}
							max={20}
							value={commission}
							onValueChange={(next) => {
								if (typeof next === 'number') {
									setCommission(next)
								}
							}}
							formatValue={(value) => `${value}%`}
						/>
						<Slider
							label='Громкость'
							variant='plain'
							size='sm'
							value={volume}
							onValueChange={(next) => {
								if (typeof next === 'number') {
									setVolume(next)
								}
							}}
							formatValue={(value) => `${value}%`}
						/>
						<Slider
							label='Диапазон цены'
							minLabel='от'
							maxLabel='до'
							value={priceRange}
							onValueChange={(next) => {
								if (Array.isArray(next)) {
									setPriceRange(next)
								}
							}}
							formatValue={(value) => `${value} ₽`}
						/>
						<Slider
							label='Недоступно'
							isDisabled
							defaultValue={30}
							ariaLabel='Недоступный слайдер'
						/>
					</div>
				</DemoSection>

				<DemoSection title='Spinner'>
					<div className='kit-spec-list'>
						<div className='kit-spec'>
							<p className='kit-spec__label'>size</p>
							<div className='kit-spec__grid'>
								{(
									['sm', 'md', 'lg'] as const
								).map((size) => (
									<div key={size} className='kit-swatch'>
										<Spinner size={size} />
										<span className='kit-swatch__name'>{size}</span>
									</div>
								))}
							</div>
						</div>
						<div className='kit-spec'>
							<p className='kit-spec__label'>variant</p>
							<div className='kit-spec__grid'>
								{(
									['default', 'secondary', 'danger', 'soft-danger'] as const
								).map((variant) => (
									<div key={variant} className='kit-swatch'>
										<Spinner variant={variant} />
										<span className='kit-swatch__name'>{variant}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</DemoSection>

				<DemoSection title='Switch'>
					<div className='kit-stack kit-stack--full'>
						<Switch
							isChecked={isSwitchOn}
							onCheckedChange={setIsSwitchOn}
							ariaLabel='Только переключатель'
						/>
						<Switch
							label='Завтрак включён'
							isChecked={isBreakfastOn}
							onCheckedChange={setIsBreakfastOn}
						/>
						<Switch
							label='Уведомления'
							labelPosition='start'
							isChecked={isNotifyOn}
							onCheckedChange={setIsNotifyOn}
						/>
						<Switch
							label='Недоступно'
							isChecked={false}
							onCheckedChange={() => undefined}
							isDisabled
						/>
						<Switch.Field>
							<Switch.Root
								isChecked={isMarketingOn}
								onCheckedChange={setIsMarketingOn}
							>
								<Switch.Thumb />
							</Switch.Root>
							<Switch.Label>
								Email-рассылка
								<Switch.Description>
									Новости и спецпредложения раз в неделю
								</Switch.Description>
							</Switch.Label>
						</Switch.Field>
					</div>
				</DemoSection>

				<DemoSection title='SwiperCarousel'>
					<SwiperCarousel slidesPerView={1} spaceBetween={8} grabCursor>
						{CATALOG_SLIDES.map((slide) => (
							<KitSlide key={slide.src} src={slide.src} title={slide.title} />
						))}
					</SwiperCarousel>
				</DemoSection>

				<DemoSection title='Table'>
					<Table>
						<Table.ScrollContainer>
							<Table.Element>
								<Table.Head>
									<Table.HeaderRow>
										<Table.HeaderCell>
											<Table.HeaderCellContent sortable sortDirection='asc'>
												Город
											</Table.HeaderCellContent>
										</Table.HeaderCell>
										<Table.HeaderCell>Код</Table.HeaderCell>
									</Table.HeaderRow>
								</Table.Head>
								<Table.Body>
									<Table.Row>
										<Table.Cell>Москва</Table.Cell>
										<Table.Cell>MSK</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>Казань</Table.Cell>
										<Table.Cell>KZN</Table.Cell>
									</Table.Row>
								</Table.Body>
							</Table.Element>
						</Table.ScrollContainer>
					</Table>
				</DemoSection>

				<DemoSection title='Tabs'>
					<div className='kit-stack kit-stack--full'>
						<Tabs value={tab} onChange={setTab} items={TAB_ITEMS}>
							<Tabs.Panel value='hotels'>Три отеля на эти даты</Tabs.Panel>
							<Tabs.Panel value='flights'>Прямых рейсов нет</Tabs.Panel>
						</Tabs>
						<Tabs
							value={solidTab}
							onChange={setSolidTab}
							items={TAB_ITEMS}
							variant='solid'
						/>
						<Tabs
							value={lightTab}
							onChange={setLightTab}
							items={TAB_ITEMS}
							variant='light'
						/>
					</div>
				</DemoSection>

				<DemoSection title='TextField'>
					<TextField
						required
						invalid
						errorMessage='Обязательное поле'
						name='email'
					>
						<TextField.Label>Email</TextField.Label>
						<TextField.Input placeholder='you@example.com' size='sm' />
						<TextField.Error />
					</TextField>
				</DemoSection>

				<DemoSection title='TimePicker + DateTimePicker'>
					<div className='kit-stack kit-stack--full'>
						<TimePicker
							label='Время заезда'
							value={timeValue}
							onChange={setTimeValue}
						/>
						<DateTimePicker
							value={dateTimeValue}
							onChange={setDateTimeValue}
						/>
					</div>
				</DemoSection>

				<DemoSection title='Tooltip + Toaster'>
					<div className='kit-row'>
						<Tooltip>
							<Tooltip.Trigger render={<Button variant='ghost' size='sm' />}>
								Почему цена изменилась?
							</Tooltip.Trigger>
							<Tooltip.Content>
								Цена обновляется после пересчёта доступности номера.
							</Tooltip.Content>
						</Tooltip>
						<Button
							size='sm'
							variant='outline'
							onClick={() =>
								toast.success('Бронь сохранена как черновик', {
									toasterId: uiKit,
								})
							}
						>
							Показать success toast
						</Button>
						<Button
							size='sm'
							variant='outline'
							onClick={() =>
								toast.error('Не удалось отправить ваучер', {
									toasterId: uiKit,
								})
							}
						>
							Показать error toast
						</Button>
					</div>
				</DemoSection>
			</div>
		</article>
	)
}
