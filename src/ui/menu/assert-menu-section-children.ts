import {
	Children,
	isValidElement,
	type ElementType,
	type ReactNode,
} from 'react'

const getTypeLabel = (type: ElementType): string => {
	if (typeof type === 'string') {
		return type
	}

	if ('displayName' in type && typeof type.displayName === 'string') {
		return type.displayName
	}

	if ('name' in type && typeof type.name === 'string' && type.name !== '') {
		return type.name
	}

	return 'Unknown'
}

export const assertMenuSectionChildren = (
	children: ReactNode,
	allowedTypes: readonly ElementType[],
	sectionName: string,
): void => {
	if (process.env.NODE_ENV === 'production') {
		return
	}

	const allowed = new Set<ElementType>(allowedTypes)
	const allowedLabels = allowedTypes.map(getTypeLabel).join(', ')

	Children.forEach(children, (child) => {
		if (child == null || typeof child === 'boolean') {
			return
		}

		if (!isValidElement(child) || !allowed.has(child.type as ElementType)) {
			const received = isValidElement(child)
				? getTypeLabel(child.type as ElementType)
				: typeof child

			throw new Error(
				`${sectionName} accepts only ${allowedLabels}. Received: ${received}.`,
			)
		}
	})
}
