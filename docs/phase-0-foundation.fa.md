# فاز صفر فرانت کتابسرای پردیس

این سند تصمیم‌های قرارداد، معماری و مرزبندی نسخه مشتری فروشگاه را ثبت می‌کند. منبع قرارداد اجراشده، `App/Http/Routers/api_routes.php` و سرویس‌های بک‌اند است؛ `docs/openapi.yaml` برای مستندسازی استفاده می‌شود، اما در صورت اختلاف، Route و Service اجراشده مبنا هستند.

## خروجی فاز صفر

- API Client مرکزی با Envelope استاندارد، Request ID و خطاهای تایپ‌شده
- تمدید خودکار Access Token با Single-flight Refresh
- نگهداری Access Token در `sessionStorage` و Refresh Token در `localStorage`
- مدیریت متمرکز `X-Guest-Cart-Token`
- پشتیبانی از `Idempotency-Key` برای ایجاد سفارش و تلاش پرداخت
- قراردادهای TypeScript برای کاتالوگ، سبد، احراز هویت، حساب، Checkout، سفارش و پشتیبانی
- APIهای ماژولار در `src/features/*/api`
- Route Manifest قطعی صفحات مشتری در `src/app/routes.ts`
- Query Client مشترک برای Cache، Retry و Mutationهای مراحل بعد

## قرارداد نشست

1. درخواست‌های عمومی بدون Bearer ارسال می‌شوند.
2. درخواست‌های اختیاری در صورت وجود Access Token با Bearer ارسال می‌شوند.
3. اگر Access Token پس از Reload وجود نداشته باشد ولی Refresh Token موجود باشد، یک Refresh انجام می‌شود.
4. در پاسخ 401 فقط یک Refresh هم‌زمان انجام می‌شود و درخواست یک بار تکرار می‌شود.
5. شکست Refresh نشست محلی را پاک می‌کند.
6. ورود موفق، توکن‌های جدید را ذخیره و توکن سبد مهمان مصرف‌شده را پاک می‌کند.

این مدل بر اساس قرارداد فعلی بک‌اند است که Refresh Token را در JSON برمی‌گرداند. مهاجرت آینده به Cookie امن HttpOnly نیازمند تغییر بک‌اند خواهد بود.

## قرارداد هم‌زمانی و پرداخت

- `version` آخرین Cart در تغییر تعداد، حذف، خالی‌کردن و Coupon ارسال می‌شود.
- `version` نشانی و Business Profile هنگام ویرایش ارسال می‌شود.
- خطای `CART_VERSION_CONFLICT` یا `RESOURCE_VERSION_CONFLICT` باید با Refetch و پیام قابل‌فهم حل شود.
- ایجاد Order و Payment Attempt کلید مستقل Idempotency دارد.
- کلید Idempotency یک Mutation نباید برای Payload جدید دوباره استفاده شود.

## نقشه API به فازهای UI

| حوزه | Endpointهای مبنا | فاز UI |
|---|---|---|
| عمومی | `/bootstrap`, `/navigation`, `/home`, `/content/pages/*` | ۲ |
| کاتالوگ | `/products*`, `/series*`, `/search*`, `/catalog/facets` | ۲ و ۳ |
| قیمت و موجودی | `/skus/*/pricing`, `/pricing/quote-line`, `/availability/check` | ۳ |
| ورود | `/auth/otp/*`, `/auth/token/refresh`, `/auth/logout*`, `/auth/sessions*` | ۴ |
| سبد | `/carts`, `/cart*` | ۴ |
| حساب و نشانی | `/me*` | ۴ تا ۶ |
| Checkout و پرداخت | `/checkout/quote`, `/orders`, `/payments/attempts*` | ۵ |
| سفارش | `/orders*`, `/shipments/*/tracking` | ۶ |
| پشتیبانی | `/support/*` | ۶ |

## Gapهای قطعی طرح و API

موارد زیر در تصاویر مرجع دیده می‌شوند ولی Route مشتری متناظر ندارند و تا زمان توسعه API نباید به شکل کنترل فعال نمایش داده شوند:

- علاقه‌مندی‌ها
- روش‌های پرداخت ذخیره‌شده
- تغییر رمز عبور؛ ورود فعلی OTP است
- اعلان‌های حساب
- Endpoint دریافت استان‌ها و شهرها
- Endpoint محاسبه/فهرست روش‌های ارسال
- دانلود مستقیم فایل `invoice.pdf`

در Checkout فعلی بک‌اند `ship_standard` و هزینه ثابت ارسال را داخل Quote می‌سازد. UI فاز ۵ باید تا زمان اضافه‌شدن Shipping API تنها همین گزینه واقعی را نمایش دهد.

فاکتور فعلی Metadata شامل `invoiceNumber` و `storageKey` می‌دهد. نمایش اطلاعات و Print مرورگر ممکن است، اما دکمه دانلود فایل تا فراهم‌شدن URL مجاز یا Endpoint دانلود فعال نمی‌شود.

## ناسازگاری اصلاح‌شده

Product Summary بک‌اند فیلد `maximumPurchasableQuantity` می‌فرستد، در حالی که Home قبلی `availableQuantity` می‌خواند. قرارداد و کارت محصول به نام واقعی API اصلاح شدند.

## Routeهای فرانت

مسیرهای قطعی در `src/app/routes.ts` قرار دارند. در فاز صفر فقط Provider مسیریابی فعال شده است؛ ثبت Page Route و Guard هر مسیر همراه همان فاز انجام می‌شود تا صفحه Placeholder یا دکمه بدون عملکرد وارد محصول نشود.

## سیاست خطا

- `ApiError` شامل `code`, `status`, `fields`, `details` و `requestId` است.
- Abort جستجو به‌عنوان خطای شبکه بازنویسی نمی‌شود.
- Retry خودکار فقط برای خطای شبکه و 5xx و حداکثر دو بار است.
- Mutationها Retry خودکار ندارند.
- کد خام خطا در UI نمایش داده نمی‌شود؛ `requestId` فقط برای پیگیری پشتیبانی قابل استفاده است.

## معیار تحویل

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Home موجود بدون تغییر ماهوی ظاهر، از API Client جدید استفاده کند.
- هیچ تغییر بک‌اند در این فاز انجام نشود.
