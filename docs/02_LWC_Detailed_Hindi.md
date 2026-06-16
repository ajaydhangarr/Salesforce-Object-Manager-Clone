# LWC Components Detailed Explanation (Hindi)

Is file me `force-app/main/default/lwc` ke sab components cover kiye gaye hain.

> Note: chhote files ke liye near line-by-line explanation diya gaya hai; bahut bade files (`sectionFields.js/html`) ko **logical line ranges** me explain kiya gaya hai taaki beginner ko samajhna easy rahe.

---

## Component: `metadataService`

### Purpose
- Shared helper jo section metadata fetch karta hai.
- `sectionPlaceholder` ko direct Apex import se bachata hai.

### File: `metadataService.js`
- `import getSectionData ...`  
  Apex method import.
- `loadSectionData(sectionId, objectName)`  
  Async wrapper function.
- `try` block  
  successful Apex response return.
- `catch` block  
  error log + safe fallback message object return.

### File: `metadataService.js-meta.xml`
- `apiVersion` = metadata API level.
- `isExposed=false` kyunki ye standalone UI component nahi, helper module hai.

---

## Component: `objectDropdown`

### Component Purpose
- Object picker dropdown.
- Search by label/API/type.
- Parent ko selected object ka event deta hai (`objectselect`).

### HTML File Explanation (`objectDropdown.html`)
- outer `div.dropdown-container`: full dropdown wrapper.
- header button:
  - selected object label show
  - type pill show
  - arrow icon rotate state
- `template if:true={isOpen}`:
  - search input box
  - filtered object list buttons
  - no data message
- `onclick={selectObject}` list item click par selected object choose hota hai.

Tag remove impact examples:
- search input hata diya -> dropdown searchable nahi rahega.
- `data-name={obj.apiName}` hata diya -> selected object identify nahi hoga.

### JavaScript Line-Wise (logical order)
- imports:
  - `LightningElement, api, wire`
  - Apex `getAllObjects`
- state vars:
  - `allObjects`, `filteredObjects`, `isOpen`, selected label values
- `@api selectedObjectApiName`, `@api selectedObjectLabel`:
  - parent se value receive
  - setter me `syncSelectedDisplay()` call
- computed getters:
  - `hasFilteredObjects`, `hasSelection`, `dropdownArrowClass`
- lifecycle:
  - `connectedCallback` document click listener attach
  - `disconnectedCallback` listener remove
- `@wire(getAllObjects)`:
  - data load -> arrays fill
  - error -> console log
- handlers:
  - `toggleDropdown`
  - `handleSearch` (client-side filter)
  - `selectObject` (event dispatch to parent)
  - `handleDocumentClick` outside click close
  - `stopPropagation`
- helper:
  - `setSelection`
  - `syncSelectedDisplay`

### CSS Explanation (`objectDropdown.css`)
- `.dropdown-body` absolute + high z-index for overlay.
- `.object-item` grid-based row layout.
- `.type-pill` rounded badge style.
- `.dropdown-arrow--open` rotates arrow.

---

## Component: `objectManagerApp` (Root App)

### Component Purpose
- Main container/orchestrator.
- Object list browser + selected-object sections.
- Global search + section switching.

### HTML File Explanation (`objectManagerApp.html`)
- header 3 parts:
  - left: `<c-object-dropdown>`
  - center: global search input + results dropdown
  - right: browse/create buttons
- body area:
  - if object selected -> sidebar sections + content panel
  - else -> object browser table
- content panel dynamic:
  - details -> `c-section-details`
  - fields -> `c-section-fields`
  - record types -> `c-section-record-types`
  - rest -> `c-section-placeholder`

Critical bindings:
- `onobjectselect={handleObjectSelect}`
- global search `oninput={handleGlobalSearchInput}`
- search result click `onclick={handleSearchResultSelect}`
- section click `onclick={handleSectionClick}`

### JavaScript Breakdown (`objectManagerApp.js`)
Key line groups:
- constants:
  - `SECTIONS` sidebar items
  - `GLOBAL_SEARCH_DEBOUNCE_MS = 300`
