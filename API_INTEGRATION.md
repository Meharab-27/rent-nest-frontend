# API Integration Documentation

This document maps all backend REST API endpoints consumed by the RentNest Next.js frontend application to their corresponding pages, UI components, server actions, and proxy API routes.

---

## Architecture & Authentication Flow

- **Authentication Storage**: JWT tokens (`accessToken` and `refreshToken`) are stored in secure HTTP-only cookies (`accessToken` max age 1 day, `refreshToken` max age 7 days).
- **Client & Server Integration**:
  - **Server Components & Actions**: Direct fetch calls to the backend using Server Actions (`app/(authGroup)/_actions/authActions.ts`, `app/(publicGroup)/_actions/*`, `service/getMe.ts`).
  - **Client Components**: Route handlers in `app/api/*` act as secure proxy endpoints forwarding requests to the backend with attached cookie/bearer credentials.

---

## Endpoint Mapping Table

| Method | Backend Endpoint | Frontend Component / Action / Route | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | `registerAction` in `app/(authGroup)/_actions/authActions.ts`<br/>`app/(authGroup)/register/page.tsx` | Registers a new user account (Tenant/Landlord) and automatically initiates session login. |
| **POST** | `/api/auth/login` | `loginAction` in `app/(authGroup)/_actions/authActions.ts`<br/>`app/(authGroup)/login/page.tsx` | Authenticates credentials, sets HTTP-only cookies, and redirects user to their role dashboard. |
| **POST** | `/api/auth/refresh-token` | `getNewAccessToken` & `isAccessTokenExist` in `service/refreshToken.ts` | Refreshes expired access tokens using the valid refresh token cookie. |
| **GET** | `/api/auth/me` | `getMe` in `service/getMe.ts`<br/>`app/(publicGroup)/layout.tsx`<br/>`app/(dashboardGroup)/layout.tsx` | Retrieves current authenticated user details for header profile menu and navigation permissions. |
| **GET** | `/api/categories` | `/api/categories` proxy route (`app/api/categories/route.ts`) | Fetches all available property categories for search filters and property creation forms. |
| **POST** | `/api/admin/categories` | `/api/admin-proxy` route (`app/api/admin-proxy/route.ts`) | Admin action: Creates a new property category in `AdminCategoryManager.tsx`. |
| **PATCH** | `/api/admin/users/:id` | `/api/admin-proxy` route (`app/api/admin-proxy/route.ts`) | Admin action: Updates user roles or account status (Active/Blocked) in `AdminUserTable.tsx`. |
| **GET** | `/api/properties` | `/api/properties` proxy route (`app/api/properties/route.ts`) | Searches and filters property listings by category, location, and price. |
| **GET** | `/api/properties/:id` | `app/(publicGroup)/properties/[id]/page.tsx` | Fetches complete details, amenities, landlord info, and images for a specific property. |
| **POST** | `/api/landlord/properties` | `/api/landlord-proxy` route (`app/api/landlord-proxy/route.ts`) | Landlord action: Submits a new rental property listing via `AddPropertyModal.tsx`. |
| **PUT** | `/api/landlord/properties/:id` | `/api/landlord-proxy` route (`app/api/landlord-proxy/route.ts`) | Landlord action: Updates an existing property listing via `AddPropertyModal.tsx`. |
| **DELETE** | `/api/landlord/properties/:id` | `/api/landlord-proxy` route (`app/api/landlord-proxy/route.ts`) | Landlord action: Deletes a property listing via `LandlordPropertyActions.tsx`. |
| **PATCH** | `/api/landlord/requests/:id` | `/api/landlord-proxy` route (`app/api/landlord-proxy/route.ts`) | Landlord action: Accepts or rejects rental applications in `LandlordRequestTable.tsx`. |
| **POST** | `/api/rentals` | `/api/rentals-proxy` route (`app/api/rentals-proxy/route.ts`) | Tenant action: Submits a rental booking request in `RentalRequestModal.tsx`. |
| **POST** | `/api/payments/create` | `/api/payments-proxy` route (`app/api/payments-proxy/route.ts`) | Tenant action: Generates a payment session link via `TenantCheckoutButton.tsx`. |
| **POST** | `/api/payments/confirm` | `/api/payments-proxy` route (`app/api/payments-proxy/route.ts`) | Confirms payment transaction status upon redirect completion. |
| **POST** | `/api/subscription/checkout` | `subscribePremium` in `app/(publicGroup)/_actions/subscribePremium.ts` | Redirects user to payment gateway for premium subscription. |
| **GET** | `/api/subscription/status` | `getSubscriptionStatus` in `app/(publicGroup)/_actions/getSubscriptionStatus.ts` | Checks current premium membership status of the logged-in user. |
| **GET** | `/api/premium` | `getPremiumNews` in `app/(publicGroup)/_actions/getPremiumNews.ts` | Fetches exclusive premium property listings and news articles for active subscribers. |

---

## Error Handling & Feedback Strategy

All API integrations follow a multi-tier error feedback architecture:
1. **Toast Notifications (`sonner`)**: Instant floating alert messages for asynchronous actions (form submits, status toggles, deletion prompts).
2. **Inline Form Alerts**: Field validation and error banners directly inside forms for immediate correction.
3. **Route Error Boundaries (`error.tsx`)**: High-level fallback UI with interactive retry (`Try Again`) capabilities if page data fetching or server rendering fails.
