import type { IHttpParams } from './i-app-fetcher'

type IActionTransportFields = Pick<IHttpParams, 'cache' | 'headers' | 'next'>

export type IActionQueryFieldValue = string | string[] | number | boolean | null

export type IActionFilters<T> = Partial<T>

interface IActionCommonOptions extends IActionTransportFields {
	isPublic?: boolean
}

export interface IGetActionOptions<
	TFilters = Record<string, IActionQueryFieldValue>,
> extends IActionCommonOptions {
	url?: string
	filters?: IActionFilters<TFilters>
	customFormatter?: (filters: IActionFilters<TFilters>) => Record<string, string> | undefined
	isArray?: boolean
}

export interface IPostActionOptions<TBody = unknown> extends IActionCommonOptions {
	url: string
	body?: TBody
	onOk?: () => void | Promise<void>
}

export type IPutActionOptions<TBody = unknown> = IPostActionOptions<TBody>

export type IPatchActionOptions<TBody = unknown> = IPostActionOptions<TBody>

export type IDeleteActionOptions<TBody = unknown> = IPostActionOptions<TBody>

export interface ISseActionOptions<
	TFilters = Record<string, IActionQueryFieldValue>,
> extends IActionCommonOptions {
	url: string
	filters?: IActionFilters<TFilters>
	customFormatter?: (filters: IActionFilters<TFilters>) => Record<string, string> | undefined
}
