export interface IPopoverContextValue {
	side: 'top' | 'right' | 'bottom' | 'left'
	align: 'start' | 'center' | 'end'
	sideOffset: number
	anchorElement: HTMLElement | null
	setAnchorElement: (element: HTMLElement | null) => void
	uiKit?: string
	portalContainer: HTMLElement | null
}
