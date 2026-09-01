/**
 * `JSON.parse` reviver: поднимает Set/Map/Date из мета-объектов,
 * которые записал `replaceLocalStorageValue`.
 */
export const reviveLocalStorageValue = (
	_key: string,
	value: unknown,
): unknown => {
	if (value === null || typeof value !== 'object') {
		return value
	}

	const meta = value as { __type?: string; _values?: unknown; _value?: string }

	if (meta.__type === 'Set' && Array.isArray(meta._values)) {
		return new Set(meta._values)
	}

	if (meta.__type === 'Map' && Array.isArray(meta._values)) {
		return new Map(meta._values as [unknown, unknown][])
	}

	if (meta.__type === 'Date' && typeof meta._value === 'string') {
		return new Date(meta._value)
	}

	return value
}
