import { Route, Routes } from 'react-router-dom'
import HomePage from '../App'
import { SearchPage } from '../pages/SearchPage'
import { SeriesLandingPage } from '../pages/SeriesLandingPage'
import { WholesaleGuidePage } from '../pages/WholesaleGuidePage'
import { CatalogPage } from '../pages/CatalogPage'
import { ProductPage } from '../pages/ProductPage'
import { LoginPage } from '../pages/LoginPage'
import { OtpPage } from '../pages/OtpPage'
import { BuyerProfilePage } from '../pages/BuyerProfilePage'
import { CartPage } from '../pages/CartPage'
import { CheckoutAddressPage } from '../pages/CheckoutAddressPage'
import { CheckoutShippingPage } from '../pages/CheckoutShippingPage'
import { CheckoutReviewPage } from '../pages/CheckoutReviewPage'
import { PaymentResultPage } from '../pages/PaymentResultPage'
import { AccountPage, AddressesPage, BusinessProfilePage } from '../pages/AccountPages'
import { OrdersPage, OrderDetailPage } from '../pages/OrderPages'
import { SupportPage, SupportTicketPage } from '../pages/SupportPages'
import { HelpPage, NotFoundPage, SeriesDetailPage } from '../pages/PublicUtilityPages'
import { routes } from './routes'

export function AppRoutes() {
  return <Routes>
    <Route path={routes.home} element={<HomePage />} />
    <Route path={routes.search} element={<SearchPage />} />
    <Route path={routes.seriesIndex} element={<SeriesLandingPage />} />
    <Route path={routes.series} element={<SeriesDetailPage />} />
    <Route path={routes.wholesaleGuide} element={<WholesaleGuidePage />} />
    <Route path={routes.catalog} element={<CatalogPage />} />
    <Route path={routes.product} element={<ProductPage />} />
    <Route path={routes.login} element={<LoginPage />} />
    <Route path={routes.otp} element={<OtpPage />} />
    <Route path={routes.buyerProfile} element={<BuyerProfilePage />} />
    <Route path={routes.cart} element={<CartPage />} />
    <Route path={routes.checkoutAddress} element={<CheckoutAddressPage />} />
    <Route path={routes.checkoutShipping} element={<CheckoutShippingPage />} />
    <Route path={routes.checkoutReview} element={<CheckoutReviewPage />} />
    <Route path={routes.paymentResult} element={<PaymentResultPage />} />
    <Route path={routes.account} element={<AccountPage />} />
    <Route path={routes.addresses} element={<AddressesPage />} />
    <Route path={routes.businessProfile} element={<BusinessProfilePage />} />
    <Route path={routes.orders} element={<OrdersPage />} />
    <Route path={routes.orderDetail} element={<OrderDetailPage />} />
    <Route path={routes.support} element={<SupportPage />} />
    <Route path={routes.supportTicket} element={<SupportTicketPage />} />
    <Route path={routes.help} element={<HelpPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
}
