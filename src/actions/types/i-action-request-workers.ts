import type { ZodSchema } from 'zod'
import type { IApiResponseMapper } from '../contracts/api-response/types/i-api-response-mapper'
import type { TAppFetcher } from './i-app-fetcher'

export type TFormatActionErrorMessage = (message: string) => string

export type TActionErrorLogger = (message: string) => void

export interface IActionRequestWorkers {
	fetcher: TAppFetcher
	responseMapper: IApiResponseMapper
	streamResponseParser?: (res: Response) => Promise<unknown>
	formatErrorMessage?: TFormatActionErrorMessage
	onError?: TActionErrorLogger
	onForbiddenLogout?: () => void | Promise<void>
}

export interface IGetActionRequestWorkers<
	TFilters = Record<string, unknown>,
> extends IActionRequestWorkers {
	queryFilterSchema?: ZodSchema<TFilters>
}
