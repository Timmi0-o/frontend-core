import { Button, Card, Chip } from '../../src/ui'
import type { ReactElement } from 'react'

/**
 * Наполненная карточка отеля для каталога кита.
 * Показывает Header, Content, Footer вместе с фото, чипами и ценой.
 */
export const KitOfferCard = (): ReactElement => {
	return (
		<Card>
			<Card.Header>
				<Card.Title>River Palace, 4*</Card.Title>
				<Card.Description>
					Казань, центр · 800 м до Кремля
				</Card.Description>
			</Card.Header>
			<Card.Content className='kit-offer'>
				<img
					className='kit-offer__cover'
					src='/slides/stay.jpg'
					alt='River Palace'
				/>
				<div className='kit-row'>
					<Chip variant='accent'>Завтрак</Chip>
					<Chip>2 ночи</Chip>
					<Chip variant='outline'>Отмена 24 ч</Chip>
				</div>
				<dl className='kit-offer__facts'>
					<div>
						<dt>Заезд</dt>
						<dd>29 авг, 14:00</dd>
					</div>
					<div>
						<dt>Выезд</dt>
						<dd>31 авг, 12:00</dd>
					</div>
				</dl>
			</Card.Content>
			<Card.Footer className='kit-offer__footer'>
				<div className='kit-offer__price'>
					<strong>18 400 ₽</strong>
					<span>за номер</span>
				</div>
				<Button size='sm'>Выбрать</Button>
			</Card.Footer>
		</Card>
	)
}
