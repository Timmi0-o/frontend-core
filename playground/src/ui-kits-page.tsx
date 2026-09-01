import { uiKit as socialKit } from '../../src/kits/social'
import { uiKit as adminKit } from '../../src/kits/admin'
import type { CSSProperties, ReactElement } from 'react'
import { KitColumn, KIT_COLUMN_GRID_ROWS } from './kit-column'
import { KitSectionsNav } from './kit-sections-nav'
import {
	KIT_OPTIONS,
	parseKitIds,
	serializeKitIds,
	type TKitId,
} from './kit-options'
import { usePlaygroundLocation } from './location-context'

const KIT_UI: Record<TKitId, string> = {
	social: socialKit,
	admin: adminKit,
}

export const UiKitsPage = (): ReactElement => {
	const { search, navigate } = usePlaygroundLocation()
	const selectedIds = parseKitIds(search)

	const setSelectedIds = (next: TKitId[]): void => {
		navigate(`/ui-kits?kits=${serializeKitIds(next)}`, { replace: true })
	}

	const toggleKit = (id: TKitId): void => {
		if (selectedIds.includes(id)) {
			if (selectedIds.length === 1) {
				return
			}

			setSelectedIds(selectedIds.filter((item) => item !== id))
			return
		}

		setSelectedIds([...selectedIds, id])
	}

	const visibleKits = KIT_OPTIONS.filter((kit) => selectedIds.includes(kit.id))

	return (
		<main className='pg-main pg-main--kits'>
			<header className='kits-toolbar'>
				<div>
					<p className='pg-kicker'>Каталог</p>
					<h1 className='kits-toolbar__title'>UI киты</h1>
				</div>

				<fieldset className='kit-toggles'>
					<legend className='kit-toggles__legend'>Показать киты</legend>
					<div className='kit-toggles__list'>
						{KIT_OPTIONS.map((kit) => {
							const isChecked = selectedIds.includes(kit.id)

							return (
								<label
									key={kit.id}
									className='kit-toggle'
									data-checked={isChecked ? '' : undefined}
								>
									<input
										type='checkbox'
										checked={isChecked}
										disabled={isChecked && selectedIds.length === 1}
										onChange={() => toggleKit(kit.id)}
									/>
									<span>{kit.title}</span>
								</label>
							)
						})}
					</div>
				</fieldset>
			</header>

			{visibleKits.length === 0 ? (
				<p className='kits-empty'>Включите хотя бы один кит в панели сверху.</p>
			) : (
				<div className='kits-body'>
					<div className='kits-board'>
						<div
							className='kits-grid'
							style={
								{
									'--kits-count': visibleKits.length,
									'--kit-rows': KIT_COLUMN_GRID_ROWS,
								} as CSSProperties
							}
						>
							{visibleKits.map((kit) => (
								<KitColumn
									key={kit.id}
									kitId={kit.id}
									title={kit.title}
									hint={kit.hint}
									uiKit={KIT_UI[kit.id]}
								/>
							))}
						</div>
					</div>
					<KitSectionsNav
						observeKey={visibleKits.map((kit) => kit.id).join(',')}
					/>
				</div>
			)}
		</main>
	)
}
