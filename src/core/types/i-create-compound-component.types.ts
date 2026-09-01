import type { ReactElement, ReactNode } from 'react'

export type IComponentWithDisplayName<P> = ((props: P) => ReactElement) & {
	displayName?: string
}

export type ICompoundChildProps = {
	children?: ReactNode
}
