# Albaraka

A bilingual e-commerce storefront for fresh fruit and vegetables, with a full admin dashboard. Customers can browse, order and track deliveries in Arabic or English without creating an account.

**[Live demo](https://albaraka-blush.vercel.app/)** · **[Backend repository](https://github.com/Ahmed-Idrisx/albaraka-backend)**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

## Features

### Storefront

- Product catalog with search, category and price filters, sorting and pagination
- Product pages with quantity selection and stock status
- Persistent cart, validated against current prices and stock
- Guest checkout with per-area delivery fees and cash on delivery
- Order tracking by order number
- Installable as a Progressive Web App

### Admin dashboard

- Sales analytics with revenue, order status and top product charts
- Order management with status and payment updates
- Product and category management with image upload
- Delivery area and pricing management
- Admin accounts, restricted to the super admin
- Store settings

### Experience

- Full Arabic (RTL) and English (LTR) support, including product content entered in both languages
- Light and dark themes
- Responsive layouts, from phone to desktop
- Inline form validation in the active language
- Custom 404 and error pages

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, next-themes, Lucide icons |
| Server state | TanStack Query, Axios |
| Client state | Zustand |
| Forms | React Hook Form, Zod |
| Internationalization | next-intl |
| Backend | Express, MongoDB, ImageKit ([separate repository](https://github.com/Ahmed-Idrisx/albaraka-backend)) |
| Deployment | Vercel |

## Getting started

### Prerequisites

- Node.js 20.9 or later
- A running instance of the [Albaraka API](https://github.com/Ahmed-Idrisx/albaraka-backend)

### Installation

```bash
git clone https://github.com/Ahmed-Idrisx/albaraka.git
cd albaraka
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```text
app/          Routes and layouts; pages stay thin and render a feature
features/     Feature code: admins, auth, cart, categories, checkout, dashboard,
              delivery-areas, home, orders, products, pwa, settings
components/   UI shared between features
lib/          API client, shared types and utilities
store/        Client-side cart store
i18n/         Language configuration and formatting helpers
messages/     Arabic and English translations
providers/    App-wide React providers
proxy.ts      Redirects visitors without a session away from the dashboard
```

## Image credits

Some product photos come from Wikimedia Commons and TheMealDB, and remain under their original licenses.

## License

The source code is released under the [MIT License](LICENSE). Product photos are not covered by it.

## Author

**Ahmed Idris** · [GitHub](https://github.com/Ahmed-Idrisx)
