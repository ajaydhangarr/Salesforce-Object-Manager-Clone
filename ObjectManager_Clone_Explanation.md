 # Object Manager Clone - Beginner Guide

Yeh document current workspace ke `lwc` aur `classes` folder ke saare relevant files ka simple Hindi me explanation hai.

## Section 1 - Project Overview

Yeh project Salesforce ke **Object Manager** ka ek clone hai. Simple shabdon me, yeh app aapko ek Salesforce object choose karne deti hai, phir us object ke details, fields, record types, limits aur kuch metadata sections dikhati hai.

### Yeh project kya karta hai

- Pehle objects ki list fetch hoti hai.
- User object choose karta hai.
- Phir side menu me different metadata sections dikhte hain.
- Kuch sections direct describe data se aate hain, aur kuch sections Apex + Metadata API callout se aate hain.
- `Fields & Relationships` section me naye custom fields create karne ka flow bhi hai.

### Object Manager clone kaise kaam karta hai

Real Salesforce Setup ke Object Manager me jaise object select karke uski fields, record types, layouts aur limits dekhte ho, waise hi yeh app same feel banati hai.

Yahan flow kuch is tarah hai:

1. LWC object list load karta hai.
2. User object select karta hai.
3. Selected object ke hisaab se section render hota hai.
4. LWC Apex ko call karta hai.
5. Apex describe data, Tooling API, ya UI API se metadata lata hai.
6. Response UI me table, cards, ya message ke roop me dikhta hai.

### Real-world use

Is app ka use in situations me hota hai:

- Admin ko object details quickly dekhni ho.
- Developer ko fields aur record types inspect karne ho.
- Custom field bulk me create karne ho.
- Metadata samajhkar org ka structure analyze karna ho.

Ek real-life example:

Socho aap ek building ke manager ho. `Object` building hai, `Fields` rooms hain, `Record Types` building ke different rules hain, aur `Layouts` room arrangement hai. Yeh app aapko yeh sab ek dashboard me dikhati hai.

### Technologies kyun use hui hain

#### LWC

LWC frontend UI ke liye use hua hai.

- Fast aur modern UI deta hai.
- Component-based design deta hai.
- Parent-child communication easy hoti hai.
- Salesforce Lightning me native fit hota hai.

#### Apex

Apex backend logic ke liye use hua hai.

- Salesforce describe data nikalne ke liye.
- Tooling API aur UI API callout karne ke liye.
- Custom field create karne ke liye.
- Complex metadata logic handle karne ke liye.

#### Salesforce Metadata

Metadata ka matlab hai org ka structure:

- Objects
- Fields
- Record Types
- Layouts
- Field Sets
- Lookup Filters

Yeh project metadata isliye use karta hai kyunki Object Manager ka main kaam hi org structure dikhana aur manage karna hai.

### Agar ye technologies use na karte to problem

- LWC ke bina UI purana aur scattered lagta.
- Apex ke bina backend se metadata lana mushkil hota.
- Metadata APIs ke bina aap sirf normal data dekhte, org structure nahi.
- Manual hardcoded screen banani padti, jo scalable nahi hoti.

## Section 2 - Folder Structure Explanation

### ASCII Tree

```text
force-app/main/default/
├── lwc/
│   ├── objectManagerApp/
│   ├── objectDropdown/
│   ├── sectionDetails/
│   ├── sectionFields/
│   ├── sectionObjectLimits/
│   ├── sectionPlaceholder/
│   ├── sectionRecordTypes/
│   ├── metadataService/
│   ├── objectManagerApp/__tests__/
│   ├── objectDropdown/__tests__/
│   ├── sectionDetails/__tests__/
│   └── jsconfig.json
└── classes/
    └── ObjectManagerController.cls
```

### `lwc` folder ka role

`lwc` folder me saare Lightning Web Components hote hain. Yahin se frontend UI banta hai.

- Har component ka apna HTML, JS, CSS aur metadata file hota hai.
- Parent component baaki child components ko use karta hai.
- Ye folder UI architecture ko clean rakhta hai.

### `classes` folder ka role

`classes` folder me Apex backend logic hota hai.

- Yahan se object/field/record type data aata hai.
- Yahan Metadata API callout ka logic hota hai.
- Yahin bulk custom field creation hoti hai.

### Har sub-folder ka role

- `objectManagerApp/` - main app shell aur page orchestration.
- `objectDropdown/` - object choose karne ka dropdown.
- `sectionDetails/` - object details card.
- `sectionFields/` - fields list aur field creation UI.
- `sectionObjectLimits/` - object limits display.
- `sectionPlaceholder/` - baaki sections ke liye generic metadata viewer.
- `sectionRecordTypes/` - record types list.
- `metadataService/` - helper module jo placeholder section ke liye Apex call wrap karta hai.
- `__tests__/` - automated unit tests.
- `jsconfig.json` - import alias aur LWC tooling config.

### Ye folders kyun banaye gaye

- Alag responsibility alag folder me rakhne ke liye.
- Code reuse ke liye.
- Testing easy banane ke liye.
- Maintenance simple rakhne ke liye.

### Agar ye folders nahi hote to problem

- Sab logic ek hi file me jam jata.
- UI aur backend mix ho jata.
- Debugging mushkil hoti.
- New section add karna aur hard ho jata.

## Section 3 - LWC Components Full Explanation

### Component Name: `objectManagerApp`

#### 1. Component Purpose

Yeh pura app ka main controller hai. Iska kaam hai:

- objects ki list load karna
- selected object ko track karna
- global search chalana
- section switch karna
- child components ko data dena

Ye component UI me top header, search bar, object browser aur selected section area sab control karta hai.

#### 2. HTML File Explanation

`objectManagerApp.html` me 2 major modes hain:

- `hasSelectedObject = false` ho to object browser table dikhta hai.
- `hasSelectedObject = true` ho to section sidebar aur content panel dikhta hai.

Important tags:

