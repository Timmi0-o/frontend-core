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
export type TResolveActionError = (
	message: string,
	code?: string,
) => Promise<TResolvedActionError>

/**
 * Зависимости `abstractGetAction` / `abstractMutateAction`: транспорт, маппер ответа и обработка ошибок.
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
 * await abstractMutateAction({ url: '/v1/appointments', params: { method: 'POST', body } }, workers)
 * ```
 */
export interface IActionRequestWorkers {
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
	 * Вызывается из `abstractMutateAction`, если в опциях `isForbiddenLogout: true`.
	 *
	 * @example
	 * ```ts
	 * onForbiddenLogout: () => signOut()
	 * ```
	 */
	onForbiddenLogout?: () => void | Promise<void>
}

/**
 * Workers для GET: всё из {@link IActionRequestWorkers} плюс Zod-схема query-фильтров.
 *
 * `queryFilterSchema` отсекает неизвестные поля и валидирует `filters` перед сборкой query string.
 *
 * @example
 * ```ts
 * await abstractGetAction(
 *   {
 *     url: '/v1/appointments',
 *     isArray: true,
 *     filters: { page: 1, limit: 20 },
 *   },
 *   {
 *     ...workers,
 *     queryFilterSchema: AppointmentsGetManyFiltersSchema,
 *   },
 * )
 * ```
 */
export interface IGetActionRequestWorkers<
	TFilters = Record<string, unknown>,
> extends IActionRequestWorkers {
	/**
	 * Zod-схема фильтров list/getOne. Без неё в query уходят только сырые `filters`.
	 *
	 * @example
	 * ```ts
	 * queryFilterSchema: z.object({
	 *   page: z.number().optional(),
	 *   limit: z.number().optional(),
	 *   preset: z.enum(['MINIMAL', 'SHORT', 'BASE']).optional(),
	 * })
	 * ```
	 */
	queryFilterSchema?: ZodSchema<TFilters>
}
