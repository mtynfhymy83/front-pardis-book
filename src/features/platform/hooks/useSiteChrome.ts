import { useQuery } from '@tanstack/react-query'
import { cartApi } from '../../cart/api/cart.api'
import { platformApi } from '../api/platform.api'

export function useSiteChrome() {
  const navigation = useQuery({ queryKey: ['platform', 'navigation'], queryFn: platformApi.navigation, staleTime: 300_000 })
  const bootstrap = useQuery({ queryKey: ['platform', 'bootstrap'], queryFn: platformApi.bootstrap, staleTime: 300_000 })
  const cart = useQuery({ queryKey: ['cart', 'current'], queryFn: cartApi.current, staleTime: 30_000 })

  return {
    navigation: navigation.data ?? null,
    currency: bootstrap.data?.currency ?? 'تومان',
    cartCount: cart.data?.summary.totalQuantity ?? 0,
  }
}
