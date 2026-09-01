'use client'

import { useEffect } from 'react'

const DEFAULT_BEFORE_UNLOAD_MESSAGE =
	'Несохранённые изменения будут потеряны. Форма сбросится при перезагрузке страницы.'

export interface IUseBeforeUnloadWarningOptions {
	message?: string
	/**
	 * Вызывается в `beforeunload`, когда браузер показывает диалог ухода.
	 * Нужен оверлею перезагрузки в admin-panel.
	 */
	onTrigger?: () => void
}

/**
 * Предупреждает о потере несохранённых данных при закрытии/перезагрузке вкладки.
 * Включать, только пока форма грязная.
 */
export const useBeforeUnloadWarning = (
	isEnabled: boolean,
	options: IUseBeforeUnloadWarningOptions = {},
): void => {
	const { message = DEFAULT_BEFORE_UNLOAD_MESSAGE, onTrigger } = options

	useEffect(() => {
		if (!isEnabled) {
			return
		}

		const onBeforeUnload = (event: BeforeUnloadEvent): void => {
			event.preventDefault()
			event.returnValue = message
			onTrigger?.()
		}

		window.addEventListener('beforeunload', onBeforeUnload)

		return () => {
			window.removeEventListener('beforeunload', onBeforeUnload)
		}
	}, [isEnabled, message, onTrigger])
}