- `<c-object-dropdown>` - object chooser render karta hai. Isko selected object label/api name props milte hain.
- `<input class="global-search-input">` - global field search ke liye.
- `<template if:true={showGlobalSearchDropdown}>` - search results dropdown tab hi dikhata hai jab search valid ho.
- `<template for:each={normalizedGlobalSearchResults}>` - har search result ka button banata hai.
- `<lightning-button>` - `Browse Objects` aur `Create Object` actions.
- `<ul class="section-list">` - sidebar sections list.
- `<c-section-details>`, `<c-section-fields>`, `<c-section-record-types>`, `<c-section-placeholder>` - selected section ke hisaab se actual content render hota hai.
- `<table class="object-list-view">` - browse view me object rows dikhata hai.

Agar `template if:true/if:false` hata do to UI ek hi mode me atak sakta hai. Agar `onclick` handlers hata do to click par state change nahi hoga.

#### 3. JavaScript File Explanation

**Imports aur constants**

- `LightningElement, wire` import kiya gaya hai, kyunki ye component base class aur Apex wire use karta hai.
- `getAllObjects` Apex import hai, jo objects ki list lata hai.
- `searchMetadata` Apex import hai, jo global search chalata hai.
- `SECTIONS` constant sidebar me dikhne wale sections ka master list hai.
- `GLOBAL_SEARCH_DEBOUNCE_MS = 300` search ke server calls ko slow typing me control karta hai.

**Class properties**

- `allObjects` - Apex se aaye sab objects.
- `objectBrowserSearch` - browse table ka local filter.
- `selectedObject` - currently open object ka API name.
- `selectedObjectLabel` - visible label.
- `activeSection` - sidebar me kaunsa section open hai.
- `globalSearchTerm` - top search box ka text.
- `globalSearchResults` - server search results.
- `globalSearchError` - search fail ho to message.
- `fieldSearchTerm` - fields section me prefilled filter.
- `globalSearchTimeout` - debounce timer.
- `latestGlobalSearchRequest` - stale responses ko ignore karne ke liye counter.
- `handleDocumentClickBound` - outside click handler ko stable reference se bind karta hai.

**Lifecycle**

- `connectedCallback()` document click listener add karta hai.
- `disconnectedCallback()` listener remove karta hai aur pending timer clear karta hai.

**Wire**

- `@wire(getAllObjects)` page load par objects laata hai.
- Success me `allObjects` update hota hai.
- Error me console me log hota hai.

**Getters**

- `hasSelectedObject` - object selected hai ya nahi.
- `hasObjects` - filtered browser list me data hai ya nahi.
- `objectCountLabel` - `n objects` type badge text.
- `appShellClass` - browser aur selected state ke alag CSS classes.
- `hasGlobalSearchResults` - normalized results ke basis par dropdown control.
- `normalizedGlobalSearchResults` - raw Apex result ko object label/apiName ke saath merge karta hai.
- `showGlobalSearchDropdown` - 2+ characters aur open state ho tab dropdown show hota hai.
- `filteredObjectRows` - local search ke basis par object table filter hoti hai.
- `computedSections` - sidebar items ko active class deta hai.
- `activeSectionLabel` - current section ka readable label.
- `isDetailsSection`, `isFieldsSection`, `isRecordTypesSection`, `isPlaceholderSection` - conditional section rendering ke flags.
- `isGlobalSearchOpen` - valid search term aur results/error hone par dropdown open hota hai.

**Handlers**

- `handleCreate()` direct Salesforce Object Manager new page open karta hai.
- `handleSectionClick()` sidebar selection change karta hai.
- `handleObjectSelect()` dropdown se object choose hone par selected object set karta hai.
- `handleBrowseSearch()` browse filter update karta hai.
- `handleObjectRowSelect()` table row click par object select karta hai.
- `handleBackToObjects()` object detail view se browser view me wapas le jata hai.
- `handleGlobalSearchInput()` debounce ke saath server search chalata hai.
- `handleSearchResultSelect()` result click par object aur field dono choose karta hai.
- `handleDocumentClick()` outside click par global search band karta hai.
- `stopPropagation()` dropdown/search box click ko page se bahar jaane se rokta hai.

**Helper methods**

- `getObjectLabel()` API name se label nikalta hai.
- `clearGlobalSearchTimeout()` pending timer remove karta hai.
- `cancelPendingGlobalSearch()` stale search ko invalidate karta hai.

#### 4. CSS File Explanation

- `.header` top strip ka layout set karta hai.
- `.header-left`, `.header-center`, `.header-right` header ke 3 columns banate hain.
- `.global-search-input` aur `.global-search-results` global search box aur dropdown ko style karte hain.
- `.app-shell_browser` browser mode me light gradient background deta hai.
- `.sidebar` aur `.content-panel` selected view ka 2-column layout banate hain.
- `.object-browser__search`, `.list-view-card`, `.object-list-view` browse mode table aur search ko style karte hain.
- `.type-pill` aur `.count-badge` small badges hain.
- media queries mobile me layout stack kar deti hain.

#### 5. Metadata File Explanation

`objectManagerApp.js-meta.xml` me `isExposed=true` hai aur target `lightning__AppPage` hai. Iska matlab ye component App Builder me app page par use ho sakta hai.

#### 6. Test File Explanation

`objectManagerApp/__tests__/objectManagerApp.test.js` ye check karta hai ki global search result select karne ke baad dropdown label sahi sync hota hai. Ye test important hai kyunki parent aur child state same rehni chahiye.

---

### Component Name: `objectDropdown`

#### 1. Component Purpose

Ye component object select karne ke liye dropdown deta hai. Ye object browser ka shortcut selector hai.

#### 2. HTML File Explanation

- `<button class="dropdown-header">` dropdown ko open/close karta hai.
- `selectedLabel` current selected object ka naam dikhata hai.
- `hasSelection` true ho to type pill dikhata hai.
- `isOpen` true ho to dropdown body open hoti hai.
- `<input class="search-box">` dropdown ke andar object search filter karta hai.
- `<template for:each={filteredObjects}>` matching objects ki list banata hai.
- har `<button class="object-item">` ek object select karta hai.

