import type { IAppActionResponse } from './i-app-action-response.type'

export type IApiResponseMapper<TResponse = unknown> = <TData>(
	response: TResponse,
) => IAppActionResponse<TData>
