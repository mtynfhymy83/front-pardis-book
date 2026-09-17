type QueryValue = string | number | boolean | null | undefined
export type QueryParams = Record<string, QueryValue | QueryValue[] | Record<string, QueryValue>>

export function withQuery(path: string, query: QueryParams = {}) {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== '') params.append(`${key}[]`, String(item))
      })
      return
    }
    if (typeof value === 'object') {
      Object.entries(value).forEach(([childKey, childValue]) => {
        if (childValue !== undefined && childValue !== null && childValue !== '') {
          params.set(`${key}[${childKey}]`, String(childValue))
        }
      })
      return
    }
    params.set(key, String(value))
  })

  const serialized = params.toString()
  return serialized ? `${path}?${serialized}` : path
}