Agar search input ya `onclick={selectObject}` hata diya jaye to user object choose nahi kar paayega.

#### 3. JavaScript File Explanation

**Imports**

- `LightningElement, api, wire` import hota hai.
- `getAllObjects` Apex se object list aati hai.

**Properties**

- `allObjects` full object list.
- `filteredObjects` search ke basis par filtered list.
- `isOpen` dropdown open state.
- `selectedLabel` visible label.
- `selectedTypeLabel` standard/custom tag.
- `_selectedObjectLabel`, `_selectedObjectApiName` internal state.
- `handleDocumentClickBound` outside click close karne ke liye.

**`@api` getters/setters**

- `selectedObjectApiName` parent se aata hai.
- `selectedObjectLabel` parent se aata hai.
- setters `syncSelectedDisplay()` call karte hain taaki UI stale na ho.

**Getters**

- `hasFilteredObjects` - list empty hai ya nahi.
- `hasSelection` - type label hai ya nahi.
- `dropdownArrowClass` - arrow open ya closed state me alag class leta hai.

**Lifecycle**

- `connectedCallback()` document listener add karta hai.
- `disconnectedCallback()` listener remove karta hai.

**Wire**

- `@wire(getAllObjects)` object list laata hai aur initial filter set karta hai.

**Methods**

- `toggleDropdown()` open/close karta hai.
- `handleSearch()` dropdown ke objects ko search string se filter karta hai.
- `selectObject()` chosen object ka API name parent ko `objectselect` event me bhejta hai.
- `handleDocumentClick()` outside click par dropdown close karta hai.
- `stopPropagation()` inner clicks ko bahar jane se rokta hai.
- `setSelection()` visible label aur type label set karta hai.
- `syncSelectedDisplay()` parent value ko actual object list se match karta hai.

#### 4. CSS File Explanation

- `.dropdown-container` and `.dropdown-body` complete dropdown structure banate hain.
- `.dropdown-header` select button ka look deta hai.
- `.dropdown-arrow` icon CSS se banaya gaya hai, image se nahi.
- `.search-box-wrap` search bar ka container hai.
- `.object-item` every row ko clickable card ki tarah dikhata hai.
- `.type-pill` small status badge hai.
- `.no-data` empty state message hai.

#### 5. Metadata File Explanation

`objectDropdown.js-meta.xml` me `isExposed=false` hai. Iska matlab ye standalone component ke roop me App Builder me use nahi hota; ye sirf parent component ke andar child ke roop me use hota hai.

#### 6. Test File Explanation

`objectDropdown/__tests__/objectDropdown.test.js` ye verify karta hai ki:

- API name diya ho to label sahi dikhna chahiye.
- label diya ho to API name resolve hona chahiye.
- lookup data missing ho to explicit label prefer hona chahiye.

Ye test isliye important hai kyunki dropdown ka display state robust hona chahiye.

---

### Component Name: `sectionDetails`

#### 1. Component Purpose

Ye component selected object ke basic describe details dikhata hai, jaise label, plural label, API name, key prefix aur permissions.

#### 2. HTML File Explanation

- `<div class="section-shell">` section ka outer wrapper hai.
- `<div class="section-header">` heading card banata hai.
- `{objectName}` current object ka naam dikhaata hai.
- `<template if:true={hasDetails}>` tabhi table banata hai jab data mil chuka ho.
- `<template for:each={detailColumns}>` detail rows ko 2 columns me split karta hai.
- har `.detail-row` label-value pair dikhata hai.

Agar `if:true={hasDetails}` hata do to empty screen par bhi blank table structure dikh sakta hai.

#### 3. JavaScript File Explanation

- `LightningElement, api, wire` import hote hain.
- `getObjectDetails` Apex se object details aati hain.
- `_objectName` internal field selected object ko store karta hai.
- `details` fetched data store karta hai.
- `error` fetch fail ho to store hota hai.
- `@api objectName` parent se value leta hai.
- setter me `details` aur `error` reset hote hain taaki purana data na dikhe.
- `hasDetails` getter batata hai ki data aaya ya nahi.
- `detailRows` getter object details ko readable labels me convert karta hai.
- `detailColumns` getter rows ko left/right split karta hai.
- `@wire(getObjectDetails, { objectName: '$_objectName' })` server se data laata hai.
- `formatBoolean()` true/false ko `True`/`False` me badalta hai.

#### 4. CSS File Explanation

- `.section-shell` spacing deta hai.
- `.section-header` card style deta hai.
- `.details-grid` 2-column layout banata hai.
- `.detail-row`, `.detail-label`, `.detail-value` row formatting handle karte hain.
- media query small screen par ek column kar deti hai.

#### 5. Metadata File Explanation

`sectionDetails.js-meta.xml` me `isExposed=true` hai. Iska matlab component metadata ke hisaab se usable hai, lekin ye app me child component ke roop me use ho raha hai.

#### 6. Test File Explanation

`sectionDetails/__tests__/sectionDetails.test.js` abhi placeholder test hai. Ye dikhata hai ki component ke liye automated test scaffold ban chuka hai, lekin actual assertions abhi nahi likhi gayi hain.

---

### Component Name: `sectionFields`

#### 1. Component Purpose

Ye sabse powerful component hai. Iska kaam hai:

- fields ki list dikhana
- data type filter lagana
- search karna
- manual field create karna
- CSV upload se bulk create karna
- created fields ke baad list refresh karna

Ye component Object Manager clone ka sabse practical part hai.

#### 2. HTML File Explanation

HTML me 3 major areas hain:

1. Top header with search/filter/add buttons
2. Fields table
3. 2 modals: manual create modal aur CSV upload modal

Important tags:

