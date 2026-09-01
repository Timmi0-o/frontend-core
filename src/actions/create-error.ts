import type { IAppActionResponseError } from './contracts/api-response/types/i-app-action-response.type'

/**
 * Собирает объект ошибки action в формате `IAppActionResponseError`.
 * Нужен abstract-get при пустом data и доменным проверкам до HTTP-запроса.
 */
export const createError = (
	statusCode: number,
	message: string,
	_path?: string,
	_method?: string,
): IAppActionResponseError => ({
	statusCode,
	message,
	timestamp: new Date().toISOString(),
})
