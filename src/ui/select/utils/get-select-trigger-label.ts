import type { ISelectOption } from '../types/i-select-props'

interface IGetSelectTriggerLabelParams<T extends string | number> {
	isMultiselect: boolean
	selectedSingle: ISelectOption<T> | null
	selectedOptionsMulti: Array<ISelectOption<T>>
}

/**
 * Собирает текст триггера: пусто / один label / "Label +N".
 * Вызывать в useSelect при каждом изменении выбранных опций.
 */
export const getSelectTriggerLabel = <T extends string | number>({
	isMultiselect,
	selectedSingle,
	selectedOptionsMulti,
}: IGetSelectTriggerLabelParams<T>): string => {
	if (isMultiselect) {
		if (selectedOptionsMulti.length === 0) {
			return ''
		}

		if (selectedOptionsMulti.length === 1) {
			return selectedOptionsMulti[0]?.label ?? ''
		}

		const firstLabel = selectedOptionsMulti[0]?.label ?? ''
		const restCount = Math.max(0, selectedOptionsMulti.length - 1)

		return restCount > 0 ? `${firstLabel} +${restCount}` : firstLabel
	}

	return selectedSingle?.label ?? ''
}
