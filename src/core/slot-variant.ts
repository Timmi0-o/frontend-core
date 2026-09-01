/**
 * Вариант слота без собственной палитры кита.
 * `default` можно не передавать — стили кита остаются, className перекрывает
 * отдельные свойства (кит в `@layer components`, ниже утилит и CSS-модулей).
 * `unstyled` полностью снимает chrome этого слота, когда нужно сбросить
 * leftover вроде min-width/overflow, а не точечно перекрыть.
 */
export type TSlotVariant = 'default' | 'unstyled'

/**
 * Добавляет `unstyled` к уже существующему union вариантов.
 */
export type WithUnstyledVariant<T extends string> = T | 'unstyled'

/**
 * Ставит `data-variant` на DOM-слот. CSS кита не применяется при `unstyled`.
 */
export const slotVariantAttr = (
	variant: string | undefined = 'default',
): { 'data-variant': string } => {
	return { 'data-variant': variant }
}

/**
 * Variant дочернего слота: свой проп важнее, `unstyled` с родителя не наследуется.
 * Иначе `<Select variant="unstyled">` отключил бы trigger/dropdown целиком.
 */
export const resolveChildSlotVariant = <T extends string>(
	childVariant: T | 'unstyled' | undefined,
	parentVariant: T | 'unstyled',
	fallback: T,
): T | 'unstyled' => {
	if (childVariant != null) {
		return childVariant
	}

	if (parentVariant === 'unstyled') {
		return fallback
	}

	return parentVariant
}
