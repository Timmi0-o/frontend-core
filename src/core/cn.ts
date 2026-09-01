import { type ClassValue, clsx } from 'clsx'

/**
 * Склеивает className примитива с пользовательским, отбрасывая falsy.
 * Вызывать в любом UI-компоненте, у которого есть `className`.
 */
export const cn = (...inputs: ClassValue[]): string => clsx(inputs)
