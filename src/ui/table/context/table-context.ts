import { createCompoundContext } from '@/core/create-compound-context'
import { TABLE_DISPLAY_NAMES } from '../constants/table.constants'
import type { ITableContextValue } from '../types/i-table-context-value'

const { Context: TableContext, useCompoundContext: useTableContext } =
	createCompoundContext<ITableContextValue>(TABLE_DISPLAY_NAMES.ROOT)

export { TableContext, useTableContext }
