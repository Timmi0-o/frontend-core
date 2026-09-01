export type ISpinnerSize = 'sm' | 'md' | 'lg'

export type TSpinnerVariant =
	| 'default'
	| 'secondary'
	| 'danger'
	| 'soft-danger'
	| 'unstyled'

export interface ISpinnerProps {
	size?: ISpinnerSize
	variant?: TSpinnerVariant
	className?: string
}
