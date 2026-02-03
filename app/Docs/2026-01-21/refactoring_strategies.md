# Refactoring & Simplification Strategies 🛠️

Here are specific strategies to simplify the overloaded files identified in the project.

## 1. AuthContext.tsx (High Complexity)
**Current Issue:** Mixes state management, API calls, side effects, and business logic for multiple providers (Google, Facebook, Email).

**Strategy: Split into Hooks**
Instead of one giant Provider, split logic into specialized hooks:
- `useAuthSession()`: Handles `useEffect` for session validation and listener.
- `useLogin()`: Handles login logic (Email, Google, Facebook).
- `useRegister()`: Handles sign-up logic.
- `AuthContext` only holds state, while logic lives in `src/features/auth/hooks/`.

## 2. MapView.tsx / ParkingMap.tsx
**Current Issue:** Manages map rendering, markers, geolocation, filtering logic, and UI state simultaneously.

**Strategy: Component Composition**
- Extract **Map Logic**: Create a wrapper `<LeafletMap Parkings={data} />` that assumes data is already filtered.
- Extract **Filter Logic**: Move state (`filters`, `setFilters`) to a custom hook `useParkingFilters()` (already partly done with Context).
- **Hooks**: `useUserLocation()` to handle geolocation logic separately.

## 3. UserProfile.tsx
**Current Issue:** Handles multiple tabs ("Reservas", "Favoritos", "Configuración") in one file with conditional rendering.

**Strategy: Sub-components per Tab**
Create dedicated components for each tab:
- `src/features/profile/components/tabs/BookingsTab.tsx`
- `src/features/profile/components/tabs/FavoritesTab.tsx`
- `src/features/profile/components/tabs/SettingsTab.tsx`
`UserProfile` becomes a simple shell that renders the Header and the active Tab component.

## 4. BookingProcess.tsx
**Current Issue:** Manages multi-step wizard state (Step 1, Step 2, Success) and form validation in one file.

**Strategy: Step Pattern**
- Create `BookingStep1Form`, `BookingStep2Payment`, `BookingSuccess`.
- Use a `useBookingState` hook to manage the data across steps.
- `BookingProcess` just decides which Step component to render.

## 5. General Rule: "The 200-Line Rule"
If a component exceeds 200 lines, it likely does too much.
1.  **Extract UI**: Are there big chunks of JSX? Make them dumb components (e.g., `<BookingSummaryCard />`).
2.  **Extract Logic**: Are there many `useEffect` or state handlers? Move them to a custom hook (`useBookingLogic()`).

