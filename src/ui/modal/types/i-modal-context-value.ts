export interface IModalContextValue {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	setHasVisibleTitle: (isVisible: boolean) => void
}
