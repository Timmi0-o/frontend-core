import { getKitPackageName } from './get-kit-package-name'

const KIT_SECTION_EXAMPLES: Record<string, string> = {
	button: `import { Button } from '$KIT'

export const Example = () => {
  return (
    <>
      {/* Варианты */}
      <Button variant="primary">primary</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="tertiary">tertiary</Button>
      <Button variant="outline">outline</Button>
      <Button variant="ghost">ghost</Button>
      <Button variant="light">light</Button>
      <Button variant="danger">danger</Button>

      {/* Размеры */}
      <Button size="xxs">xxs</Button>
      <Button size="xs">xs</Button>
      <Button size="sm">sm</Button>
      <Button size="md">md</Button>
      <Button size="lg">lg</Button>

      {/* Состояния */}
      <Button isPending>pending</Button>
      <Button isDisabled>disabled</Button>
      <Button isIconOnly aria-label="icon">
        •
      </Button>
      <Button fullWidth>full width</Button>
    </>
  )
}
`,

	slider: `import { Slider } from '$KIT'
import { useState } from 'react'

export const Example = () => {
  const [commission, setCommission] = useState(14)
  const [range, setRange] = useState([20, 80])

  return (
    <>
      <Slider
        label="Комиссия с продвижением"
        minLabel="Базовая комиссия — 13%"
        maxLabel="Максимум — 20%"
        min={13}
        max={20}
        value={commission}
        onValueChange={(value) => {
          if (typeof value === 'number') setCommission(value)
        }}
        formatValue={(value) => \`\${value}%\`}
      />
      <Slider
        label="Громкость"
        variant="plain"
        size="sm"
        defaultValue={40}
      />
      <Slider
        label="Диапазон"
        value={range}
        onValueChange={(value) => {
          if (Array.isArray(value)) setRange([...value])
        }}
      />
      <Slider label="Недоступно" isDisabled defaultValue={30} />
    </>
  )
}
`,

	spinner: `import { Spinner } from '$KIT'

export const Example = () => {
  return (
    <>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />

      <Spinner variant="default" />
      <Spinner variant="secondary" />
      <Spinner variant="danger" />
    </>
  )
}
`,

	checkbox: `import { Checkbox } from '$KIT'
import { useState } from 'react'

export const Example = () => {
  const [isChecked, setIsChecked] = useState(true)

  return (
    <>
      <Checkbox
        label="checked"
        checked={isChecked}
        onCheckedChange={setIsChecked}
      />
      <Checkbox label="unchecked" defaultChecked={false} />
      <Checkbox label="disabled" isDisabled defaultChecked />
      <Checkbox label="small" size="sm" />
      {/* Внешне как radio, но API тот же, что у Checkbox */}
      <Checkbox label="radio" variant="radio" defaultChecked />
    </>
  )
}
`,

	'avatar-badge': `import { Avatar, Badge, Button } from '$KIT'

export const Example = () => {
  return (
    <>
      <Avatar>
        <Avatar.Image src="/slides/stay.jpg" alt="Анна Петрова" />
        <Avatar.Fallback>АП</Avatar.Fallback>
        <Avatar.Badge />
      </Avatar>
      <Avatar size="sm">
        <Avatar.Fallback>ТП</Avatar.Fallback>
      </Avatar>
      <Avatar size="lg">
        <Avatar.Image src="/slides/stay-v2.jpg" alt="Михаил Орлов" />
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

      <Badge>new</Badge>
      <Badge variant="success">online</Badge>
      <Badge variant="error">overdue</Badge>
      <Badge variant="outline">outline</Badge>

      {/* Счётчик поверх другого компонента */}
      <Badge content={5} placement="top" variant="error">
        <Avatar>
          <Avatar.Image src="/slides/stay.jpg" alt="Уведомления" />
          <Avatar.Fallback>АП</Avatar.Fallback>
        </Avatar>
      </Badge>
      <Badge content={2} placement="bottom" variant="error">
        <Button variant="outline" size="sm">
          Корзина
        </Button>
      </Badge>
      <Badge placement="bottom" variant="success">
        <Avatar size="lg">
          <Avatar.Fallback>МО</Avatar.Fallback>
        </Avatar>
      </Badge>
    </>
  )
}
`,

	switch: `import { Switch } from '$KIT'
import { useState } from 'react'

export const Example = () => {
  const [isOn, setIsOn] = useState(true)
  const [isMarketingOn, setIsMarketingOn] = useState(true)

  return (
    <>
      <Switch
        isChecked={isOn}
        onCheckedChange={setIsOn}
        ariaLabel="Только переключатель"
      />
      <Switch
        label="Завтрак включён"
        isChecked={isOn}
        onCheckedChange={setIsOn}
      />
      <Switch
        label="Уведомления"
        labelPosition="start"
        isChecked={false}
        onCheckedChange={() => undefined}
      />
      <Switch label="Недоступно" isChecked={false} isDisabled />

      {/* Составной вариант: подпись и описание сбоку */}
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
    </>
  )
}
`,

	input: `import { Input } from '$KIT'

export const Example = () => {
  return <Input placeholder="Обычный input" size="sm" />
}
`,

	inputgroup: `import { InputGroup, Spinner } from '$KIT'

export const Example = () => {
  return (
    <>
      <InputGroup size="sm">
        <InputGroup.Input placeholder="С суффиксом" />
        <InputGroup.Suffix>
          <Spinner size="sm" />
        </InputGroup.Suffix>
      </InputGroup>
      <InputGroup size="sm">
        <InputGroup.Input type="password" placeholder="Пароль" />
        <InputGroup.Suffix>
          <InputGroup.PasswordToggle
            showPasswordLabel="Показать пароль"
            hidePasswordLabel="Скрыть пароль"
          />
        </InputGroup.Suffix>
      </InputGroup>
    </>
  )
}
`,

	textfield: `import { TextField } from '$KIT'

export const Example = () => {
  return (
    <TextField
      required
      invalid
      errorMessage="Обязательное поле"
      name="email"
    >
      <TextField.Label>Email</TextField.Label>
      <TextField.Input placeholder="you@example.com" size="sm" />
      <TextField.Error />
    </TextField>
  )
}
`,

	'label-textarea-separator': `import { Label, Separator, Textarea } from '$KIT'

export const Example = () => {
  return (
    <>
      <Label htmlFor="notes">Комментарий для гостя</Label>
      <Textarea
        id="notes"
        placeholder="Поздний заезд, подготовить детскую кровать..."
        size="sm"
      />
      <Separator />
      <span>Период</span>
      <Separator orientation="vertical" style={{ height: 16 }} />
      <span>2 ночи</span>
    </>
  )
}
`,

	select: `import { Chip, Select, Separator } from '$KIT'
import { useState } from 'react'

const HOTELS = [
  { value: 'sea', name: 'Отель у моря', stars: 3, category: 'Гостиница', status: 'Размещается' },
]

const OPTIONS = HOTELS.map((hotel) => ({ label: hotel.name, value: hotel.value }))

export const Example = () => {
  const [city, setCity] = useState<string | null>('msk')
  const [hotelId, setHotelId] = useState<string | null>('sea')

  return (
    <>
    <Select
      label="Город"
      options={[{ label: 'Москва', value: 'msk' }, { label: 'Казань', value: 'kzn' }]}
      value={city}
      onChange={setCity}
    />
    <Select
      label="Категория"
      options={[{ label: 'Москва', value: 'msk' }, { label: 'Казань', value: 'kzn' }]}
      value={city}
      onChange={setCity}
      variant="light"
    />
    <Select options={OPTIONS} value={hotelId} onChange={setHotelId}>
      <Select.Trigger>
        <Select.Value>
          {({ defaultChildren, isPlaceholder, state }) => {
            if (isPlaceholder) {
              return defaultChildren
            }

            const hotel = HOTELS.find((item) => item.value === state.selectedItems[0]?.value)

            if (!hotel) {
              return defaultChildren
            }

            return (
              <>
                <span>{hotel.name}</span>
                <Separator orientation="vertical" />
                <span>{hotel.category}</span>
                <Chip variant="success">{hotel.status}</Chip>
              </>
            )
          }}
        </Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Dropdown>
        {HOTELS.map((hotel) => (
          <Select.Option key={hotel.value} option={{ label: hotel.name, value: hotel.value }}>
            {hotel.name}
          </Select.Option>
        ))}
      </Select.Dropdown>
    </Select>
    </>
  )
}
`,

	autocomplete: `import { AutoComplete } from '$KIT'
import { useState } from 'react'

const CITY_OPTIONS = [
  { label: 'Москва', value: 'msk' },
  { label: 'Санкт-Петербург', value: 'spb' },
  { label: 'Казань', value: 'kzn' },
]

export const Example = () => {
  const [queryCity, setQueryCity] = useState<string | null>(null)

  return (
    <AutoComplete
      label="Поиск"
      options={CITY_OPTIONS}
      value={queryCity}
      onChange={setQueryCity}
    />
  )
}
`,

	datepicker: `import { DatePicker } from '$KIT'
import { useState } from 'react'

export const Example = () => {
  const [date, setDate] = useState<Date | null>(new Date())

  return (
    <DatePicker
      label="Дата"
      value={date}
      onChange={setDate}
      extendMonthCount={1}
      // minDate / maxDate ограничивают дни; годы в пикере всё равно
      // можно листать в окне «текущий −120 … +10».
    />
  )
}
`,

	rangedatepicker: `import { RangeDatePicker } from '$KIT'
import { useState } from 'react'

export const Example = () => {
  const [range, setRange] = useState({
    start: new Date(),
    end: null as Date | null,
  })

  return (
    <RangeDatePicker
      label="Период"
      value={range}
      onChange={setRange}
      extendMonthCount={1}
    />
  )
}
`,

	calendar: `import { Calendar } from '$KIT'
import { useState } from 'react'

export const Example = () => {
  const [date, setCalendarDate] = useState<Date | null>(new Date())

  return <Calendar value={date} onChange={setCalendarDate} />
}
`,

	'timepicker-datetimepicker': `import { DateTimePicker, TimePicker } from '$KIT'
import { useState } from 'react'

export const Example = () => {
  const [timeValue, setTimeValue] = useState('09:30')
  // Локальная строка YYYY-MM-DDTHH:mm — так DateTimePicker склеивает дату и время.
  const [dateTimeValue, setDateTimeValue] = useState('2026-08-29T09:30')

  return (
    <>
      <TimePicker
        label="Время заезда"
        value={timeValue}
        onChange={setTimeValue}
      />
      <DateTimePicker
        value={dateTimeValue}
        onChange={setDateTimeValue}
      />
    </>
  )
}
`,

	popover: `import { Button, Popover } from '$KIT'

export const Example = () => {
  return (
    <Popover>
      <Popover.Trigger>
        <Button variant="outline">Что входит в номер</Button>
      </Popover.Trigger>
      <Popover.Content>
        <p>River Palace, 4*</p>
        <p>Казань · 2 ночи · завтрак</p>
        <ul>
          <li>Завтрак «шведский стол»</li>
          <li>Трансфер из аэропорта</li>
          <li>Бесплатная отмена за 24 часа</li>
        </ul>
        <p>18 400 ₽</p>
      </Popover.Content>
    </Popover>
  )
}
`,

	modal: `import { Button, Chip, Modal } from '$KIT'
import { useState } from 'react'

export const Example = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Подтвердить бронь
      </Button>
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <Modal.Header>
          <Modal.Title>Подтвердить бронь</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>River Palace, 4*</p>
          <p>Казань · заезд 29 авг, 14:00 · 2 ночи</p>
          <Chip variant="accent">Завтрак</Chip>
          <Chip>2 гостя</Chip>
          <p>К оплате 18 400 ₽</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Позже
          </Button>
          <Button onClick={() => setIsOpen(false)}>Подтвердить</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
`,

	bottomsheet: `import { BottomSheet, Button, Checkbox, Chip, Separator, Switch } from '$KIT'
import { useState } from 'react'

export const Example = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [price, setPrice] = useState('any')
  const [breakfast, setBreakfast] = useState(true)
  const [withPhoto, setWithPhoto] = useState(true)

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Фильтры поиска
      </Button>
      <BottomSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Фильтры поиска"
        height="min(86vh, 760px)"
      >
        <p>Казань · 29–31 авг · 2 взрослых</p>

        <p>Стоимость за ночь</p>
        <Chip
          clickable
          variant={price === 'any' ? 'accent' : 'outline'}
          onClick={() => setPrice('any')}
        >
          Любая
        </Chip>
        <Chip
          clickable
          variant={price === 'mid' ? 'accent' : 'outline'}
          onClick={() => setPrice('mid')}
        >
          10–20 000 ₽
        </Chip>

        <Checkbox
          label="Завтрак включён"
          checked={breakfast}
          onCheckedChange={setBreakfast}
        />
        <Separator />
        {/* В каталоге так же набраны удобства, район и условия брони */}
        <Switch
          label="Только с фото номеров"
          isChecked={withPhoto}
          onCheckedChange={setWithPhoto}
        />
        <Button onClick={() => setIsOpen(false)}>Показать номера</Button>
      </BottomSheet>
    </>
  )
}
`,

	'dropdownmenu-contextmenu': `import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  DropdownMenu,
} from '$KIT'
import { useState } from 'react'

export const Example = () => {
  const [isPinned, setIsPinned] = useState(true)

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger render={<Button variant="outline" size="sm" />}>
          Настройки
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Section label="Бронь #10482">
            <DropdownMenu.Item>Открыть карточку</DropdownMenu.Item>
            <DropdownMenu.Item>Поделиться</DropdownMenu.Item>
            <DropdownMenu.CheckboxItem
              checked={isPinned}
              onCheckedChange={setIsPinned}
            >
              В избранном
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Section>
          <DropdownMenu.Section label="Опасная зона">
            <DropdownMenu.Item variant="destructive">
              Отменить бронь
            </DropdownMenu.Item>
          </DropdownMenu.Section>
        </DropdownMenu.Content>
      </DropdownMenu>

      {/* ПКМ по триггеру */}
      <ContextMenu>
        <ContextMenuTrigger render={<button type="button" />}>
          River Palace · бронь #10482
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Копировать номер</ContextMenuItem>
          <ContextMenuItem>Скопировать ссылку</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">Удалить</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}
`,

	table: `import { Table } from '$KIT'

export const Example = () => {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Element>
          <Table.Head>
            <Table.HeaderRow>
              <Table.HeaderCell>
                <Table.HeaderCellContent sortable sortDirection="asc">
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
  )
}
`,

	card: `import { Button, Card, Chip } from '$KIT'

export const Example = () => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>River Palace, 4*</Card.Title>
        <Card.Description>Казань, центр · 800 м до Кремля</Card.Description>
      </Card.Header>
      <Card.Content>
        <img src="/slides/stay.jpg" alt="River Palace" />
        <Chip variant="accent">Завтрак</Chip>
        <Chip>2 ночи</Chip>
        <Chip variant="outline">Отмена 24 ч</Chip>
      </Card.Content>
      <Card.Footer>
        <strong>18 400 ₽</strong>
        <Button size="sm">Выбрать</Button>
      </Card.Footer>
    </Card>
  )
}
`,

	chip: `import { Chip } from '$KIT'

export const Example = () => {
  return (
    <>
      {/* Без hover и клика — только метка */}
      <Chip>default</Chip>
      <Chip variant="accent">accent</Chip>
      <Chip variant="outline">outline</Chip>

      {/* clickable включает hover и role="button" */}
      <Chip clickable>default</Chip>
      <Chip variant="accent" clickable>
        accent
      </Chip>
      <Chip variant="outline" clickable>
        outline
      </Chip>
    </>
  )
}
`,

	tabs: `import { Tabs } from '$KIT'
import { useState } from 'react'

const TAB_ITEMS = [
  { label: 'Отели', value: 'hotels' },
  { label: 'Перелёты', value: 'flights' },
  { label: 'Отзывы', value: 'reviews', isDisabled: true },
]

export const Example = () => {
  const [tab, setTab] = useState('hotels')

  return (
    <>
      <Tabs value={tab} onChange={setTab} items={TAB_ITEMS}>
        <Tabs.Panel value="hotels">Три отеля на эти даты</Tabs.Panel>
        <Tabs.Panel value="flights">Прямых рейсов нет</Tabs.Panel>
      </Tabs>
      <Tabs value={tab} onChange={setTab} items={TAB_ITEMS} variant="solid" />
      <Tabs value={tab} onChange={setTab} items={TAB_ITEMS} variant="light" />
    </>
  )
}
`,

	skeleton: `import { Card, Skeleton } from '$KIT'

export const Example = () => {
  return (
    <Card aria-busy="true" aria-label="Загрузка карточки">
      <Card.Header>
        <Skeleton />
        <Skeleton />
      </Card.Header>
      <Card.Content>
        {/* Те же блоки, что у живой карточки, пока данные грузятся */}
        <Skeleton />
      </Card.Content>
      <Card.Footer>
        <Skeleton />
      </Card.Footer>
    </Card>
  )
}
`,

	alertbanner: `import { AlertBanner } from '$KIT'

export const Example = () => {
  return (
    <>
      <AlertBanner variant="default">
        <AlertBanner.Description>
          Информация: тариф можно изменить до заезда без доплаты.
        </AlertBanner.Description>
      </AlertBanner>
      <AlertBanner variant="warning">
        <AlertBanner.Description>
          Свободных номеров мало: подтвердите бронь в течение 15 минут.
        </AlertBanner.Description>
      </AlertBanner>
      <AlertBanner variant="danger">
        <AlertBanner.Description>
          Не удалось подтвердить бронь: платёж не прошёл.
        </AlertBanner.Description>
      </AlertBanner>
      <AlertBanner variant="success">
        <AlertBanner.Description>
          Бронь подтверждена. Ваучер отправлен на почту гостя.
        </AlertBanner.Description>
      </AlertBanner>
      <AlertBanner variant="soft-danger">
        <AlertBanner.Description>
          Часть услуг недоступна. Можно продолжить без трансфера.
        </AlertBanner.Description>
      </AlertBanner>
    </>
  )
}
`,

	'tooltip-toaster': `import { Button, Toaster, Tooltip } from '$KIT'
import { toast } from 'sonner'

export const Example = () => {
  return (
    <>
      {/* Один Toaster на корень приложения; toasterId связывает toast с ним */}
      <Toaster id="app" />

      <Tooltip>
        <Tooltip.Trigger render={<Button variant="ghost" size="sm" />}>
          Почему цена изменилась?
        </Tooltip.Trigger>
        <Tooltip.Content>
          Цена обновляется после пересчёта доступности номера.
        </Tooltip.Content>
      </Tooltip>

      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toast.success('Бронь сохранена как черновик', {
            toasterId: 'app',
          })
        }
      >
        Показать success toast
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toast.error('Не удалось отправить ваучер', {
            toasterId: 'app',
          })
        }
      >
        Показать error toast
      </Button>
    </>
  )
}
`,

	breadcrumbs: `import { Breadcrumbs } from '$KIT'

export const Example = () => {
  return (
    <>
      <Breadcrumbs variant="default">
        <Breadcrumbs.Home href="#home" />
        <Breadcrumbs.Item href="#catalog">Каталог</Breadcrumbs.Item>
        <Breadcrumbs.Item>Текущая</Breadcrumbs.Item>
      </Breadcrumbs>
      <Breadcrumbs variant="solid">
        <Breadcrumbs.Home href="#home" />
        <Breadcrumbs.Item href="#catalog">Каталог</Breadcrumbs.Item>
        <Breadcrumbs.Item>Текущая</Breadcrumbs.Item>
      </Breadcrumbs>
      <Breadcrumbs variant="light">
        <Breadcrumbs.Home href="#home" />
        <Breadcrumbs.Item href="#catalog">Каталог</Breadcrumbs.Item>
        <Breadcrumbs.Item>Текущая</Breadcrumbs.Item>
      </Breadcrumbs>
    </>
  )
}
`,

	swipercarousel: `import { SwiperCarousel } from '$KIT'

const SLIDES = [
  { src: '/slides/kazan.webp', title: 'Казань' },
  { src: '/slides/istanbul.jpg', title: 'Стамбул' },
  { src: '/slides/phuket.jpg', title: 'Пхукет' },
]

export const Example = () => {
  return (
    <SwiperCarousel slidesPerView={1} spaceBetween={8} grabCursor>
      {SLIDES.map((slide) => (
        <figure key={slide.src}>
          <img src={slide.src} alt={slide.title} />
          <figcaption>{slide.title}</figcaption>
        </figure>
      ))}
    </SwiperCarousel>
  )
}
`,

	accordion: `import { Accordion } from '$KIT'

export const Example = () => {
  return (
    <>
      <Accordion defaultValue={['included']}>
        <Accordion.Item value="included">
          <Accordion.Header>
            <Accordion.Trigger>Что входит в тур</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Перелёт, трансфер, проживание и завтраки. Экскурсии — по желанию.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="cancel">
          <Accordion.Header>
            <Accordion.Trigger>Отмена и возврат</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Бесплатная отмена за 48 часов до заезда.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Accordion multiple>
        <Accordion.Item value="docs">
          <Accordion.Header>
            <Accordion.Trigger>Документы</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Загранпаспорт сроком не менее 6 месяцев на дату вылета.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="kids">
          <Accordion.Header>
            <Accordion.Trigger>С детьми</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            До 2 лет без места.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  )
}
`,

	photogallery: `import { PhotoGallery } from '$KIT'
import { useState } from 'react'

const IMAGES = [
  { src: '/slides/kazan.webp', alt: 'Казань', fileName: 'Казань.jpg' },
  { src: '/slides/istanbul.jpg', alt: 'Стамбул', fileName: 'Стамбул.jpg' },
  { src: '/slides/phuket.jpg', alt: 'Пхукет', fileName: 'Пхукет.jpg' },
]

export const Example = () => {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <>
      <PhotoGallery.Grid
        images={IMAGES}
        onSelect={(nextIndex) => {
          setIndex(nextIndex)
          setOpen(true)
        }}
      />
      <PhotoGallery
        images={IMAGES}
        open={open}
        initialIndex={index}
        onOpenChange={setOpen}
      />
    </>
  )
}
`,

	adaptivedialog: `import { AdaptiveDialog, Button, Chip } from '$KIT'
import { useState } from 'react'

export const Example = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        AdaptiveDialog
      </Button>
      <AdaptiveDialog open={isOpen} onOpenChange={setIsOpen} title="Фильтры">
        <AdaptiveDialog.Content>
          <AdaptiveDialog.Header>
            <AdaptiveDialog.Title>Фильтры</AdaptiveDialog.Title>
          </AdaptiveDialog.Header>
          <AdaptiveDialog.Body>
            <p>На ширине ≤1024px откроется BottomSheet, иначе Modal.</p>
            <Chip variant="accent">Завтрак</Chip>
          </AdaptiveDialog.Body>
          <AdaptiveDialog.Footer>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Позже
            </Button>
            <Button onClick={() => setIsOpen(false)}>Готово</Button>
          </AdaptiveDialog.Footer>
        </AdaptiveDialog.Content>
      </AdaptiveDialog>
    </>
  )
}
`,
}

/**
 * Возвращает пример секции каталога с импортом текущего кита.
 * Если для заголовка нет примера, кнопку кода показывать не нужно.
 */
export const getKitSectionExample = (
	slug: string,
	kitId: string,
): string | null => {
	const template = KIT_SECTION_EXAMPLES[slug]

	if (template == null) {
		return null
	}

	return template.replaceAll('$KIT', getKitPackageName(kitId))
}
