/**
 * `JSON.stringify` replacer: кладёт Set/Map/Date в JSON-совместимый вид,
 * чтобы `useLocalStorage` мог их восстановить.
 */
export const replaceLocalStorageValue = (
	_key: string,
	value: unknown,
): unknown => {
	if (value instanceof Set) {
		return { __type: 'Set', _values: Array.from(value) }
	}

	if (value instanceof Map) {
		return { __type: 'Map', _values: Array.from(value.entries()) }
	}

	if (value instanceof Date) {
		return { __type: 'Date', _value: value.toISOString() }
	}

	return value
}
