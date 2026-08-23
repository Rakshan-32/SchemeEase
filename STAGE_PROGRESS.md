# Stage 4 Progress — Profile Page & Completion Score

## Context
This is part of a 5-stage profile system overhaul.  
Stages 1–3 (profileSchema, ProfileForm, ProfileSetup wizard) are fully committed.

---

## Stage 4 Items

### Item 7 — Dedicated Profile Page (Dashboard → "My Profile" tab)

**Layer 1** — ProfilePage header (avatar, name, occupation, location, completion ring placeholder)  
Status: **DONE** — committed in `feat(s3): step 4 review summary + read-only ProfilePage`

**Layer 2** — 4 read-only section cards (Personal, Occupation, Economic & Community, Additional Details)  
Status: **DONE** — committed in same commit above (`feat(s3)` message is misleading; it actually shipped s4 Layer 2)

**Layer 3** — Inline per-card editing + Update Recommendations  
Spec:
- Pencil icon on each section card → expands card into scoped `ProfileForm`
- Personal card → ProfileForm section=1 (basic fields)
- Occupation card AND Economic & Community card → ProfileForm section=2 (occupation + secondaryIdentities)
- Additional Details card → ProfileForm section=3 (additional groups)
- Save → calls `onUpdate(draftProfile)` → persists to localStorage → auto-triggers scheme re-fetch (Dashboard useEffect([profile]))
- "Update Recommendations" button → also calls `onRefreshSchemes()` which re-runs analyzeProfile and switches Dashboard to recommendations tab
- Cancel → discards in-progress changes, restores read-only view
- Only one section editable at a time

Status: **IN PROGRESS**

**Layer 3 wiring notes:**
- `ProfilePage` props: `profile`, `onUpdate`, `onRefreshSchemes`, `darkMode`, `language`
- `onRefreshSchemes` is passed from Dashboard as `() => { fetchSchemes(); setActiveTab('recommendations'); }`
- Dashboard no longer needs `isEditingProfile` state or the full-page `ProfileEditor` toggle; inline edit lives entirely inside `ProfilePage`
- The exported `ProfileEditor` component in `sections.jsx` can remain for now (it was the prior approach)

### Item 8 — Completion Score (real logic, not placeholder)

Status: **NOT STARTED**

Current placeholder in `ProfilePage.jsx`:
```js
const completionPct = (profile) =>
  Math.round(Math.min(Object.keys(profile).length / 20, 1) * 100);
```
This just counts keys. Real implementation should score based on which fields are filled
relative to a weighted set of meaningful fields (not raw key count).

---

## Key Files

| File | Role |
|------|------|
| `frontend/src/ProfilePage.jsx` | Read-only + inline edit UI (Layer 2 + Layer 3) |
| `frontend/src/ProfileForm.jsx` | Shared form renderer, used by both ProfileSetup and ProfilePage inline edit |
| `frontend/src/profileSchema.js` | `SECTIONS`, `SECTION_BY_STEP`, `clearFieldsFor` |
| `frontend/src/sections.jsx` | Dashboard — hosts profile tab, passes `onRefreshSchemes` |
| `frontend/src/App.jsx` | `handleUpdateProfile` — saves to localStorage + triggers re-fetch via `setProfile` |
