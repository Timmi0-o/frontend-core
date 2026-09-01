/**
 * Клик по полю автокомплита для Popover — outside-press: якорь не Trigger.
 * Нужен dismiss, чтобы не закрыть список тем же кликом, которым его открыли.
 */
export const isAutocompleteFieldPress = (event: Event | undefined): boolean => {
	const target = event?.target

	return (
		target instanceof Element &&
		target.closest('[data-slot="autocomplete"]') !== null
	)
}