- `<lightning-button-menu>` - `Add Fields` dropdown.
- `<lightning-menu-item>` - manual ya CSV action choose karne ke liye.
- `<input class="field-search">` - field search box.
- `<lightning-combobox>` - data type filter.
- `<template if:true={hasFields}>` - table rows render karta hai.
- `<a href={field.fieldUrl}>` - click par Salesforce setup page open hota hai.
- `<template if:false={hasFields}>` - empty state message.
- `<template if:true={isManualModalOpen}>` - manual modal.
- `<template if:false={isManualReviewMode}>` - edit mode.
- `<template if:true={isManualReviewMode}>` - review mode.
- `<lightning-input>`, `<lightning-combobox>`, `<lightning-textarea>` - manual field form inputs.
- `<lightning-input type="file">` - CSV upload.
- `<template for:each={csvRowsView}>` - CSV preview rows.

Agar add button, file input, ya modal condition hata di jaye to bulk create flow toot jayega.

#### 3. JavaScript File Explanation

`sectionFields.js` file bada hai, isliye isko logical blocks me samjho.

##### a. Imports aur constants

- `LightningElement, api, wire` - component base, public props, aur wire service.
- `ShowToastEvent` - success/warning/error toast dikhane ke liye.
- `refreshApex` - field list ko fresh load karne ke liye.
- `getObjectFields` - existing fields fetch karne ke liye.
- `createFieldsBulk` - new fields create karne ke liye.
- `ALL_DATA_TYPES` - filter ka default value.
- `FIELD_TYPE_OPTIONS` - manual/CSV form ke supported field types.
- `FIELD_TYPE_LOOKUP` - type value se metadata lookup fast karta hai.
- `FIELD_TYPE_ALIASES` - CSV me aane wale alag-alag type names ko normalize karta hai.
- `DEFAULT_MANUAL_ROW` - manual form ke default values.

##### b. Reactive state

- `_objectName` current object.
- `_initialSearchTerm` parent se aane wala prefilled search.
- `allFields` fetched field list.
- `error` fetch error.
- `searchTerm` local search box.
- `selectedDataType` filter dropdown value.
- `isManualModalOpen`, `isCsvModalOpen` modal states.
- `manualRows`, `manualReviewRows` manual create flow data.
- `isManualReviewMode` review step flag.
- `manualSubmitErrors` save failures.
- `csvRows`, `csvErrors` CSV parse state.
- `selectedCsvFileName` file name display.
- `isSaving` save button disable ke liye.
- `wiredFieldsResult` refreshApex ke liye stored wire result.

##### c. `@api` setters/getters

- `objectName` setter object change par purana data reset karta hai.
- `initialSearchTerm` setter parent field search ko preload karta hai.
- `hasFields` boolean getter hai.
- `dataTypeOptions` unique data types se combobox options banata hai.
- `bulkDataTypeOptions` manual modal combobox ke supported types banata hai.
- `filteredFields` search aur data type dono ke basis par rows filter karta hai aur setup URL add karta hai.
- `fieldCountLabel` count badge text hai.
- `hasCsvRows`, `hasCsvErrors`, `csvCountLabel`, `hasManualSubmitErrors` modal states ko control karte hain.
- `manualRowsView`, `manualReviewRowsView`, `csvRowsView` view model banate hain taaki template me conditions simple रहें.

##### d. Search aur filter handlers

- `handleSearch()` field search update karta hai.
- `buildFieldSetupUrl()` har field ke setup page ka URL banata hai.
- `handleDataTypeChange()` combobox selection update karta hai.

##### e. Bulk action handlers

- `handleBulkMenuSelect()` decide karta hai manual modal open hoga ya CSV modal.
- `openManualModal()` manual flow reset karke 1 empty row banata hai.
- `closeManualModal()` sab manual state clean karta hai.
- `openCsvModal()` CSV state reset karta hai.
- `closeCsvModal()` CSV modal close aur reset karta hai.

##### f. Manual row helpers

- `buildManualRow()` unique row id aur default values ke saath row banata hai.
- `addManualRow()` nayi blank row add karta hai.
- `copyManualRow()` selected row ki copy banata hai.
- `switchToManualEditMode()` review se wapas edit mode me aata hai.
- `handleManualCellChange()` table inputs ka main handler hai.

`handleManualCellChange()` ke andar:

- label change par API name auto-fill hota hai.
- apiName change par manual edit flag set hota hai.
- type change par type-specific default values lagti hain.
- checkbox change par boolean value use hoti hai.

##### g. API name aur defaults

- `generateApiNameFromLabel()` label ko Salesforce-safe custom field API name me badalta hai.
- `getTypeDefinition()` type metadata lookup deta hai.
- `getDefaultValuesForType()` field type ke hisaab se default length, precision, scale, picklist values aur visible lines set karta hai.
- `getDefaultManualRowValues()` blank row ke defaults deta hai.
- `createRowId()` unique row id banata hai.

##### h. Manual save flow

- `saveManualRows()` rows validate karke review mode me bhejta hai.
- `confirmManualRows()` final payload banakar Apex ko bhejta hai.
- `saveRows()` common save method hai jo Apex call, refreshApex, modal close aur toast sab handle karta hai.

##### i. CSV flow

- `handleCsvFileChange()` file read karta hai aur text parse karta hai.
- `saveCsvRows()` validation check karke Apex save chalata hai.
- `parseCsvText()` CSV ko lines me parse karta hai.
- `parseCsvLines()` quoted commas aur newlines ko handle karta hai.
- `buildHeaderMap()` header names ko indexes me badalta hai.
- `readCsvCell()`, `readCsvNumberCell()`, `readCsvBooleanCell()` CSV cells ko typed values me convert karte hain.
- `normalizeCsvRow()` ek CSV row ko field-definition object me convert karta hai aur validation errors collect karta hai.
- `normalizeFieldTypeInput()` CSV types ko canonical Salesforce values me convert karta hai.

##### j. Validation aur helper methods

- `normalizeRowForSave()` save se pehle row clean karta hai.
- `getCsvExtraLabel()` preview me extra field config summary dikhata hai.
- `reduceError()` Apex error message ko friendly text me convert karta hai.
- `showToast()` toast event fire karta hai.
- `wiredFields()` Apex se fields fetch karta hai aur `wiredFieldsResult` store karta hai.

