# فرانت کتابسرای پردیس

صفحه Home فروشگاه عمده کتاب‌های آموزش زبان، ساخته‌شده با React، TypeScript و Vite.

## اجرا

```bash
npm install
npm run dev
```

## بررسی خروجی

```bash
npm run lint
npm run build
```

صفحه به API بک‌اند متصل است. در حالت توسعه، Vite درخواست‌های `/api` را به `http://localhost:9501` پراکسی می‌کند.

برای استفاده از آدرس API دیگر هنگام build:

```bash
VITE_API_URL=https://api.pardisbook.ir/api/v1 npm run build
```

سبد مهمان با `X-Guest-Cart-Token` کار می‌کند و توکن آن در `localStorage` مرورگر نگهداری می‌شود.

# front-pardis-book
