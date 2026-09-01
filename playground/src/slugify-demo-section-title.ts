/**
 * Стабильный якорь секции каталога из её заголовка.
 * Нужен data-demo-section и оглавлению, чтобы одна подпись находила блок во всех китах.
 */
export const slugifyDemoSectionTitle = (title: string): string => {
	return title
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}