##### k. Agar koi major line hata di jaye to kya hoga

- `@wire(getObjectFields...)` hata diya to existing fields list nahi aayegi.
- `createFieldsBulk` import hata diya to create flow fail ho jayega.
- `refreshApex()` hata diya to create ke baad UI refresh nahi hogi.
- `ShowToastEvent` hata diya to success/failure feedback nahi milega.
- CSV helper methods hata diye to upload flow toot jayega.

#### 4. CSS File Explanation

- `.section-header` top area ko align karta hai.
- `.field-search` aur `.data-type-filter` controls ko style karte hain.
- `.field-table` common table look deta hai.
- `.manual-modal`, `.csv-modal` modal ko large size dete hain.
- `.inline-pair` number inputs ko side-by-side dikhata hai.
- `.csv-errors`, `.csv-validation_ok`, `.csv-validation_error` validation messages style karte hain.
- responsive rules small screen par controls stack kar dete hain.

#### 5. Metadata File Explanation

`sectionFields.js-meta.xml` me `isExposed=true` hai. Iska matlab component standalone use ke liye eligible hai, lekin project me ye mainly parent app ke andar use hota hai.

---

### Component Name: `sectionObjectLimits`

#### 1. Component Purpose

Ye component selected object ke important limits dikhata hai, jaise total fields, child relationships, record types aur field sets.

#### 2. HTML File Explanation

- `.section-header` heading dikhata hai.
- `<template for:each={limitRows}>` har limit ko row me render karta hai.
- `limit.label` aur `limit.value` readable format me dikhte hain.

#### 3. JavaScript File Explanation

- `getObjectLimits` Apex se data aata hai.
- `objectName` setter object change par purana data clear karta hai.
- `limitRows` getter do main rows banata hai.
- `wiredLimits()` server response handle karta hai.

Agar `@wire` remove ho jaye to limits screen blank ho jayegi.

#### 4. CSS File Explanation

- `.limits-card` card ko fixed max width deta hai.
- `.limit-row`, `.limit-label`, `.limit-value` simple info table jaisa look dete hain.

#### 5. Metadata File Explanation

`sectionObjectLimits.js-meta.xml` me `isExposed=true` hai.

---

### Component Name: `sectionRecordTypes`

#### 1. Component Purpose

Ye selected object ke record types list karta hai aur unka active/default status dikhata hai.

#### 2. HTML File Explanation

- table header me record type name, developer name, active aur default columns hain.
- `hasRecordTypes` true ho to rows render hoti hain.
- har row ka name aur developer name clickable link hai.
- data na ho to empty row message dikhta hai.

#### 3. JavaScript File Explanation

- `getRecordTypes` Apex wire use hota hai.
- `recordTypes` list current data store karti hai.
- `objectName` setter purana record type data clear karta hai.
- `hasRecordTypes` row existence check karta hai.
- `recordTypeCountLabel` badge text banata hai.
- `normalizedRecordTypes` yes/no labels aur setup URL add karta hai.
- `buildRecordTypeUrl()` record type detail page ka URL banata hai.
- `wiredRecordTypes()` response handle karta hai.

#### 4. CSS File Explanation

- `.table-card` width control karta hai.
- `.record-type-table` table styling karta hai.
- `.empty-row` no-data message ko center karta hai.

#### 5. Metadata File Explanation

`sectionRecordTypes.js-meta.xml` me `isExposed=true` hai.

---

### Component Name: `sectionPlaceholder`

#### 1. Component Purpose

Ye generic component un sections ke liye hai jinke liye dedicated LWC abhi nahi bana. Ye Apex se section metadata mangta hai aur ya to table dikhata hai ya message.

#### 2. HTML File Explanation

- section header me current `sectionLabel` aur `objectName` dikhte hain.
- `isLoading` true ho to loading text dikhata hai.
- `hasDataTable` true ho to metadata table render hoti hai.
- `<template for:each={tableColumns}>` columns banata hai.
- `<template for:each={tableRows}>` rows banata hai.
- `cell.href` ho to cell link ban jata hai.
- `hasMessage` ho to plain message card dikhata hai.
- `error` ho to error card dikhata hai.

#### 3. JavaScript File Explanation

- `LightningElement, api` import hote hain.
- `loadSectionData` `metadataService` se aata hai.
- `_objectName` aur `_sectionId` internal state hain.
- `sectionLabel` public prop hai.
- `isLoading`, `error`, `data` component state hain.
- `objectName` setter loadData() call karta hai.
- `sectionId` setter bhi loadData() call karta hai.
- `hasDataTable` getter table show control karta hai.
- `hasMessage` getter message type control karta hai.
- `messageText` getter message return karta hai.
- `tableColumns` getter data columns deta hai.
- `rowCountLabel` rows ka count badge text banata hai.
- `tableRows` getter row/cell view model banata hai aur per-cell href compute karta hai.
- `buildCellHref()` decide karta hai kaunsa cell link hoga aur kis URL par jayega.
- `getFieldUrl()` field detail URL banata hai.
- `getSectionBaseUrl()` section base URL banata hai.
- `loadData()` async call karta hai, loading/error/data states manage karta hai.

#### 4. CSS File Explanation

- `.placeholder-card` fallback message ko soft background deta hai.
- `.metadata-table` generic table styling karta hai.
- `.table-link` clickable link color deta hai.
- `.count-badge` row count badge banata hai.

#### 5. Metadata File Explanation

`sectionPlaceholder.js-meta.xml` me `isExposed=false` hai. Ye child helper hai, standalone page component nahi.

#### 6. Helper Module `metadataService`

`metadataService.js` ek tiny helper hai jo Apex `getSectionData()` ko wrap karta hai.

- `loadSectionData(sectionId, objectName)` Apex call karta hai.
- error aane par fallback message object return karta hai.

Isse `sectionPlaceholder` ka code clean rehta hai.

`metadataService.js-meta.xml` me bhi `isExposed=false` hai.

