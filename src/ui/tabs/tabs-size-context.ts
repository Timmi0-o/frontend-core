'use client'

import { createContext, useContext } from 'react'

export type TTabsSize = 'sm' | 'md' | 'lg' | 'xl'

const TabsSizeContext = createContext<TTabsSize>('md')

export const TabsSizeProvider = TabsSizeContext.Provider

export const useTabsSize = (): TTabsSize => {
	return useContext(TabsSizeContext)
}
