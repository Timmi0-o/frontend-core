import type { IAutocompleteOption } from '../types/i-autocomplete-props'

/**
 * Фильтрует опции автокомплита по подстроке в label (без учёта регистра).
 * Вызывать при каждом изменении ввода, чтобы сузить список в дропдауне.
 */
export const filterAutocompleteOptions = <T extends string | number>(
	options: Array<IAutocompleteOption<T>>,
	inputValue: string,
): Array<IAutocompleteOption<T>> => {
	const normalizedQuery = inputValue.trim().toLowerCase()

	if (!normalizedQuery) {
		return options
	}

	return options.filter((option) =>
		option.label.toLowerCase().includes(normalizedQuery),
	)
}