- core state:
  - `allObjects`, `selectedObject`, `activeSection`
  - global search states/results/errors
  - request token + timeout handles
- `@wire(getAllObjects)` object preload.
- computed getters:
  - selection and visibility getters
  - filtered object rows
  - normalized global search results
- actions:
  - `handleCreate()` opens standard new object setup.
  - `handleSectionClick()`
  - `handleObjectSelect()/handleObjectRowSelect()`
  - `handleBackToObjects()`
- global search logic:
  - min length check (`>=2`)
  - debounce
  - imperative Apex `searchMetadata({ keyword })`
  - stale request protection via `latestGlobalSearchRequest`
- cleanup:
  - `clearGlobalSearchTimeout()`
  - `cancelPendingGlobalSearch()`
  - outside click reset

### CSS Explanation (`objectManagerApp.css`)
- shell layout, sidebar, content panel, table styles.
- global search dropdown absolute positioning.
- responsive media queries (1024px, 768px).

### Meta + Test
- `objectManagerApp.js-meta.xml`: exposed app page target.
- `__tests__/objectManagerApp.test.js`:
  - global search result select ke baad dropdown sync verify karta hai.

---

## Component: `sectionDetails`

### Component Purpose
- Selected object ka summary/details show karta hai.

### HTML (`sectionDetails.html`)
- header (title + objectName)
- details grid 2-column cards with key-value rows

### JS (`sectionDetails.js`)
- `@api objectName` setter reset state.
- `@wire(getObjectDetails...)` server fetch.
- `detailRows` getter labels banata hai.
- `detailColumns` UI split (left/right).
- `formatBoolean` helper.

### CSS (`sectionDetails.css`)
- simple card/grid style.
- mobile par single column via media query.

### Meta + Test
- `sectionDetails.js-meta.xml` non-exposed.
- `__tests__/sectionDetails.test.js` placeholder test scaffold.

---

## Component: `sectionObjectLimits`

### Component Purpose
- Object limits metrics show karta hai.

### HTML
- header + card rows.

### JS
- `@api objectName`
- `@wire(getObjectLimits...)`
- `limitRows` getter labels map karta hai.

### CSS
- rows with label/value grid.

### Meta
- exposed true.

---

## Component: `sectionRecordTypes`

### Component Purpose
- Object ke record types listing.

### HTML
- table with name, developer name, active/default.
- record type URL links new tab me open.

### JS
- `@api objectName` reset state
- `@wire(getRecordTypes...)`
- getters:
  - `hasRecordTypes`
  - `recordTypeCountLabel`
  - `normalizedRecordTypes` (Yes/No labels + URL)

### CSS
- standard section card + table + count badge.

### Meta
- exposed true.

---

## Component: `sectionPlaceholder`

### Component Purpose
- Generic reusable section renderer.
- Different metadata sections ko table/message form me show karta hai.

### HTML
- common header.
- conditional blocks:
  - loading message
  - data table
  - message panel
  - error panel
- table headers/rows runtime data se build hote hain.

### JS
- imports `loadSectionData` from service layer.
- `@api objectName`, `@api sectionId`, `@api sectionLabel`.
- data shape handling getters:
  - `hasDataTable`, `hasMessage`, `tableColumns`, `tableRows`
- link generation:
  - `buildCellHref()`
  - `getFieldUrl()`
  - `getSectionBaseUrl()`
- `loadData()` async call:
  - loading state
  - success/error state control

### CSS
- common section/table styles.
- link styles and message card styles.

### Meta
- exposed true.

---

## Component: `sectionFields` (Most Important)

### Component Purpose
- Fields & Relationships screen ka major logic.
- features:
  - field list with search/type filter
  - edit/open in new tab
  - custom field delete with confirm
  - manual bulk create modal
  - CSV bulk create modal
  - validation + error display + refresh

### HTML File Explanation (`sectionFields.html`)

Main blocks:
1. Header + tools
   - add fields menu (manual/csv)
   - search input
   - data type filter combobox
