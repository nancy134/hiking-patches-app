# Test Plan: Auto-set Overall Patch Status to "In Progress"

## Background

When a user logs a mountain ascent or trail progress on a patch, the app now automatically sets the Overall Patch Status to "In Progress" (if it isn't already in a meaningful state). This test plan verifies that behavior and checks for regressions.

## Setup

- Use a patch that has at least one mountain **and** at least one trail.
- Test with a user account that has no prior progress on the patch (clean slate). You can clear state via the "Clear" button in the Overall Patch Status editor.

---

## 1. Auto-set to "In Progress" — first mountain logged

| Step | Expected result |
|---|---|
| Load the patch detail page with no prior progress | Overall Patch Status shows "Not started" |
| Open Ascent Log for any mountain and save a date | Overall Patch Status chip updates to **In Progress** without a page refresh |
| Reload the page | Status is still "In Progress" (persisted in DB) |

---

## 2. Auto-set to "In Progress" — first trail logged

| Step | Expected result |
|---|---|
| Clear patch progress back to "Not started" | Overall Patch Status shows "Not started" |
| Open Log Progress for any trail and save (miles remaining or date completed) | Overall Patch Status chip updates to **In Progress** without a page refresh |
| Reload the page | Status is still "In Progress" |

---

## 3. Wishlisted → "In Progress" upgrade

| Step | Expected result |
|---|---|
| Manually set Overall Patch Status to "Not started" with Wishlist checked, save | Chip shows "Not started" + Wishlisted badge |
| Log a mountain or trail | Status chip updates to **In Progress**; Wishlisted badge remains |
| Reload | Both "In Progress" and Wishlisted are persisted |

---

## 4. "In Progress" is not duplicated or reset

| Step | Expected result |
|---|---|
| Patch is already "In Progress" (from prior test) | Status shows "In Progress" |
| Log another mountain or trail | Status remains "In Progress" (no flicker to "Not started" and back) |

---

## 5. "Completed" status is not overwritten

| Step | Expected result |
|---|---|
| Manually mark the patch as "Completed" with a date | Status shows "Completed" |
| Log an additional mountain ascent | Status remains **Completed** — `ensureUserPatchInProgress` must not overwrite it |
| Reload | Still "Completed" |

---

## 6. Progress percentage also refreshes

| Step | Expected result |
|---|---|
| Log a new mountain on a patch with structured progress | Both the Overall Patch Status chip **and** the `X% complete` chip update after saving |

---

## 7. Removing the only ascent (no regression)

| Step | Expected result |
|---|---|
| Open Ascent Log for a mountain that has one date, remove the date, save | Overall Patch Status does **not** auto-clear back to "Not started" (clearing status is a manual action only) |

---

## 8. Trail-only and mountain-only patches

| Step | Expected result |
|---|---|
| On a patch with only trails (no peaks), log a trail | Status auto-sets to "In Progress" |
| On a patch with only mountains (no trails), log a mountain | Status auto-sets to "In Progress" |

---

## Edge Cases

- **Not logged in:** Mountain and trail tables render read-only; no status chip appears — verify no JS errors.
- **Page load with existing progress:** Overall Patch Status reflects DB state immediately on load (no regression from the `useCallback` refactor).
- **Rapid saves:** Log two mountains quickly back to back — confirm the status chip doesn't flicker or show stale state.
