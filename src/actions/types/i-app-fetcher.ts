export interface INextFetchRequestConfig {
	revalidate?: number | false
	tags?: string[]
}

export interface IHttpParams<
	T extends BodyInit | null | undefined | unknown = unknown,
> {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
	headers?: Record<string, string>
	body?: T
	cache?: RequestCache
	next?: INextFetchRequestConfig
}

export interface IAppFetcher<
	T extends BodyInit | null | undefined = BodyInit | null | undefined,
> {
	url: string
	params: IHttpParams<T>
	json?: boolean
	isPublic?: boolean
}

export type TAppFetcher<
	T extends BodyInit | null | undefined = BodyInit | null | undefined,
> = (args: IAppFetcher<T>) => Promise<Response>
