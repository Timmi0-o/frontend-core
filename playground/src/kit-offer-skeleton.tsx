import { Card, Skeleton } from '../../src/ui'
import type { ReactElement } from 'react'

/**
 * Скелетон карточки отеля: те же блоки, что у KitOfferCard, пока данные грузятся.
 * Нужен каталогу, чтобы Skeleton был виден как композиция, а не одна полоска.
 */
export const KitOfferSkeleton = (): ReactElement => {
	return (
		<Card aria-busy='true' aria-label='Загрузка карточки'>
			<Card.Header>
				<Skeleton className='kit-skeleton__title' />
				<Skeleton className='kit-skeleton__line' />
			</Card.Header>
			<Card.Content className='kit-offer'>
				<Skeleton className='kit-skeleton__cover' />
				<div className='kit-skeleton__chips'>
					<Skeleton className='kit-skeleton__chip' />
					<Skeleton className='kit-skeleton__chip' />
					<Skeleton className='kit-skeleton__chip kit-skeleton__chip--wide' />
				</div>
				<dl className='kit-offer__facts'>
					<div className='kit-skeleton__stack'>
						<Skeleton className='kit-skeleton__caption' />
						<Skeleton className='kit-skeleton__line kit-skeleton__line--short' />
					</div>
					<div className='kit-skeleton__stack'>
						<Skeleton className='kit-skeleton__caption' />
						<Skeleton className='kit-skeleton__line kit-skeleton__line--short' />
					</div>
				</dl>
			</Card.Content>
			<Card.Footer className='kit-offer__footer'>
				<div className='kit-offer__price kit-skeleton__stack'>
					<Skeleton className='kit-skeleton__price' />
					<Skeleton className='kit-skeleton__caption' />
				</div>
				<Skeleton className='kit-skeleton__button' />
			</Card.Footer>
		</Card>
	)
}