#### 7. Agar `sectionPlaceholder` na ho to kya hoga

- baaki metadata sections ka generic renderer nahi rahega.
- `ObjectManagerApp` ko har section ke liye alag component banana padega.
- future sections add karna costly ho jayega.

## Section 4 - Apex Classes Full Explanation

### Class Name: `ObjectManagerController`

#### 1. Class Purpose

Ye poori backend class hai. Iska kaam Salesforce metadata ko read karna, kuch cases me REST callout karna, aur UI ko structured map/list data dena hai.

Is class ki responsibility:

- objects list dena
- object details dena
- fields list dena
- record types dena
- object limits dena
- metadata sections dena
- custom fields bulk create karna
- global metadata search karna

#### 2. Top-Level Lines

- `public with sharing class ObjectManagerController` - class current user ke sharing rules follow karti hai.
- `GLOBAL_SEARCH_RESULT_LIMIT = 25` - search result ko limit karta hai.
- `API_VERSION = 'v66.0'` - REST callouts ke liye Salesforce API version.
- `SALESFORCE_NAMED_CREDENTIAL = 'SalesforceSelf'` - org ke andar callout karne ke liye named credential.
- `MetadataRequestException` - metadata REST failure ke liye custom exception.

#### 3. Methods Explanation

##### `getAllObjects()`

- **Purpose:** accessible objects ki list dena.
- **Input:** koi input nahi.
- **Output:** `List<Map<String, Object>>`.
- **Kaise kaam karta hai:** `Schema.getGlobalDescribe()` se global object map leta hai, phir Tooling API `EntityDefinition` query se customizable objects filter karta hai, phir label ke basis par sort karta hai.
- **Agar hata diya jaye:** object dropdown aur browser dono blank ho jayenge.

##### `shouldShowInObjectManager()`

- **Purpose:** decide karta hai object show karna hai ya nahi.
- **Input:** `DescribeSObjectResult`.
- **Output:** boolean.
- **Current logic:** `isAccessible()`.
- **Agar hata diya jaye:** helper inline karna padega, code less clean hoga.

##### `ObjectInfoComparator.compare()`

- **Purpose:** object list ko alphabetically sort karna.
- **Input:** do map objects.
- **Output:** comparison integer.
- **Agar hata diya jaye:** objects random order me dikh sakte hain.

##### `getObjectDetails(String objectName)`

- **Purpose:** object ke basic describe details dena.
- **Input:** object API name.
- **Output:** map with label, plural label, api name, key prefix, and CRUD-like flags.
- **Salesforce data:** `DescribeSObjectResult`.
- **Agar hata diya jaye:** `sectionDetails` screen ka data nahi milega.

##### `getObjectFields(String objectName)`

- **Purpose:** selected object ke sab fields dena.
- **Input:** object API name.
- **Output:** field list map.
- **Kaise kaam karta hai:** field map ke keys sort karta hai, phir har field ka label, API name, datatype, required flag, external ID flag nikalta hai.
- **Agar hata diya jaye:** `sectionFields` me fields table nahi dikhegi.

##### `createFieldsBulk(String objectName, List<Map<String, Object>> fieldDefinitions)`

- **Purpose:** custom fields create karna.
- **Input:** object name aur field definition list.
- **Output:** har row ka result map.
- **Validation:** object name required, at least one field required, invalid object reject, non-customizable object reject.
- **Kaise kaam karta hai:** har row ko validate karke normalized API name banata hai, phir Tooling API `CustomField` endpoint ko POST karta hai.
- **Agar hata diya jaye:** manual aur CSV bulk create flow band ho jayega.

##### `normalizeCustomFieldApiName()`

- **Purpose:** user input ko Salesforce-safe custom field name banana.
- **Input:** apiName input aur label.
- **Output:** sanitized API name ending `__c`.
- **Agar hata diya jaye:** invalid field API names create ho sakte hain.

##### `buildCustomFieldMetadata()`

- **Purpose:** Tooling API ke liye `Metadata` payload banana.
- **Input:** fieldDefinition, label, rawType.
- **Output:** metadata map.
- **Kaise kaam karta hai:** type normalize karta hai, description, required, length, precision, scale, picklist values, ya checkbox default set karta hai.
- **Agar hata diya jaye:** custom field create request incomplete ho jayegi.

##### `normalizeFieldType()`

- **Purpose:** different type spellings ko canonical Salesforce type me convert karna.
- **Input:** raw type string.
- **Output:** normalized type.
- **Agar hata diya jaye:** CSV aur manual input me type mismatch badhega.

##### `defaultLengthForType()`

- **Purpose:** text-like types ka default length dena.
- **Input:** normalized type.
- **Output:** integer length.

##### `defaultPrecisionForType()`

- **Purpose:** number-like types ka default precision dena.

##### `defaultScaleForType()`

- **Purpose:** currency aur percent ka default scale dena.

##### `splitPicklistValues()`

- **Purpose:** comma/newline/semicolon separated picklist text ko list me todna.
- **Output:** string list.
- **Agar hata diya jaye:** picklist create karna mushkil ho jayega.

##### `toInteger()` aur `toBoolean()`

- **Purpose:** dynamic map values ko safe typed values me convert karna.
- **Use:** CSV/manual input parsing me.

##### `searchMetadata(String keyword)`

- **Purpose:** global field search.
- **Input:** search keyword.
- **Output:** match results list.
- **Kaise kaam karta hai:** all accessible objects iterate karta hai, unke fields check karta hai, aur field label/API name me keyword match karta hai.
- **Agar hata diya jaye:** top search bar useless ho jayega.

##### `getObjectLimits(String objectName)`

- **Purpose:** object ki counts dena.
- **Output:** fields count, custom fields count, child relationships, record types, field sets.
- **Agar hata diya jaye:** `sectionObjectLimits` blank ho jayega.

##### `getRecordTypes(String objectName)`

- **Purpose:** object ke record types dena.
- **Output:** name, developerName, id, isActive, isDefault.
- **Agar hata diya jaye:** `sectionRecordTypes` screen band ho jayegi.

