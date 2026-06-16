# FilingBy Frontend Architecture & Guidelines

Welcome to the **FilingBy.com** Frontend developer guide. This document details our module structure, code conventions, state flows, and scalability patterns. It is designed to guide developers of all skill levels to produce stable, clean, and professional React code.

---

## 1. Directory Structure & Modular Design

We use a **Feature-Based (Domain-Driven) Folder Architecture** to isolate business domains, improve colocation, and ensure high modularity. 

```
src/
├── main.jsx                     # Entry point (initializes Helmet, Clerk, providers)
├── App.jsx                      # Root Layout and main boundary wraps
├── index.css                    # Global design tokens and tailwind utilities
│
├── features/                    # Standalone business/domain modules
│   ├── ca-portal/               # CA Portal pages, components & data
│   │   ├── pages/               # Home, ServicePage, DigitalCard
│   │   ├── components/          # Navigation, Search, PopularServices
│   │   └── data/                # services.js, navigation.js
│   │
│   ├── client-dashboard/        # Logged-in customer CA portal workspace components
│   │
│   ├── virtual-office/          # Virtual Space Standalone Portal
│   │   ├── pages/               # VirtualSpace, Locations, VirtualOfficeCity, AboutUs, etc.
│   │   ├── components/          # VirtualOfficeNavigation
│   │   └── dashboard/           # [NEW] Client portal for virtual spaces, compliance tracking, mailbox scans & audits
│   │
│   ├── auth/                    # Verification modals & login structures
│   ├── checkout/                # Razorpay checkout modals & order generation
│   └── legal/                   # Terms and policy pages
│
├── admin/                       # Admin Control Room
│   ├── pages/                   # AdminLogin, AdminDashboard
│   ├── components/              # AdminNavbar, OrdersTable, Locations, and AdminVirtualBookings (Virtual Office bookings CRUD logs)
│   └── context/                 # AdminAuthContext
│
├── routes/                      # Routing layer
│   ├── AppRoutes.jsx            # Mapping of paths to dynamic features (including /dashboard and /virtual-office/dashboard)
│   └── RouteGuards.jsx          # Protected route checks (authenticated/admin)
│
└── shared/                      # Global reusable utilities (domain-agnostic)
    ├── components/              # SEO component, shared SVG icons
    ├── context/                 # State management Context Providers (UserContext, OrderContext, SharedDataContext, AdminContext)
    └── seo/                     # JSON-LD Schema library (schemas.js)
```

### Structuring Rules:
- **Colocation**: If a component is only used inside the `ca-portal` or `virtual-office`, it *must* live inside their respective feature components subdirectories, not in a global shared components folder.
- **Dedicated Portals Separation**: To support two completely independent customer bases, standard CA portal customers log into `/dashboard` (using `features/client-dashboard`), while Virtual Space corporate address tenants log into `/virtual-office/dashboard` (using `features/virtual-office/dashboard`). Both dashboards query separate database schemas in the backend.
- **Shared Space**: Place components in `shared/components/` *only* if they are used by more than one feature domain and have no domain-specific business logic.
- **Index Exports**: Each feature subdirectory should expose its features via an index barrel export where applicable to ensure clean importing syntax.

---

## 2. Advanced SEO Framework

Our application is a Single Page Application (SPA). Because search engine crawlers (Google, Bing) need metadata early, we utilize a two-tier SEO strategy:
1. **Fallback Base Header ([index.html](file:///d:/WEBSITE%20DEVELOPMENT/filingbycom/FRONTEND/index.html))**: Declares primary tags and the global JSON-LD `Organization` + `WebSite` schemas.
2. **Dynamic Meta Tag Injections ([SEO.jsx](file:///d:/WEBSITE%20DEVELOPMENT/filingbycom/FRONTEND/src/shared/components/SEO.jsx))**: Utilizes `<Helmet>` from `react-helmet-async` to dynamically replace page titles, meta descriptions, canonical links, Open Graph (OG), and inject specific page-level JSON-LD schemas (such as `FAQPage` and `Service` ratings).

---

## 3. Strict Coding Rules (The Senior Checklist)

To maintain a professional codebase that scales easily, all developers must adhere to the following rules:

### A. Clean Code & Type Safety
- **No Inline Calculations**: Extract complex data parsing or formatting outside the render loop (use `useMemo` or static constants, e.g. `HOME_FAQS`).
- **Use Semantic HTML**: Prefer `<main>`, `<section>`, `<article>`, and `<nav>` over generic `<div>` wrappers. Ensure interactive elements use correct buttons/anchors with descriptive `aria-label` or unique `id` values.
- **Component Size**: If a component exceeds 350 lines, split it into smaller sub-components using helper files.

### B. React Performance Optimization
- **List Keys**: Never use array index (`key={index}`) as a key if the list can be reordered, deleted, or filtered. Use unique database IDs or slug names.
- **Use Effect Cleanup**: Always return a cleanup function in `useEffect` hooks to prevent memory leaks (clear timers, remove event listeners, unsubscribe from sockets).

### C. State Management Guidelines
- **Local vs Global**: Keep state as local as possible. Raise state to parent components only when siblings need to share it.
- **Clerk Auth**: Leverage `@clerk/clerk-react` hooks (`useUser`, `useClerk`) for security-based auth actions rather than managing token states locally.

---

## 4. Scalability Roadmap

As FilingBy grows, the following patterns should be adopted:

### A. Code Splitting & Lazy Loading
As our bundle increases (currently >500 KB), wrap features in React Lazy-loaded boundaries:
```jsx
const ClientDashboard = lazy(() => import('../features/client-dashboard/pages/ClientDashboard'));
// Wrap inside <Suspense fallback={<Loader />}> in AppRoutes.jsx
```

### B. Global State (Zustand or Redux)
If user configuration, checkout options, or order states become shared across multiple domain modules, introduce **Zustand** for lightweight, non-boilerplate state stores located under `src/shared/stores/`.

### C. Pre-Rendering (SSR / SSG)
For heavy landing page performance and absolute zero-JS SEO indexing, transition the marketing pages to **Next.js** or configure **Vite Prerendering** (`vite-plugin-prerender`) during the build pipeline.
