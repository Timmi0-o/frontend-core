import type {
	IAppActionResponseSuccess,
	IAppActionResponseResult,
} from '../contracts/api-response/types/i-app-action-response.type'

const EMPTY_DEFAULT_API_RESULT: IAppActionResponseResult<unknown> = {
	data: null,
	meta: {
		totalCount: 0,
		total: 0,
		limit: 0,
		page: 0,
	},
}

export const EMPTY_DEFAULT_API_RESPONSE: IAppActionResponseSuccess<unknown> = {
	result: EMPTY_DEFAULT_API_RESULT,
	error: null,
}

export const emptyDefaultApiResponse = <T>(): IAppActionResponseSuccess<T> => ({
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
})
