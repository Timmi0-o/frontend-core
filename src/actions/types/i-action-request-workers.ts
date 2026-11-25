import type { ZodSchema } from 'zod'

import type { IApiResponseMapper } from '../contracts/api-response/types/i-api-response-mapper'
import type { TAppFetcher } from './i-app-fetcher'

/** Логгер сырого сообщения об ошибке API (до `resolveActionError`). */
export type TActionErrorLogger = (message: string) => void

/**
 * Переведённая/нормализованная ошибка для `IAppActionResponse.error`.
 *
 * `cta` — опциональный код действия в UI (например `UPGRADE_PLAN`).
 */
export type TResolvedActionError = {
	message: string
	cta?: string
}

/**
 * Переводит сообщение и код доменной ошибки API в текст для клиента.
 *
 * @param message — `error.message` из тела ответа
 * @param code — `error.code` доменной ошибки, если бэкенд его отдал
 *
 * @example
 * ```ts
 * const resolveActionError: TResolveActionError = async (message, code) => {
 *   if (code === 'ENTITLEMENT_LIMIT_EXCEEDED') {
 *     return { message: t('limitExceeded'), cta: 'UPGRADE_PLAN' }
 *   }
 *
 *   if (message.includes('Appointment slot is not available')) {
 *     return { message: t('slotUnavailable') }
 *   }
 *
 *   return { message: message || t('unknownError') }
 * }
 * ```
 */
export type TResolveActionError = (message: string, code?: string) => Promise<TResolvedActionError>

/**
 * Зависимости `abstractAction`: транспорт, маппер ответа и обработка ошибок.
 *
 * Обязательны `fetcher` и `responseMapper`. Остальное — хуки конкретного приложения.
 *
 * @example
 * ```ts
 * const workers: IActionRequestWorkers = {
 *   fetcher: ({ url, params, json, isPublic }) =>
 *     fetch(url, {
 *       method: params.method,
 *       headers: params.headers,
 *       body: json && params.body != null
 *         ? JSON.stringify(params.body)
 *         : (params.body as BodyInit | null | undefined),
 *     }),
 *   responseMapper: (response) => ({
 *     result: { data: response.result?.data ?? null },
 *     error: response.error ?? null,
 *   }),
 *   resolveActionError,
 * }
 *
 * await abstractAction().POST({ url: '/v1/appointments', body }, workers)
 * ```
 */
export interface IActionRequestWorkers<TFilters = Record<string, unknown>, TBody = unknown> {
	/**
	 * HTTP-транспорт. Должен вернуть нативный `Response`.
	 *
	 * @example
	 * ```ts
	 * fetcher: ({ url, params, isPublic }) =>
	 *   fetch(url, {
	 *     method: params.method ?? 'GET',
	 *     headers: {
	 *       ...params.headers,
	 *       ...(isPublic ? {} : { Authorization: `Bearer ${token}` }),
	 *     },
	 *     body: params.body as BodyInit | undefined,
	 *   })
	 * ```
	 */
	fetcher: TAppFetcher

	/**
	 * Сырой JSON бэкенда → `IAppActionResponse`.
	 * Для ошибок достаточно пробросить `error` как есть (`statusCode`, `message`, `code`).
	 *
	 * @example
	 * ```ts
	 * responseMapper: (response) => ({
	 *   result: {
	 *     data: response.result?.data ?? null,
	 *     ...(response.result?.meta && { meta: response.result.meta }),
	 *   },
	 *   error: response.error ?? null,
	 * })
	 * ```
	 */
	responseMapper: IApiResponseMapper

	/**
	 * Вместо `res.json()` — свой парсер тела (SSE, stream).
	 * Если не задан, abstract-action читает JSON.
	 *
	 * @example
	 * ```ts
	 * streamResponseParser: async (res) => parseSseJson(res)
	 * ```
	 */
	streamResponseParser?: (res: Response) => Promise<unknown>

	/**
	 * Перевод `error.message` / `error.code` в текст (и опционально `cta`) для тоста/UI.
	 * Без хука клиент получает сырое сообщение API.
	 *
	 * @example
	 * ```ts
	 * resolveActionError: async (message, code) => {
	 *   const t = await getTranslations('action-errors.shared.domain-errors')
	 *   return { message: code ? t(code) : message }
	 * }
	 * ```
	 */
	resolveActionError?: TResolveActionError

	/**
	 * Вызывается при HTTP-ошибке с сырым текстом API, до резолва.
	 *
	 * @example
	 * ```ts
	 * onError: (message) => logger.warn(message)
	 * ```
	 */
	onError?: TActionErrorLogger

	/**
	 * Zod-схема query-фильтров для GET и SSE.
	 * Отсекает неизвестные поля перед сборкой query string. Без неё в query уходят сырые `filters`.
	 *
	 * @example
	 * ```ts
	 * requestQueryValidationSchema: z.object({
	 *   page: z.number().optional(),
	 *   limit: z.number().optional(),
	 *   preset: z.enum(['MINIMAL', 'SHORT', 'BASE']).optional(),
	 * })
	 * ```
	 */
	requestQueryValidationSchema?: ZodSchema<TFilters>

	/**
	 * Zod-схема JSON-body для POST, PUT, PATCH и DELETE.
	 * Без неё body уходит как передан. При ошибке action возвращает 400 и запрос не отправляется.
	 *
	 * @example
	 * ```ts
	 * requestBodyValidationSchema: z.object({
	 *   name: z.string(),
	 *   price: z.number(),
	 * })
	 * ```
	 */
	requestBodyValidationSchema?: ZodSchema<TBody>
}
