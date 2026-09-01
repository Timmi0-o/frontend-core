export const CHECKBOX_TEXT_COLOR = {
	primary: 'primary',
	secondary: 'secondary',
} as const

export type CheckboxTextColor =
	(typeof CHECKBOX_TEXT_COLOR)[keyof typeof CHECKBOX_TEXT_COLOR]
