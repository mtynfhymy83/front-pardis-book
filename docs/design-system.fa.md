# زبان بصری فرانت کتابسرای پردیس

این سند مرجع اجرایی UI برای همهٔ فازهای فرانت است. طرح‌های مرجع در بخش‌های مختلف چند نوع Header و لوگو دارند؛ این سیستم یک نسخه واحد را برای جلوگیری از ناهماهنگی تثبیت می‌کند.

## توکن‌ها

| نقش | Token | مقدار |
|---|---|---|
| رنگ برند | `--color-brand-navy` | `#102A43` |
| اقدام اصلی | `--color-primary` | `#1261FF` |
| سطح انتخاب | `--color-primary-soft` | `#EAF1FF` |
| Accent محدود | `--color-accent` | `#FFC928` |
| موفقیت و موجودی | `--color-success` | `#168A5B` |
| پس‌زمینه محتوا | `--color-canvas` | `#F5F8FC` |
| متن اصلی | `--color-text` | `#132238` |
| متن ثانویه | `--color-text-muted` | `#607086` |
| خط جداکننده | `--color-border` | `#DDE6F0` |

توکن‌ها در `src/styles/tokens.css` هستند. استفاده از مقدار Hex پراکنده برای کنترل‌های جدید مجاز نیست؛ ابتدا باید Token مناسب اضافه شود.

## اجزای پایه

- `Button` و `ButtonLink`: حالت‌های `primary`، `secondary`، `ghost` و `white`
- `TextInput`: Label، Hint، خطای متصل به فیلد و `aria-invalid`
- `Dialog`: Modal دسکتاپ و Bottom Sheet موبایل
- `StatePanel`: Loading، Empty و Error قابل‌بازیابی
- `SiteShell`: Topbar، Header، دسته‌بندی، Drawer موبایل، Footer، Bottom Navigation و Toast

## قواعد ریسپانسیو

- موبایل: تا ۷۶۷px؛ Header فشرده، Drawer و Bottom Navigation فعال هستند.
- تبلت: ۷۶۸ تا ۱۰۲۳px؛ Gridها دو ستونه می‌شوند.
- دسکتاپ: از ۱۰۲۴px؛ Header کامل، Navigation و Gridهای چهارستونه نمایش داده می‌شوند.
- تمام کنترل‌های جدید حداقل ارتفاع ۴۴px دارند و Focus قابل مشاهده است.

## قواعد محتوا

- کل رابط RTL است.
- نام کتاب، ISBN، کد سفارش و هر متن لاتین با `dir="ltr"` در کامپوننت مقصد نمایش داده می‌شود.
- رنگ به‌تنهایی نباید وضعیت موجودی، خطا یا موفقیت را منتقل کند؛ متن و آیکن هم لازم‌اند.
- Drawer با Escape بسته می‌شود و در زمان بسته‌بودن از ترتیب Tab حذف می‌شود.