##### `getSectionData(String sectionId, String objectName)`

- **Purpose:** placeholder sections ke liye router method.
- **Input:** section id aur object name.
- **Output:** table ya message section map.
- **Kaise kaam karta hai:** `sectionId` ke basis par specific private helper call karta hai.
- **Agar hata diya jaye:** placeholder component ko data nahi milega.

##### `getFieldMap(String objectName)`

- **Purpose:** object ke field map ko reusable helper banana.

##### `getFlowsSection()`

- **Purpose:** object-triggered flows dikhana.
- **Data source:** `FlowRecord` query via `databaseQuery()`.
- **Agar data na mile:** message section return hota hai.

##### `getPageLayoutsSection()`

- **Purpose:** page layouts ka data dena.
- **Special behavior:** pehle UI API try hota hai, fail ho to describe fallback.

##### `getPageLayoutsUiApiSection()`

- **Purpose:** UI API se layout details lana.
- **Kaise kaam karta hai:** record type info fetch karta hai, phir har record type ke liye `/ui-api/layout/...` callout karta hai.
- **Helper use:** `countLayoutFields()` aur `getPreviewSectionHeadings()`.

##### `getPageLayoutsDescribeSection()`

- **Purpose:** fallback layout summary dena.
- **Data source:** `/sobjects/<object>/describe/layouts`.

##### `countLayoutFields()`

- **Purpose:** nested layout structure me field components count karna.

##### `getPreviewSectionHeadings()`

- **Purpose:** first 3 section headings ka short summary banana.

##### `normalizeLayoutText()`

- **Purpose:** HTML entities ko readable text me convert karna.

##### `getCompactLayoutsSection()`

- **Purpose:** compact layouts ke label, name, field count aur actions dikhana.

##### `getButtonsLinksActionsSection()`

- **Purpose:** layout buttons ko rows me convert karna.

##### `getListViewButtonLayoutSection()`

- **Purpose:** related list buttons dikhana.

##### `getSearchLayoutsSection()`

- **Purpose:** search layout columns dena.

##### `getLightningRecordPagesSection()`

- **Purpose:** FlexiPage/record pages fetch karna.
- **Data source:** Tooling API via `EntityDefinition` and `FlexiPage`.

##### `getFieldSetsSection()`

- **Purpose:** field sets aur required field count dena.

##### `getObjectLimitsSection()`

- **Purpose:** `getObjectLimits()` se aayi counts ko table format me dena.

##### `getRelatedLookupFiltersSection()`

- **Purpose:** lookup filters wali fields dikhana.

##### `getHierarchyColumnsSection()`

- **Purpose:** self-referencing hierarchy fields dikhana.

##### `buildColumn()`

- **Purpose:** table column metadata banana.

##### `escapeSoql()`

- **Purpose:** SOQL me single quote escape karna.

##### `yesNo()`

- **Purpose:** boolean ko `Yes/No` text me convert karna.

##### `restGetJson()` aur `restPostJson()`

- **Purpose:** named credential ke through REST GET/POST callout karna.
- **Error handling:** non-2xx status par `MetadataRequestException` throw hoti hai.

##### `databaseQuery()`

- **Purpose:** normal SOQL query ko generic map list me convert karna.

##### `toolingQuery()`

- **Purpose:** Tooling API query chalana.

##### `parseErrorMessage()`

- **Purpose:** REST error body se human-readable message nikalna.

##### `getObjectList()`, `getNestedList()`, `getListSize()`

- **Purpose:** JSON map/list ko safely read karna.

##### `getString()`, `getBoolean()`

- **Purpose:** map se safe primitive values nikalna.

##### `buildTableSection()` aur `buildMessageSection()`

- **Purpose:** placeholder component ke liye standard response shape banana.

##### `getSectionTitle()`

- **Purpose:** section id ko readable title me convert karna.

#### 4. Agar class remove ho jaye to kya hoga

- `objectManagerApp` ke saare Apex wires fail ho jayenge.
- `sectionFields` bulk create aur field list dono toot jayenge.
- `sectionPlaceholder` metadata sections load nahi kar payega.
- `searchMetadata` na ho to global search band ho jayega.

#### 5. Apex Class Metadata

`ObjectManagerController.cls-meta.xml` me `status=Active` aur `apiVersion=66.0` hai. Iska matlab class deploy aur use ke liye active hai.

---

## Section 5 - LWC to Apex Communication

### Step-by-step flow

#### 1. Object select karna

User dropdown ya object browser me object choose karta hai.

`User Action`
→ `objectDropdown` ya `objectManagerApp`
→ selected object state update
→ child sections ko prop pass
→ Apex wire call
→ describe data
→ UI update

#### 2. Object details load hona

`User Action`
→ object select
→ `sectionDetails`
→ `@wire(getObjectDetails, { objectName })`
→ Apex `getObjectDetails()`
→ Schema describe
→ response
→ detail table render

#### 3. Fields list load hona

`User Action`
→ object select
→ `sectionFields`
→ `@wire(getObjectFields, { objectName })`
→ Apex `getObjectFields()`
→ field describe map
→ response
→ fields table render

#### 4. Bulk field create

`User Action`
→ Add Fields
→ manual/CSV data fill
→ `sectionFields.saveRows()`
→ Apex `createFieldsBulk()`
→ Tooling API custom field create
→ results
→ toast
→ `refreshApex()`
→ UI refresh

#### 5. Generic metadata section

`User Action`
→ sidebar section click
→ `sectionPlaceholder`
→ `metadataService.loadSectionData()`
→ Apex `getSectionData()`
→ specific helper method
→ REST/UI API/describe data
→ table ya message

### LWC Apex ko kaise call karta hai

Do tareeqe hain:

- `@wire` - automatic, reactive loading ke liye.
- Imperative Apex - button click ya async action ke liye.

### Data kaise pass hota hai

