export type TBase64Encodable = string | number | boolean | null | object

/**
 * JSON → url-safe base64 и обратно.
 * Нужен path/query (offerId): обычный base64 ломает URL из‑за `+` `/` `=`.
 */
export const base64Manager = {
	encode(value: TBase64Encodable): string {
		const json = JSON.stringify(value)

		if (json === undefined) {
			throw new TypeError('base64Manager.encode: value is not JSON-serializable')
		}

		return bytesToBase64Url(new TextEncoder().encode(json))
	},

	decode,
}

/**
 * Достаёт JSON из url-safe base64.
 * Нужен decode без схемы: transformer не передали — сырой JSON.parse.
 */
function decode(encoded: string): unknown
function decode<TTransformed>(
	encoded: string,
	resultTransformer: (value: unknown) => TTransformed,
): TTransformed
function decode<TTransformed>(
	encoded: string,
	resultTransformer?: (value: unknown) => TTransformed,
): TTransformed | unknown {
	const json = new TextDecoder().decode(base64UrlToBytes(encoded))
	const parsed: unknown = JSON.parse(json)

	if (resultTransformer == null) {
		return parsed
	}

	return resultTransformer(parsed)
}

/**
 * Bytes → base64url without padding.
 * Нужен encode: payload должен жить в path-сегменте.
 */
const bytesToBase64Url = (bytes: Uint8Array): string => {
	let binary = ''
	for (const byte of bytes) {
		binary += String.fromCharCode(byte)
	}

	return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

/**
 * base64url (и обычный base64) → bytes.
 * Нужен decode: в URL приходит url-safe строка, atob ждёт классический алфавит.
 */
const base64UrlToBytes = (encoded: string): Uint8Array => {
	const trimmed = encoded.trim()

	if (trimmed === '') {
		throw new TypeError('base64Manager.decode: empty payload')
	}

	const padded = trimmed.replaceAll('-', '+').replaceAll('_', '/')
	const padLength = (4 - (padded.length % 4)) % 4
	const binary = atob(`${padded}${'='.repeat(padLength)}`)
	const bytes = new Uint8Array(binary.length)

	for (let index = 0; index < binary.length; index += 1) {
		bytes[index] = binary.charCodeAt(index)
	}

	return bytes
}
