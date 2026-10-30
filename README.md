# Albaraka Storefront

Arabic and English fruit and vegetable store with an admin dashboard, built with Next.js 16.

Live: https://albaraka-blush.vercel.app/

## Features

- Product catalog with search, filters and sorting
- Cart, checkout and order tracking
- Admin dashboard: analytics, orders, products, categories, delivery areas, admins and settings
- Arabic (RTL) and English, with dark mode

## Stack

Next.js, React 19, TypeScript, Tailwind CSS 4, TanStack Query, Zustand, React Hook Form, Zod and next-intl.

## Getting started

Copy `.env.example` to `.env.local`, point `NEXT_PUBLIC_API_URL` at the API, then run:

```bash
npm install
npm run dev
```

The app runs on http://localhost:3000.

## Structure

- `app/`: routes only; each page renders a feature component
- `features/`: the code of each feature
- `components/`: components shared between features
- `lib/`: API client and types
- `i18n/`, `messages/`: language setup and translations

Some product photos come from Wikimedia Commons and TheMealDB, and remain under their own licenses.
