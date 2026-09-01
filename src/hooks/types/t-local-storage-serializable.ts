/**
 * Значения, которые `useLocalStorage` умеет класть в `localStorage`.
 */
export type TLocalStorageSerializable =
	| string
	| number
	| boolean
	| null
	| TLocalStorageSerializable[]
	| { [key: string]: TLocalStorageSerializable }
	| Set<TLocalStorageSerializable>
	| Map<string, TLocalStorageSerializable>
	| Date