2. Fields table
   - label/api/type links
   - action menu edit/delete
3. Manual modal
   - editable multi-row grid
   - dynamic controls based on field type
   - review mode before create
4. CSV modal
   - file upload
   - parse errors display
   - preview table + validation

Important events:
- `onselect={handleBulkMenuSelect}`
- `oninput={handleSearch}`
- `onchange={handleDataTypeChange}`
- `onselect={handleFieldAction}`
- modal controls: `saveManualRows`, `confirmManualRows`, `saveCsvRows`

### JavaScript File Deep Walkthrough (`sectionFields.js`)

#### A) Constants and Type System (approx lines 1-214)
- field type definitions (`FIELD_TYPE_OPTIONS`)
- aliases for type normalization (`FIELD_TYPE_ALIASES`)
- data type labels and canonical mappings
- default row schema (`DEFAULT_MANUAL_ROW`)

Kyun:
- UI aur backend payload me type consistency chahiye.
- same type ki multiple spellings ko normalize karna hota hai.

#### B) Reactive State and API Inputs (approx lines 215-417)
- object context
- search/filter state
- modal state
- manual/csv rows
- save/loading flags
- `@api objectName`, `@api initialSearchTerm`

#### C) Grid, Filter, and View Models (approx lines 270-417)
- `dataTypeOptions`: duplicate-free filter options
- `filteredFields`: search + datatype filter + computed labels/URLs
- `manualRowsView`, `manualReviewRowsView`, `csvRowsView`

#### D) Field Action Events (approx lines 418-531)
- `handleFieldAction`:
  - edit: durable/custom id se setup URL open in `_blank`
  - delete: confirm dialog + custom-only guard
- `handleDeleteField`:
  - imperative Apex `deleteField`
  - toast
  - `refreshApex` in `finally` (har delete ke baad refresh)

#### E) Manual Bulk Modal Logic (approx lines 535-756)
- modal open/close/reset
- dynamic row add/copy/edit
- auto API name generation
- review mode
- confirm create flow

#### F) CSV Parsing and Validation (approx lines 757-1218)
- file text read
- CSV line parser (quote handling सहित)
- header mapping
- row normalization
- data type specific defaults
- validation aggregation

#### G) Validation Engine (approx lines 1219-1295)
- picklist required rules
- length/precision/scale checks
- externalId/unique type constraints

#### H) Utilities and Wire (approx lines 1296-end)
- type normalization utilities
- durableId token extraction
- customFieldId preference for custom navigation/edit
- toasts + error reducer
- `@wire(getObjectFields)` data hydrate + transform

### CSS Explanation (`sectionFields.css`)
- header tools alignment
- table visuals + badges
- modal sizing (`manual-modal`, `csv-modal`)
- inline pair controls for precision/scale etc
- validation colors (`csv-validation_ok`, `_error`)
- responsive behavior on smaller screens

### Meta
- `sectionFields.js-meta.xml`: exposed true.

### Tests
- `sectionFields/__tests__` folder currently empty (test gap).

---

## Supporting File: `lwc/jsconfig.json`

Purpose:
- editor tooling + module resolution config.
- `c/*` alias mapping set karta hai.
- jest typings include karta hai.

Agar ye file na ho:
- IDE auto-import/intellisense weak ho jayega.
- dev experience खराब ho jayega.

---

## SECTION 9 — Event Handling (LWC side)

### Button Clicks
- Add Fields menu -> `handleBulkMenuSelect`
- Edit/Delete menu -> `handleFieldAction`
- Create Object -> `handleCreate`
- Browse Objects -> `handleBackToObjects`

### Form Submit Type Events
- Manual modal save -> `saveManualRows` / `confirmManualRows`
- CSV create -> `saveCsvRows`

### Search Inputs
- object browser search -> `handleBrowseSearch`
- global search -> `handleGlobalSearchInput`
- field search -> `handleSearch`
- dropdown search -> `objectDropdown.handleSearch`

### Bulk Action Events
- manual row change -> `handleManualCellChange`
- CSV upload -> `handleCsvFileChange`
