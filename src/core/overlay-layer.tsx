'use client'

import {
	createContext,
	useContext,
	useMemo,
	type CSSProperties,
	type ReactElement,
	type ReactNode,
} from 'react'

export const OVERLAY_Z_BASE = 1100
export const OVERLAY_Z_STEP = 200
export const OVERLAY_FLOATING_OFFSET = 105

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

/**
 * CSS-переменная слоя для overlay и popup модалки.
 * Нужна, чтобы вложенный Dialog/Sheet был выше родителя, а не делил z-index 1100.
 */
export const overlayLayerStyle = (overlayZ: number): CSSProperties =>
	({
		'--tg-overlay-z': overlayZ,
	}) as CSSProperties

/**
 * z-index портала Select/Popover/меню.
 * Нужен, чтобы список был выше текущей модалки и ниже следующей.
 */
export const floatingLayerStyle = (floatingZ: number): CSSProperties => ({
	zIndex: floatingZ,
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
