/**
 * Плавно доводит секцию каталога в видимую область общей доски китов.
 * Нужен оглавлению справа: после выравнивания рядов скроллится одна доска, а не колонки по отдельности.
 */
export const scrollKitColumnsToSection = (sectionId: string): void => {
	const section = document.querySelector(
		`[data-demo-section="${CSS.escape(sectionId)}"]`,
	)

	if (!(section instanceof HTMLElement)) {
		return
	}

	const board = document.querySelector('.kits-board')
	const stickyHead = document.querySelector('.kit-column__head')
	const stickyHeadHeight =
		stickyHead instanceof HTMLElement
			? stickyHead.getBoundingClientRect().height
			: 0

	if (board instanceof HTMLElement && board.scrollHeight > board.clientHeight + 1) {
		const nextTop =
			board.scrollTop +
			section.getBoundingClientRect().top -
			board.getBoundingClientRect().top -
			stickyHeadHeight -
			8

		board.scrollTo({
			top: Math.max(0, nextTop),
			behavior: 'smooth',
		})
		return
	}

	const header = document.querySelector('.pg-header')
	const headerHeight =
		header instanceof HTMLElement ? header.getBoundingClientRect().height : 0
	const nextTop =
		window.scrollY +
		section.getBoundingClientRect().top -
		headerHeight -
		12

	window.scrollTo({
		top: Math.max(0, nextTop),
		behavior: 'smooth',
	})
}