- LWC se Apex ko normal JavaScript object pass hota hai.
- Apex me ye `Map<String, Object>` ya typed parameters ban jata hai.
- Response me Apex list/map return karta hai.
- LWC us response ko template-friendly state me convert karta hai.

---

## Section 6 - File Connections

### Kaunsi file kis se connected hai

- `objectManagerApp.js` → `objectDropdown`, `sectionDetails`, `sectionFields`, `sectionRecordTypes`, `sectionPlaceholder`
- `objectDropdown.js` → `ObjectManagerController.getAllObjects`
- `sectionDetails.js` → `ObjectManagerController.getObjectDetails`
- `sectionFields.js` → `ObjectManagerController.getObjectFields`, `createFieldsBulk`
- `sectionObjectLimits.js` → `ObjectManagerController.getObjectLimits`
- `sectionRecordTypes.js` → `ObjectManagerController.getRecordTypes`
- `sectionPlaceholder.js` → `metadataService.loadSectionData`
- `metadataService.js` → `ObjectManagerController.getSectionData`
- `ObjectManagerController.cls` → sab LWC components ka backend
- `__tests__` files → component behavior verify karte hain
- `jsconfig.json` → import alias `c/*` ko support karta hai

### ASCII File Dependency Diagram

```text
objectManagerApp
├── objectDropdown
│   └── ObjectManagerController.getAllObjects
├── sectionDetails
│   └── ObjectManagerController.getObjectDetails
├── sectionFields
│   ├── ObjectManagerController.getObjectFields
│   └── ObjectManagerController.createFieldsBulk
├── sectionObjectLimits
│   └── ObjectManagerController.getObjectLimits
├── sectionRecordTypes
│   └── ObjectManagerController.getRecordTypes
├── sectionPlaceholder
│   └── metadataService.loadSectionData
│       └── ObjectManagerController.getSectionData
└── ObjectManagerController.searchMetadata

ObjectManagerController
├── Schema describe
├── Tooling API callout
├── UI API callout
└── Salesforce REST metadata endpoints
```

---

## Section 7 - Data Flow

### UI se backend

```text
User clicks or types
→ LWC event handler
→ component state update
→ wire call or imperative Apex
→ Apex controller
→ Schema / SOQL / Tooling API / UI API
→ data response
```

### Backend se UI

```text
Apex response
→ LWC getter/state
→ conditional template rendering
→ table / modal / message update
```

### Real flow examples

- Browse list me search input change hota hai, state filter hota hai, table update hoti hai.
- Global search me debounce ke baad Apex call hota hai, results dropdown me aate hain.
- Manual field create me user data deta hai, Apex create karta hai, phir list refresh hoti hai.

---

## Section 8 - Event Handling

### Button click flow

1. User button click karta hai.
2. LWC handler run hota hai.
3. State update hoti hai.
4. Template re-render hota hai.

Examples:

- `Create Object` button
- `Browse Objects` button
- `Add Fields` menu
- `Copy row` button
- `Add row` button
- modal close buttons

### Form submission flow

Is project me traditional HTML form submit kam hai. Zyada tar flow button handlers aur `lightning-input`/`lightning-combobox` change events par based hai.

Examples:

- manual field row input change
- CSV file change
- data type combobox change

### Drag-drop flow

Current code me drag-drop feature nahi mila.

### Outside click handling

- `document.addEventListener("click", ...)` dropdown/search ko outside click par close karta hai.
- `event.stopPropagation()` inner click ko bahar nahi jaane deta.

---

## Section 9 - Important Salesforce Concepts

### `@AuraEnabled`

Ye Apex method ko LWC se callable banata hai.

- `cacheable=true` ho to read-only call fast aur cache-friendly hoti hai.
- bina `@AuraEnabled` ke LWC Apex method call nahi kar paayega.

### `@wire`

Ye automatic data loading ka tarika hai.

- component load hote hi data aa sakta hai.
- reactive parameter change par dubara call ho sakta hai.

### Imperative Apex

Ye manual call hai, jaise button click ke baad.

- `createFieldsBulk()`
- `searchMetadata()`
- `loadSectionData()` helper ke through

### Schema usage

`Schema.getGlobalDescribe()` aur describe methods object/field metadata dete hain.

Is project me Schema use hua hai:

- object list ke liye
- object details ke liye
- fields ke liye
- record types ke liye
- limits ke liye

### Metadata usage

Metadata ka matlab org structure hota hai.

Is project me metadata use hua hai:

- layouts
- record pages
- field sets
- lookup filters
- hierarchy columns
- custom field creation

---

## Section 10 - What If Removed

### Agar Apex class remove karein

- koi backend data nahi milega.
- object list, fields, record types, limits sab blank ho jayenge.
- global search aur bulk create fail ho jayega.

### Agar `@AuraEnabled` remove karein

- LWC Apex ko call nahi kar payega.
- wire aur imperative dono flow break ho sakte hain.

### Agar import statements remove karein

- compiler error aayega.
- component ko pata hi nahi hoga kaunsa Apex method ya base class use karna hai.

### Agar wire methods remove karein

- auto-loaded data nahi aayega.
- UI empty ya static ho jayegi.

### Agar event handlers remove karein

- buttons click par kuch nahi hoga.
- search, selection, modal, save flow sab dead ho jayenge.

---

## Section 11 - Beginner Summary

Is project ko simple language me aise samjho:

Yeh ek Salesforce Object Manager ka chhota version hai. Upar ek app shell hai, left me object selector hai, beech me search hai, aur right me object ke alag-alag metadata sections hain. Jab aap object choose karte ho, to LWC Apex se data mangta hai. Apex Salesforce ka internal metadata dekhkar object details, fields, record types aur limits bhejta hai. Kuch sections me Apex REST callout karke aur gehra metadata nikalta hai. `sectionFields` me aap naye custom fields bhi bana sakte ho.

Ek student ke hisaab se:

- LWC = front desk
- Apex = back office
- Metadata = file cabinet
- User = customer

Front desk request leta hai, back office file nikalta hai, aur customer ko result milta hai. Isi tarah yeh app kaam karti hai.

