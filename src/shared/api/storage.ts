const ACCESS_TOKEN_KEY = 'pardis_access_token'
const REFRESH_TOKEN_KEY = 'pardis_refresh_token'
const GUEST_CART_TOKEN_KEY = 'pardis_guest_cart_token'
const SESSION_CHANGED_EVENT = 'pardis:session-changed'

type TokenPair = {
  accessToken: string
  refreshToken: string
}

function read(storage: Storage | undefined, key: string): string | null {
  if (!storage) return null
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

function write(storage: Storage | undefined, key: string, value: string | null) {
  if (!storage) return
  try {
    if (value === null) storage.removeItem(key)
    else storage.setItem(key, value)
  } catch {
    // Storage may be unavailable in private/restricted browser contexts.
  }
}

function browserStorage(kind: 'local' | 'session'): Storage | undefined {
  if (typeof window === 'undefined') return undefined
  return kind === 'local' ? window.localStorage : window.sessionStorage
}

function notifySessionChanged() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(SESSION_CHANGED_EVENT))
}

export const sessionStore = {
  getAccessToken: () => read(browserStorage('session'), ACCESS_TOKEN_KEY),
  getRefreshToken: () => read(browserStorage('local'), REFRESH_TOKEN_KEY),
  hasSession: () => Boolean(read(browserStorage('session'), ACCESS_TOKEN_KEY) || read(browserStorage('local'), REFRESH_TOKEN_KEY)),

  setTokens(tokens: TokenPair) {
    write(browserStorage('session'), ACCESS_TOKEN_KEY, tokens.accessToken)
    write(browserStorage('local'), REFRESH_TOKEN_KEY, tokens.refreshToken)
    notifySessionChanged()
  },

  clear() {
    write(browserStorage('session'), ACCESS_TOKEN_KEY, null)
    write(browserStorage('local'), REFRESH_TOKEN_KEY, null)
    notifySessionChanged()
  },

  subscribe(listener: () => void) {
    if (typeof window === 'undefined') return () => undefined
    window.addEventListener(SESSION_CHANGED_EVENT, listener)
    window.addEventListener('storage', listener)
    return () => {
      window.removeEventListener(SESSION_CHANGED_EVENT, listener)
      window.removeEventListener('storage', listener)
    }
  },
}

export const guestCartStore = {
  getToken: () => read(browserStorage('local'), GUEST_CART_TOKEN_KEY),
  setToken: (token: string) => write(browserStorage('local'), GUEST_CART_TOKEN_KEY, token),
  clear: () => write(browserStorage('local'), GUEST_CART_TOKEN_KEY, null),
}
