'use client'

import { Button, Modal } from '../../src/ui'
import type { ReactElement } from 'react'
import { KitScenario } from './kit-scenario'

interface IKitScenarioDialogProps {
	open: boolean
	onClose: () => void
}

/**
 * Открывает сборный сценарий в Modal текущего кита.
 * Рендерить внутри колонки с `data-ui-kit`, чтобы портал взял стили этого кита.
 */
export const KitScenarioDialog = ({
	open,
	onClose,
}: IKitScenarioDialogProps): ReactElement => {
	return (
		<Modal
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					onClose()
				}
			}}
			className='kit-scenario-modal'
		>
			<Modal.Header>
				<p className='kit-scenario-modal__kicker'>Сценарий кита</p>
				<Modal.Title>Подбор тура</Modal.Title>
				<p className='kit-scenario-modal__lead'>
					Поиск, сравнение отелей и подтверждение брони — как в рабочем
					потоке агента.
				</p>
			</Modal.Header>
			<Modal.Body>
				<KitScenario />
			</Modal.Body>
			<Modal.Footer>
				<Button variant='outline' onClick={onClose}>
					Закрыть
				</Button>
			</Modal.Footer>
		</Modal>
	)
}
