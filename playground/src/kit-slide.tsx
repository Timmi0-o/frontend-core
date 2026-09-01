import type { ReactElement } from 'react'

export interface IKitSlideProps {
	src: string
	title: string
}

/**
 * Слайд с фото и подписью для демо карусели в playground.
 * Нужен вместо цветной заглушки, чтобы карусель выглядела как галерея отеля/направления.
 */
export const KitSlide = ({ src, title }: IKitSlideProps): ReactElement => {
	return (
		<figure className='kit-slide'>
			<img src={src} alt={title} />
			<figcaption>{title}</figcaption>
		</figure>
	)
}
