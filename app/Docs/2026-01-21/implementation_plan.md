# Implementation Plan - React Router Migration 🛣️

## Goal
Replace the manual state-based routing system with `react-router-dom` to enable proper URL navigation, history management, and deep linking.

## User Review Required
> [!IMPORTANT]
> This is a structural change. The `App` component will no longer manage `currentPage` state. Pages will independently handle navigation.

## Proposed Changes

### Core
#### [NEW] [routes.tsx](file:///root/TFG/app/src/core/router/routes.tsx)
- Define `createBrowserRouter` configuration.
- Map paths (`/login`, `/home`, `/booking/:id`) to Pages.
- Implement Protected Routes logic (redirect if not logged in).

### App Entry Point
#### [MODIFY] [App.tsx](file:///root/TFG/app/src/App.tsx)
- Remove `currentPage` and `navigationData` state.
- Remove `switch(currentPage)` logic.
- Render `<Outlet />` for child routes.
- Maintain `FilterProvider` and `AuthProvider` wrappers.
- Maintain global `AuthCallback` logic (redirecting logged in users).

#### [MODIFY] [main.tsx](file:///root/TFG/app/src/main.tsx)
- Wrap application in `<RouterProvider router={router} />`.

### Pages
Refactor all pages to remove `onNavigate` prop and use `useNavigate()` hook.

#### [MODIFY] [LoginPage.tsx](file:///root/TFG/app/src/pages/auth/LoginPage.tsx)
#### [MODIFY] [SignUpPage.tsx](file:///root/TFG/app/src/pages/auth/SignUpPage.tsx)
#### [MODIFY] [HomePage.tsx](file:///root/TFG/app/src/pages/home/HomePage.tsx)
#### [MODIFY] [UserProfile.tsx](file:///root/TFG/app/src/features/profile/components/UserProfile.tsx)
#### [MODIFY] [OwnerProfile.tsx](file:///root/TFG/app/src/features/profile/components/OwnerProfile.tsx)
#### [MODIFY] [BookingProcess.tsx](file:///root/TFG/app/src/features/booking/components/BookingProcess.tsx)
#### [MODIFY] [MapViewPage.tsx](file:///root/TFG/app/src/pages/parking/MapViewPage.tsx)
#### [MODIFY] [ParkingDetailPage.tsx](file:///root/TFG/app/src/pages/parking/ParkingDetailPage.tsx)

## Verification Plan

### Manual Verification
1.  **Navigation Flow**: Click through Home -> Map -> Detail -> Booking. Verify URL changes at each step.
2.  **Browser History**: Use Back/Forward buttons. Verify state is preserved.
3.  **Deep Linking**: Refresh page on `/booking/123`. Verify it loads the booking page directly.
4.  **Auth Protection**: Try accessing `/profile` while logged out. Verify redirect to login.
