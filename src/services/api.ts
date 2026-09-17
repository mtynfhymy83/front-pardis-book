/**
 * Compatibility facade for the existing Home page.
 * New pages should import the domain clients from their feature API modules.
 */
import { cartApi } from '../features/cart/api/cart.api'
import { catalogApi } from '../features/catalog/api/catalog.api'
import { platformApi } from '../features/platform/api/platform.api'

export { ApiError } from '../shared/api/client'

export const api = {
  bootstrap: platformApi.bootstrap,
  home: platformApi.home,
  navigation: platformApi.navigation,
  suggestions: catalogApi.suggestions,
  currentCart: cartApi.current,
  addToCart: cartApi.addItem,
}
