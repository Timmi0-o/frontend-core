'use client'

export interface IPhotoGalleryImage {
	src: string
	alt?: string
	fileName?: string | null
}

/**
 * Скачивает текущий кадр галереи: fetch → blob → `<a download>`,
 * а при CORS/сети открывает оригинал в новой вкладке.
 *
 * Нужен кнопке «Скачать» в PhotoGallery.
 */
export const downloadGalleryImage = async (
	src: string,
	fileName?: string | null,
): Promise<void> => {
	const fallbackName = fileName?.trim() || 'photo.jpg'

	try {
		const response = await fetch(src)

		if (!response.ok) {
			throw new Error(`Download failed: ${response.status}`)
		}

		const blob = await response.blob()
		const objectUrl = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = objectUrl
		link.download = fallbackName
		link.rel = 'noopener'
		document.body.append(link)
		link.click()
		link.remove()
		URL.revokeObjectURL(objectUrl)
	} catch {
		window.open(src, '_blank', 'noopener,noreferrer')
	}
}
