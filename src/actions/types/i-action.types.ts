import type { IHttpParams } from './i-app-fetcher'

interface IBaseActionOptions {
	url: string
	params?: IHttpParams
}

export type IActionQueryFieldValue = string | string[] | number | boolean | null

export type IActionFilters<T> = Partial<T>

export interface IGetActionOptions<
	TFilters = Record<string, IActionQueryFieldValue>,
> extends Partial<IBaseActionOptions> {
	filters?: IActionFilters<TFilters>
	customFormatter?: (
		filters: IActionFilters<TFilters>,
	) => Record<string, string> | undefined
	isArray?: boolean
	isPublic?: boolean
}

export interface IMutateActionOptions<T> extends IBaseActionOptions {
	params?: IHttpParams & { body?: T }
	json?: boolean
	onOk?: () => void | Promise<void>
	isForbiddenLogout?: boolean
	isPublic?: boolean
	allowEmptyBody?: boolean
}
