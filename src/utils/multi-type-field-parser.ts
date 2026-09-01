import type {
	IMultiTypeFieldParserConfig,
	TMultiTypeFieldParsedValue,
	TMultiTypeFieldParseType,
} from './types/i-multi-type-field-parser-config'

type TParseAttempt<TValue> =
	| { isOk: true; value: TValue }
	| { isOk: false }

/**
 * Парсит одно поле или пачку полей в заявленный тип, без доменных микропарсеров.
 * Нужен ответам API и query: дата/число/объект приходят строкой, а UI ждёт Date | number.
 *
 * Массив конфигов возвращает массив результатов той же длины.
 */
export function multiTypeFieldParser<
	TParseType extends TMultiTypeFieldParseType,
	TTransformed = TMultiTypeFieldParsedValue[TParseType],
	TFallback = TTransformed | null | undefined,
>(
	configs: ReadonlyArray<
		IMultiTypeFieldParserConfig<TParseType, TTransformed, TFallback>
	>,
): Array<TTransformed | TFallback>
export function multiTypeFieldParser<
	TParseType extends TMultiTypeFieldParseType,
	TTransformed = TMultiTypeFieldParsedValue[TParseType],
	TFallback = TTransformed | null | undefined,
>(
	config: IMultiTypeFieldParserConfig<TParseType, TTransformed, TFallback>,
): TTransformed | TFallback
export function multiTypeFieldParser(
	input: IMultiTypeFieldParserConfig | readonly IMultiTypeFieldParserConfig[],
): unknown {
	if (isConfigBatch(input)) {
		return input.map((config) => parseOneField(config))
	}

	return parseOneField(input)
}

/**
 * Отличает пачку конфигов от одного: Array.isArray не сужает readonly-массив.
 */
const isConfigBatch = (
	value: IMultiTypeFieldParserConfig | readonly IMultiTypeFieldParserConfig[],
): value is readonly IMultiTypeFieldParserConfig[] => Array.isArray(value)

/**
 * Прогоняет один конфиг: customParser либо parseType, затем onSuccessTransform.
 * Нужен и одиночному вызову, и map по массиву конфигов.
 */
const parseOneField = (
	config: IMultiTypeFieldParserConfig,
): unknown => {
	const parsedAttempt = tryParseField(config)

	if (!parsedAttempt.isOk) {
		return config.errorFallback
	}

	if (config.onSuccessTransform == null) {
		return parsedAttempt.value
	}

	try {
		return config.onSuccessTransform(parsedAttempt.value)
	} catch {
		return config.errorFallback
	}
}

/**
 * Достаёт значение нужного типа из сырого field.
 * Нужен parseOneField: отделяет «не распарсилось» от валидного результата.
 */
const tryParseField = (
	config: IMultiTypeFieldParserConfig,
): TParseAttempt<TMultiTypeFieldParsedValue[TMultiTypeFieldParseType]> => {
	try {
		if (config.customParser != null) {
			const customValue = config.customParser(config.field)

			if (customValue === undefined) {
				return { isOk: false }
			}

			return { isOk: true, value: customValue }
		}

		const parsedValue = parseFieldByType(config.field, config.parseType)

		if (parsedValue === undefined) {
			return { isOk: false }
		}

		return { isOk: true, value: parsedValue }
	} catch {
		return { isOk: false }
	}
}

/**
 * Штатный парсер по parseType, без доменных веток.
 * Нужен, когда customParser не передали.
 */
const parseFieldByType = (
	field: unknown,
	parseType: TMultiTypeFieldParseType,
): TMultiTypeFieldParsedValue[TMultiTypeFieldParseType] | undefined => {
	switch (parseType) {
		case 'string':
			return typeof field === 'string' ? field : undefined
		case 'number':
			return parseNumberField(field)
		case 'array':
			return Array.isArray(field) ? field : undefined
		case 'object':
			return isPlainObjectField(field) ? field : undefined
		case 'date':
			return parseDateField(field)
	}
}

/**
 * Число из number или числовой строки. Пустая строка и NaN — провал, не 0.
 */
const parseNumberField = (field: unknown): number | undefined => {
	if (typeof field === 'number') {
		return Number.isFinite(field) ? field : undefined
	}

	if (typeof field !== 'string' || field.trim() === '') {
		return undefined
	}

	const parsed = Number(field)

	return Number.isFinite(parsed) ? parsed : undefined
}

/**
 * Date из Date, ISO-строки или unix ms. Invalid Date — провал.
 */
const parseDateField = (field: unknown): Date | undefined => {
	if (field instanceof Date) {
		return Number.isNaN(field.getTime()) ? undefined : field
	}

	if (typeof field !== 'string' && typeof field !== 'number') {
		return undefined
	}

	if (typeof field === 'string' && field.trim() === '') {
		return undefined
	}

	const parsed = new Date(field)

	return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

/**
 * Обычный объект, не массив и не Date.
 */
const isPlainObjectField = (
	field: unknown,
): field is Record<string, unknown> => {
	if (field == null || typeof field !== 'object') {
		return false
	}

	if (Array.isArray(field) || field instanceof Date) {
		return false
	}

	return true
}
