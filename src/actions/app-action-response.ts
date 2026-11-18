import type { IAppActionResponseSuccess } from './contracts/api-response/types/i-app-action-response.type'

/**
 * После успешного HTTP и `handleActionError`: вернуть `data`, если бэкенд не отдал тело.
 */
export const getAppActionData = <T>(
	response: IAppActionResponseSuccess<T>,
	missingDataMessage: string,
): T => {
	const data = response.result.data

	if (data == null) {
		throw new Error(missingDataMessage)
	}

	return data
}