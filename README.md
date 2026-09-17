# فرانت کتابسرای پردیس

صفحه Home فروشگاه عمده کتاب‌های آموزش زبان، ساخته‌شده با React، TypeScript و Vite.

زیرساخت فاز صفر شامل React Router، TanStack Query، API Client ماژولار، تمدید نشست، سبد مهمان نسخه‌دار و Idempotency سفارش/پرداخت است. جزئیات تصمیم‌ها و Gapهای API در [`docs/phase-0-foundation.fa.md`](docs/phase-0-foundation.fa.md) ثبت شده است.

## اجرا

```bash
npm install
npm run dev
```

## بررسی خروجی

```bash
npm run lint
npm run typecheck
npm run build
```

صفحه به API بک‌اند متصل است. در حالت توسعه، Vite درخواست‌های `/api` را به `http://localhost:9502` پراکسی می‌کند. در Docker نیز Nginx درخواست‌های `/api` را به سرویس `app:9502` هدایت می‌کند.

برای استفاده از آدرس API دیگر هنگام build:

```bash
VITE_API_URL=https://api.pardisbook.ir/api/v1 npm run build
```

سبد مهمان با `X-Guest-Cart-Token` کار می‌کند و توکن آن در `localStorage` مرورگر نگهداری می‌شود.

# front-pardis-book
