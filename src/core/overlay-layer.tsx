'use client'

import {
	createContext,
	useContext,
	useId,
	useLayoutEffect,
	useMemo,
	useState,
	useSyncExternalStore,
	type CSSProperties,
	type ReactElement,
	type ReactNode,
} from 'react'

export const OVERLAY_Z_BASE = 1100
export const OVERLAY_Z_STEP = 200
export const OVERLAY_FLOATING_OFFSET = 105
export const OVERLAY_BACKDROP_BLUR = '6px'

export interface IOverlayLayer {
	overlayZ: number
	floatingZ: number
}

const OverlayLayerContext = createContext<IOverlayLayer>({
	overlayZ: OVERLAY_Z_BASE,
	floatingZ: OVERLAY_Z_BASE + OVERLAY_FLOATING_OFFSET,
})

export const useOverlayLayer = (): IOverlayLayer =>
	useContext(OverlayLayerContext)

const OpenOverlayZContext = createContext<number | null>(null)

type TOverlayStackListener = () => void

const overlayStackIds: string[] = []
const overlayStackListeners = new Set<TOverlayStackListener>()

const emitOverlayStack = (): void => {
	for (const listener of overlayStackListeners) {
		listener()
	}
}

const subscribeOverlayStack = (listener: TOverlayStackListener): (() => void) => {
	overlayStackListeners.add(listener)

	return () => {
		overlayStackListeners.delete(listener)
	}
}

const getOverlayStackIndex = (id: string): number => {
	const index = overlayStackIds.indexOf(id)

	return index === -1 ? 0 : index
}

const ensureOverlayStackId = (id: string): void => {
	if (overlayStackIds.includes(id)) {
		return
	}

	overlayStackIds.push(id)
}

const releaseOverlayStackId = (id: string): void => {
	const index = overlayStackIds.indexOf(id)

	if (index === -1) {
		return
	}

	overlayStackIds.splice(index, 1)
}

const overlayZFromStackIndex = (index: number): number =>
	OVERLAY_Z_BASE + index * OVERLAY_Z_STEP

/**
 * z открытого оверлея. Стек глобальный: соседний confirm-портал
 * тоже выше предыдущей модалки, не только Dialog, вложенный в React-дереве.
 */
export const useOpenOverlayZ = (isOpen: boolean): number => {
	const { overlayZ: inheritedOverlayZ } = useOverlayLayer()
	const id = useId()

	if (isOpen && typeof window !== 'undefined') {
		ensureOverlayStackId(id)
	}

	const stackIndex = useSyncExternalStore(
		subscribeOverlayStack,
		() => getOverlayStackIndex(id),
		() => 0,
	)

	useLayoutEffect(() => {
		if (isOpen) {
			ensureOverlayStackId(id)
			emitOverlayStack()
		} else {
			releaseOverlayStackId(id)
			emitOverlayStack()
		}

		return () => {
			releaseOverlayStackId(id)
			emitOverlayStack()
		}
	}, [id, isOpen])

	if (!isOpen) {
		return inheritedOverlayZ
	}

	return Math.max(inheritedOverlayZ, overlayZFromStackIndex(stackIndex))
}

/**
 * Общий z для частей одного оверлея (overlay + content у Drawer/Sheet).
 * Регистрирует слой один раз, чтобы backdrop и панель не занимали два слота.
 */
export const OpenOverlayZProvider = ({
	isOpen,
	children,
}: {
	isOpen: boolean
	children: ReactNode
}): ReactElement => {
	const overlayZ = useOpenOverlayZ(isOpen)

	return (
		<OpenOverlayZContext.Provider value={overlayZ}>
			{children}
		</OpenOverlayZContext.Provider>
	)
}

/** z текущего оверлея: из OpenOverlayZProvider или из inherited-слоя. */
export const useActiveOverlayZ = (): number => {
	const scopedOverlayZ = useContext(OpenOverlayZContext)
	const { overlayZ } = useOverlayLayer()

	return scopedOverlayZ ?? overlayZ
}

/**
 * Контейнер для Modal/BottomSheet portal.
 * Вешаем на `documentElement`, а не на `body`: при scroll-lock на body
 * `overflow: hidden` ломает `backdrop-filter` у оверлеев внутри body.
 */
export const getOverlayPortalContainer = (): HTMLElement | null => {
	if (typeof document === 'undefined') {
		return null
	}

	return document.documentElement
}

/** Контейнер портала после mount — без hydration mismatch и без SSR-crash. */
export const useOverlayPortalContainer = (): HTMLElement | null => {
	const [container, setContainer] = useState<HTMLElement | null>(null)

	useLayoutEffect(() => {
		setContainer(document.documentElement)
	}, [])

	return container
}

/**
 * CSS-переменная слоя для overlay и popup модалки.
 * Нужна, чтобы вложенный Dialog/Sheet был выше родителя, а не делил z-index 1100.
 */
export const overlayLayerStyle = (overlayZ: number): CSSProperties =>
	({
		'--tg-overlay-z': overlayZ,
	}) as CSSProperties

/**
 * Blur оверлея через inline-style: Lightning CSS в Next/Tailwind вырезает
 * стандартный `backdrop-filter` из глобальных CSS-файлов.
 */
export const overlayBackdropStyle = (): CSSProperties =>
	({
		backdropFilter: `blur(${OVERLAY_BACKDROP_BLUR})`,
		WebkitBackdropFilter: `blur(${OVERLAY_BACKDROP_BLUR})`,
	}) as CSSProperties

/**
 * z-index портала Select/Popover/меню.
 * Нужен, чтобы список был выше текущей модалки и ниже следующей.
 */
export const floatingLayerStyle = (floatingZ: number): CSSProperties => ({
	zIndex: floatingZ,
	pointerEvents: 'auto',
})

/**
 * Сдвигает слой для вложенных Modal/BottomSheet.
 * Плавающие слои внутри текущего оверлея читают floatingZ.
 */
export const OverlayLayerProvider = ({
	overlayZ,
	children,
}: {
	overlayZ: number
	children: ReactNode
}): ReactElement => {
	const value = useMemo<IOverlayLayer>(
		() => ({
			overlayZ: overlayZ + OVERLAY_Z_STEP,
			floatingZ: overlayZ + OVERLAY_FLOATING_OFFSET,
		}),
		[overlayZ],
	)

	return (
		<OverlayLayerContext.Provider value={value}>
			{children}
		</OverlayLayerContext.Provider>
	)
}
