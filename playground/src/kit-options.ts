export const KIT_OPTIONS = [
	{
		id: 'social',
		title: 'Social',
		uiKit: 'social',
		hint: 'публичные клиентские приложения',
	},
	{
		id: 'admin',
		title: 'Admin',
		uiKit: 'admin',
		hint: 'админки (HeroUI-look)',
	},
] as const

export type TKitId = (typeof KIT_OPTIONS)[number]['id']

/**
 * Имя CSS-entry кита без скоупа пакета.
 * Нужно шапке колонки в каталоге, где полный import-path слишком длинный и слипается с title.
 */
export const getKitStyleEntry = (id: TKitId): string => {
	return `${id}-ui-kit`
}

/**
 * Публичный import-path кита для подписей в playground.
 * Нужен списку на главной, чтобы сразу видеть, какой пакет подключать.
 */
export const getKitImportPath = (id: TKitId): string => {
	return `@timmi0-o/frontend-core/${getKitStyleEntry(id)}`
}

export const DEFAULT_KIT_IDS: TKitId[] = ['social']

/**
 * Читает выбранные киты из `?kits=social,admin`.
 * Пустой или битый query → только Social.
 */
export const parseKitIds = (search: string): TKitId[] => {
	const requested = new URLSearchParams(search).get('kits')

	if (requested === null) {
		return [...DEFAULT_KIT_IDS]
	}

	if (requested === '') {
		return []
	}

	const allowed = new Set<string>(KIT_OPTIONS.map((kit) => kit.id))
	const parsed = requested
		.split(',')
		.map((id) => id.trim())
		.filter((id): id is TKitId => allowed.has(id))

	return parsed.length > 0 ? parsed : [...DEFAULT_KIT_IDS]
}

export const serializeKitIds = (ids: TKitId[]): string => {
	const unique = KIT_OPTIONS.map((kit) => kit.id).filter((id) =>
		ids.includes(id),
	)

	return unique.join(',')
}
