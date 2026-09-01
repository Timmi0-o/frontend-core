import { Button, Modal } from '../../src/ui'
import {
	useLayoutEffect,
	useRef,
	useState,
	type ReactElement,
	type ReactNode,
} from 'react'
import { getKitSectionExample } from './kit-section-examples'
import { slugifyDemoSectionTitle } from './slugify-demo-section-title'
import { splitExampleCode } from './split-example-code'

interface IDemoSectionProps {
	title: string
	hint?: string
	children: ReactNode
}

const CodeIcon = (): ReactElement => {
	return (
		<svg viewBox='0 0 16 16' width='16' height='16' fill='none' aria-hidden='true'>
			<path
				d='M6.25 4.25 2.75 8l3.5 3.75M9.75 4.25 13.25 8l-3.5 3.75'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

export const DemoSection = ({
	title,
	hint,
	children,
}: IDemoSectionProps): ReactElement => {
	const slug = slugifyDemoSectionTitle(title)
	const sectionRef = useRef<HTMLElement>(null)
	const [kitId, setKitId] = useState('social')
	const [isCodeOpen, setIsCodeOpen] = useState(false)
	const [isCopied, setIsCopied] = useState(false)

	useLayoutEffect(() => {
		const kit = sectionRef.current
			?.closest('[data-ui-kit]')
			?.getAttribute('data-ui-kit')

		if (kit) {
			setKitId(kit)
		}
	}, [])

	const example = getKitSectionExample(slug, kitId)
	const exampleTokens = example == null ? [] : splitExampleCode(example)

	const handleCopy = async (): Promise<void> => {
		if (example == null) {
			return
		}

		await navigator.clipboard.writeText(example)
		setIsCopied(true)
		window.setTimeout(() => setIsCopied(false), 1600)
	}

	return (
		<section
			ref={sectionRef}
			className='demo-section'
			data-demo-section={slug}
		>
			<header className='demo-section__head'>
				<div className='demo-section__intro'>
					<h3 className='demo-section__title'>{title}</h3>
					{hint ? <p className='demo-section__hint'>{hint}</p> : null}
				</div>
				{example == null ? null : (
					<button
						type='button'
						className='demo-section__code'
						aria-label={`Код секции ${title}`}
						onClick={() => setIsCodeOpen(true)}
					>
						<CodeIcon />
					</button>
				)}
			</header>
			<div className='demo-section__body'>{children}</div>

			{example == null ? null : (
				<Modal
					open={isCodeOpen}
					onOpenChange={(isOpen) => {
						setIsCodeOpen(isOpen)

						if (!isOpen) {
							setIsCopied(false)
						}
					}}
					className='kit-section-code-modal'
					title={`Код: ${title}`}
				>
					<Modal.Header>
						<Modal.Title>{title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<pre className='kit-section-code'>
							<code>
								{exampleTokens.map((token, index) => (
									<span
										key={`${token.type}-${String(index)}`}
										className={
											token.type === 'comment'
												? 'kit-section-code__comment'
												: undefined
										}
									>
										{token.value}
									</span>
								))}
							</code>
						</pre>
					</Modal.Body>
					<Modal.Footer>
						<Button variant='outline' size='sm' onClick={() => setIsCodeOpen(false)}>
							Закрыть
						</Button>
						<Button size='sm' onClick={() => void handleCopy()}>
							{isCopied ? 'Скопировано' : 'Копировать'}
						</Button>
					</Modal.Footer>
				</Modal>
			)}
		</section>
	)
}
