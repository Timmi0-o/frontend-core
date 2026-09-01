'use client'

import { createCompoundContext } from '@/core/create-compound-context'

export interface IBreadcrumbsItemContextValue {
	index: number
}

export const {
	Context: BreadcrumbsItemContext,
	useCompoundContext: useBreadcrumbsItemContext,
} = createCompoundContext<IBreadcrumbsItemContextValue>('Breadcrumbs')
