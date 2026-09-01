export type TExampleCodeToken = {
	type: 'code' | 'comment'
	value: string
}

/**
 * Режет пример на обычный код и комментарии.
 * Нужен модалке каталога, чтобы однострочные и блочные комментарии отличались от кода.
 */
export const splitExampleCode = (source: string): TExampleCodeToken[] => {
	const tokens: TExampleCodeToken[] = []
	const commentPattern = /\/\/[^\n]*|\/\*[\s\S]*?\*\//g
	let cursor = 0
	let match = commentPattern.exec(source)

	while (match != null) {
		if (match.index > cursor) {
			tokens.push({
				type: 'code',
				value: source.slice(cursor, match.index),
			})
		}

		tokens.push({ type: 'comment', value: match[0] })
		cursor = match.index + match[0].length
		match = commentPattern.exec(source)
	}

	if (cursor < source.length) {
		tokens.push({ type: 'code', value: source.slice(cursor) })
	}

	return tokens
}
