export interface IAppActionResponseMeta {
	total: number
	totalCount: number
	limit: number
	page: number
	offset?: number
	hasMoreBefore?: boolean
	hasMoreAfter?: boolean
}

export interface IAppActionResponseResult<T> {
	data: T | null
	meta?: IAppActionResponseMeta
}

export interface IAppActionResponseError {
	statusCode: number
	message: string
	timestamp: string
	code?: string
	cta?: string
}

export interface IAppActionResponseSuccess<T> {
	result: IAppActionResponseResult<T>
	error: null
}

export interface IAppActionResponseFailure {
	result: null
	error: IAppActionResponseError
}

export type IAppActionResponse<T> = IAppActionResponseSuccess<T> | IAppActionResponseFailure
