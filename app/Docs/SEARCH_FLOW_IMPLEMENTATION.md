# Home Page → MapView Filter Flow Implementation

## Summary
Implemented a complete search flow where users can enter parking search parameters on the Home page, and these automatically populate in the MapView filters without using URL query parameters.

## Changes Made

### 1. Home.tsx (`src/pages/Home.tsx`)

**Imports Added:**
```tsx
import { useFilters } from '../context/FilterContext';
```

**Hook Usage:**
```tsx
const { setDateTimeFilters } = useFilters();
```

**Form State Enhancement:**
- Added validation state: `isSearchDisabled` 
- Checks if all required fields (date, startTime, endTime) are filled
- Shows disabled state on search button until complete

**Enhancements to handleSearch:**
```tsx
const handleSearch = () => {
  // 1. Save to FilterContext
  setDateTimeFilters({
    startDate: searchData.date,
    startTime: searchData.startTime,
    endDate: searchData.date,
    endTime: searchData.endTime,
  });
  
  // 2. Navigate to map
  onNavigate('map', searchData);
};
```

**Input Validations Added:**

1. **Date Input** - Minimum date set to today:
   ```tsx
   min={new Date().toISOString().split('T')[0]}
   ```

2. **End Time Input** - Cannot be before start time:
   ```tsx
   onChange={(e) => {
     if (searchData.startTime && e.target.value < searchData.startTime) {
       return; // Ignore invalid times
     }
     setSearchData({ ...searchData, endTime: e.target.value });
   }}
   min={searchData.startTime || '00:00'}
   ```

3. **Search Button** - Disabled state:
   ```tsx
   disabled={isSearchDisabled}
   ```
   - Shows "Completa todos los campos" when incomplete
   - Shows "Buscar aparcamiento" when ready

## How It Works

### Flow Diagram
```
Home Page
  ↓
User fills date/time inputs
  ↓
User clicks "Search parking"
  ↓
setDateTimeFilters() saves to FilterContext
  ↓
onNavigate('map', searchData) navigates to MapView
  ↓
MapView loads with FilterContext already populated
  ↓
FilterDrawer & FilterSidebar show pre-filled dates/times
```

### Step-by-Step Behavior

1. **User on Home Page**
   - All three time inputs are empty
   - Search button is disabled ("Completa todos los campos")

2. **User Fills Search Form**
   - Selects start date (today or future only)
   - Selects start time
   - Selects end time (cannot be before start time)
   - Search button becomes enabled

3. **User Clicks Search**
   - Values saved to FilterContext via `setDateTimeFilters()`
   - App navigates to `/map`

4. **MapView Loads**
   - FilterContext already has datetime values
   - FilterDrawer shows the populated dates/times
   - FilterSidebar shows the populated dates/times
   - All other filters at default (all parking types selected)

## File Modifications

| File | Changes |
|------|---------|
| `src/pages/Home.tsx` | Added FilterContext integration, validation, disabled state |
| `src/context/FilterContext.tsx` | ❌ No changes (existing API used) |
| `src/components/features/MapView.tsx` | ❌ No changes (already has the logic) |
| `src/components/features/FilterDrawer.tsx` | ❌ No changes (already displays FilterContext values) |
| `src/components/features/FilterSidebar.tsx` | ❌ No changes (already displays FilterContext values) |

## Constraints Met

✅ **No FilterContext API modifications** - Used existing `setDateTimeFilters()` method
✅ **Follows folder structure** - Only modified existing Home.tsx file
✅ **Uses existing Input components** - Same components as FilterDrawer/Sidebar
✅ **Simple and consistent** - Minimal changes, uses existing patterns
✅ **No query params** - Uses FilterContext entirely

## Optional Features Implemented

✅ **Disable search button when incomplete** - Shows helpful message
✅ **End date/time validation** - Cannot be before start date/time
✅ **Minimum date restriction** - Cannot select past dates
✅ **Min time restriction** - End time min = start time

## Testing Checklist

- [ ] Home page loads with empty search form
- [ ] Search button is disabled until all fields filled
- [ ] Date input won't allow past dates
- [ ] End time input won't allow times before start time
- [ ] Clicking search navigates to `/map`
- [ ] FilterDrawer shows the selected dates/times
- [ ] FilterSidebar shows the selected dates/times
- [ ] Other filters remain at defaults
- [ ] Clearing filters on map resets to all types selected
- [ ] Can perform another search from home with new dates

## Build Status
✅ **Build Successful** - All changes compile without errors
- JS: 461.37 KB (129.80 KB gzip)
- CSS: 78.00 KB (16 KB gzip)
