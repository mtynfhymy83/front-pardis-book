import type { CheckoutQuote, CreatedOrder } from '../../types/checkout'

const QUOTE_KEY = 'pardis_checkout_quote'
const ORDER_KEY = 'pardis_checkout_order'
const ATTEMPT_KEY = 'pardis_checkout_attempt'
function read<T>(key: string): T | null { try { const value = sessionStorage.getItem(key); return value ? JSON.parse(value) as T : null } catch { return null } }
function write(key: string, value: unknown) { try { sessionStorage.setItem(key, JSON.stringify(value)) } catch { /* unavailable storage */ } }
export const checkoutSession = { quote: () => read<CheckoutQuote>(QUOTE_KEY), setQuote: (quote: CheckoutQuote) => write(QUOTE_KEY, quote), order: () => read<CreatedOrder>(ORDER_KEY), setOrder: (order: CreatedOrder) => write(ORDER_KEY, order), attemptId: () => { try { return sessionStorage.getItem(ATTEMPT_KEY) } catch { return null } }, setAttemptId: (attemptId: string) => { try { sessionStorage.setItem(ATTEMPT_KEY, attemptId) } catch { /* unavailable storage */ } }, clear: () => { sessionStorage.removeItem(QUOTE_KEY); sessionStorage.removeItem(ORDER_KEY); sessionStorage.removeItem(ATTEMPT_KEY) } }
