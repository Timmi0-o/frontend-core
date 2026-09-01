import type { IAppActionResponse } from '../contracts/api-response/types/i-app-action-response.type'

export const EMPTY_DEFAULT_API_RESPONSE: IAppActionResponse<unknown> = {
	result: {
		data: null,
		meta: {
			totalCount: 0,
			total: 0,
			limit: 0,
			page: 0,
		},
	},
	error: null,
}
