import type { ITableVariant } from './i-table-variant'

export type TTableVisualVariant = Exclude<ITableVariant, 'unstyled'>

export interface ITableContextValue {
	minWidth?: number
	variant?: TTableVisualVariant
}
