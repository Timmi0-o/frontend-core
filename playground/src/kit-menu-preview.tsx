'use client'

import {
	Button,
	Chip,
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
	DropdownMenu,
} from '../../src/ui'
import { useState, type ReactElement } from 'react'

/**
 * Линейная иконка в стиле iOS для пунктов меню в playground.
 */
const MenuGlyph = ({ path }: { path: string }): ReactElement => {
	return (
		<svg viewBox='0 0 24 24' fill='none' aria-hidden='true'>
			<path
				d={path}
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

export const KitMenuPreview = (): ReactElement => {
	const [isPinned, setIsPinned] = useState(true)

	return (
		<div className='kit-stack kit-stack--full'>
			<div>
				<DropdownMenu>
					<DropdownMenu.Trigger render={<Button variant='outline' size='sm' />}>
						Настройки
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Section label='Бронь #10482'>
							<DropdownMenu.Item>
								Открыть карточку
								<MenuGlyph path='M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' />
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								Поделиться
								<MenuGlyph path='M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M16 8l-4-4-4 4M12 4v12' />
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								Отправить ваучер
								<MenuGlyph path='M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z' />
							</DropdownMenu.Item>
							<DropdownMenu.CheckboxItem
								checked={isPinned}
								onCheckedChange={setIsPinned}
							>
								В избранном
							</DropdownMenu.CheckboxItem>
						</DropdownMenu.Section>
						<DropdownMenu.Section label='Опасная зона'>
							<DropdownMenu.Item variant='destructive'>
								Отменить бронь
								<MenuGlyph path='M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14' />
							</DropdownMenu.Item>
						</DropdownMenu.Section>
					</DropdownMenu.Content>
				</DropdownMenu>
			</div>

			<div>
				<p className='kit-caption'>ContextMenu — ПКМ по карточке брони</p>
				<ContextMenu>
					<ContextMenuTrigger
						render={<button type='button' className='kit-ios-menu-card' />}
					>
						<img
							className='kit-ios-menu-card__cover'
							src='/slides/stay.jpg'
							alt=''
						/>
						<span className='kit-ios-menu-card__body'>
							<strong>River Palace</strong>
							<small>Бронь #10482 · 29–31 авг</small>
							<Chip variant='accent'>Завтрак</Chip>
						</span>
					</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuItem>
							Копировать номер
							<MenuGlyph path='M9 9h11v11H9zM5 15V5h10' />
						</ContextMenuItem>
						<ContextMenuItem>
							Скопировать ссылку
							<MenuGlyph path='M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0 7.5-.5l-2 2a5 5 0 0 0 7 7L12.5 18' />
						</ContextMenuItem>
						<ContextMenuItem>
							Добавить в заметки
							<MenuGlyph path='M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4' />
						</ContextMenuItem>
						<ContextMenuSeparator />
						<ContextMenuItem variant='destructive'>
							Удалить
							<MenuGlyph path='M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14' />
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
			</div>
		</div>
	)
}
