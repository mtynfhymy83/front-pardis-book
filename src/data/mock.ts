import type { Benefit, BookSeries, Product } from '../types/catalog'

export const bookSeries: BookSeries[] = [
  {
    id: 1,
    title: 'Family and Friends',
    subtitle: 'دوره کامل کودکان و نوجوانان',
    levels: 'Starter تا 6',
    color: '#ffd64d',
    accent: '#e7475d',
    badge: 'پرفروش',
  },
  {
    id: 2,
    title: 'First Friends',
    subtitle: 'شروع انگلیسی برای کودکان',
    levels: 'سطح 1 تا 3',
    color: '#42c9b5',
    accent: '#1666db',
  },
  {
    id: 3,
    title: 'Oxford Discover',
    subtitle: 'یادگیری زبان با تفکر انتقادی',
    levels: 'سطح 1 تا 6',
    color: '#5d8df6',
    accent: '#ffca34',
  },
  {
    id: 4,
    title: 'English File',
    subtitle: 'دوره محبوب نوجوانان و بزرگسالان',
    levels: 'Beginner تا Advanced',
    color: '#ff7b70',
    accent: '#1a3551',
  },
]

export const products: Product[] = [
  {
    id: 1,
    title: 'Family and Friends 1',
    level: 'Student Book + Workbook',
    publisher: 'Oxford',
    price: 318000,
    oldPrice: 355000,
    stock: 46,
    color: '#ffe57c',
    accent: '#e8445a',
    label: 'پرفروش',
  },
  {
    id: 2,
    title: 'Oxford Discover 2',
    level: 'Student Book',
    publisher: 'Oxford',
    price: 286000,
    stock: 28,
    color: '#78a1f7',
    accent: '#ffc62e',
  },
  {
    id: 3,
    title: 'First Friends 1',
    level: 'Class Book + Workbook',
    publisher: 'Oxford',
    price: 265000,
    oldPrice: 290000,
    stock: 34,
    color: '#4acbb7',
    accent: '#155cce',
    label: 'تخفیف ویژه',
  },
  {
    id: 4,
    title: 'English File Elementary',
    level: 'Student Book + Workbook',
    publisher: 'Oxford',
    price: 348000,
    stock: 19,
    color: '#fb8478',
    accent: '#162f4a',
  },
]

export const benefits: Benefit[] = [
  {
    title: 'قیمت پلکانی واقعی',
    description: 'هرچه تعداد سفارش بیشتر باشد، قیمت هر جلد کمتر می‌شود.',
  },
  {
    title: 'موجودی قابل اتکا',
    description: 'قبل از پرداخت، تعداد موجود هر عنوان را شفاف می‌بینید.',
  },
  {
    title: 'ارسال سریع به سراسر کشور',
    description: 'آماده‌سازی سفارش‌های عمده در کوتاه‌ترین زمان ممکن.',
  },
]
