export const EMultiTypeFieldParseType = {
	string: 'string',
	number: 'number',
	array: 'array',
	object: 'object',
	date: 'date',
} as const

export type TMultiTypeFieldParseType =
	(typeof EMultiTypeFieldParseType)[keyof typeof EMultiTypeFieldParseType]

export type TMultiTypeFieldParsedValue = {
	string: string
	number: number
	array: unknown[]
	object: Record<string, unknown>
	date: Date
}

export interface IMultiTypeFieldParserConfig<
	TParseType extends TMultiTypeFieldParseType = TMultiTypeFieldParseType,
	TTransformed = TMultiTypeFieldParsedValue[TParseType],
	TFallback = TTransformed | null | undefined,
> {
	field: unknown
	parseType: TParseType
	onSuccessTransform?: (
		parsedValue: TMultiTypeFieldParsedValue[TParseType],
	) => TTransformed
	errorFallback?: TFallback
	customParser?: (value: unknown) => TMultiTypeFieldParsedValue[TParseType]
}

export type TMultiTypeFieldParserResult<TConfig> =
	TConfig extends IMultiTypeFieldParserConfig<
		infer _TParseType,
		infer TTransformed,
		infer TFallback
	>
		? TTransformed | TFallback
		: never
