# Apex + Feature Flows (Hindi)

---

## SECTION 4 - Apex Classes Explanation

Project me 1 primary Apex class hai:
- `ObjectManagerController.cls`

## Class Name: `ObjectManagerController`

### Class Purpose
Ye class pure app ka backend engine hai:
- objects/fields fetch
- bulk custom field create
- custom field delete
- global metadata search
- record types/details/limits
- placeholder metadata sections (flows/layouts/validation/search layouts...)
- REST/Tooling/SOAP callout utilities

### Method Index (line reference)
Ye index class ke major methods ka quick map deta hai:

```text
15   getAllObjects
125  getObjectDetails
197  getObjectFields
395  createFieldsBulk
537  deleteField
588  deleteCustomFieldViaMetadataApi
641  parseMetadataDeleteResponse
776  resolveCustomFieldMetadataId
992  buildCustomFieldMetadata
1430 searchMetadata
1543 getObjectLimits
1606 getRecordTypes
1670 getSectionData
1796 getFlowsSection
1858 getPageLayoutsUiApiSection
1987 getPageLayoutsDescribeSection
2137 getCompactLayoutsSection
2185 getButtonsLinksActionsSection
2244 getListViewButtonLayoutSection
2306 getSearchLayoutsSection
2361 getLightningRecordPagesSection
2417 getFieldSetsSection
2549 getValidationRulesSection
2628 getRelatedLookupFiltersSection
2700 getHierarchyColumnsSection
2824 restGetJson
2858 restPostJson
2959 toolingQuery
```

### Core Constants
- `GLOBAL_SEARCH_RESULT_LIMIT = 25`  
  Search result count cap.
- `API_VERSION = 'v66.0'`  
  REST/Tooling/SOAP version alignment.
- `SALESFORCE_NAMED_CREDENTIAL = 'SalesforceSelf'`  
  callout auth abstraction.

### `@AuraEnabled` Public Methods (UI se direct call)

1. `getAllObjects()`
- Input: none
- Output: object maps list (`apiName`, `label`, `isCustom`, `typeLabel`)
- Logic:
  - Tooling `EntityDefinition` query
  - `Schema.getGlobalDescribe()` cross-check
  - accessible/customizable objects filter
- Remove effect: app me object dropdown/browse list टूट जाएगी.

2. `getObjectDetails(String objectName)`
- Describe-based detail map return.
- Remove effect: Details section blank.

3. `getObjectFields(String objectName)`
- All fields + extra metadata:
  - `durableId`
  - `customFieldId`
  - dataType/required/custom/externalId
- Remove effect: Fields section core grid break.

4. `createFieldsBulk(String objectName, List<Map<String,Object>> fieldDefinitions)`
- Bulk create custom fields via Tooling `POST /tooling/sobjects/CustomField`.
- Har row par success/fail message.
- Remove effect: manual/CSV bulk create fail.

5. `deleteField(...)`
- custom field validation
- Metadata SOAP `deleteMetadata(CustomField)` invoke
- success map return
- Remove effect: delete feature fail.

6. `searchMetadata(String keyword)`
- Global search for fields across objects (`Schema describe` based scan).
- keyword length guard (`>=2`)
- hard cap (`25`)
- Remove effect: top global search drop-down बंद.

7. `getObjectLimits(String objectName)`
- field/recordtype/child/fieldset counts.

8. `getRecordTypes(String objectName)`
- record type list with id + flags.

9. `getSectionData(String sectionId, String objectName)`
- dispatcher method for placeholder sections.
- sectionId ke hisab se private method call.
- Remove effect: flows/layouts/validation/etc placeholder sections dead.

### Major Private Methods (Grouped)

#### A) Field Metadata Support
- `getFieldDurableIdsByApiName`
- `getCustomFieldIdsByApiName`
- `normalizeCustomFieldApiName`
- `buildCustomFieldMetadata`
- `normalizeFieldType`
- `splitPicklistValues`, `toInteger`, `toBoolean`

#### B) Delete via Metadata SOAP
- `deleteCustomFieldViaMetadataApi`
- `parseMetadataDeleteResponse`
- XML helpers: `findXmlChildByLocalName`, `getXmlChildText`, `escapeXml`

#### C) Placeholder Section Builders
- `getFlowsSection`
- `getPageLayoutsSection` (+ UI API/describe fallback)
- `getCompactLayoutsSection`
- `getButtonsLinksActionsSection`
- `getListViewButtonLayoutSection`
- `getSearchLayoutsSection`
- `getLightningRecordPagesSection`
- `getFieldSetsSection`
- `getObjectLimitsSection`
- `getValidationRulesSection`
- `getRelatedLookupFiltersSection`
- `getHierarchyColumnsSection`

#### D) Generic Utility/Infra
- REST helpers: `restGetJson`, `restPostJson`, `restDelete`
- Tooling query wrapper: `toolingQuery`
- DB query wrapper: `databaseQuery`
- response/error parsing: `parseErrorMessage`
- map/list helpers: `getObjectList`, `getNestedList`, `getString`, `getBoolean`
- section response builders: `buildTableSection`, `buildMessageSection`, `getSectionTitle`

### SOQL / Query Notes
- Standard describe + dynamic schema heavily used.
- Tooling queries for:
  - `EntityDefinition`
  - `FieldDefinition`
  - `CustomField`
  - `ValidationRule`
  - `FlexiPage`
- REST/UI API queries for layout/search sections.

### DML Operations
- Traditional DML (insert/update) mostly nahi, metadata creation/deletion APIs use hui hain.
- Bulk field create/delete standard sObject DML se nahi hota.

### try-catch Usage
- Bulk create row-wise try/catch -> partial success model.
- metadata section dispatcher catches failure and safe message देता hai.
- REST/SOAP errors parse karke user-friendly message return.

---

## SECTION 5 - Global Search Feature Explanation

Related files:
- `lwc/objectManagerApp/objectManagerApp.html`
- `lwc/objectManagerApp/objectManagerApp.js`
- `classes/ObjectManagerController.cls` (`searchMetadata`)

### Step-by-step flow
1. User global input me type karta hai.
2. `handleGlobalSearchInput` chalta hai.
3. 2-char minimum check.
4. debounce 300ms apply hota hai.
5. Imperative Apex call:
   - `searchMetadata({ keyword: searchTerm })`
6. Apex:
   - all accessible objects iterate
   - fields map iterate
   - API name/label contains check
   - max 25 results return
7. LWC normalized result banata hai.
8. dropdown render hota hai.
9. user result click karta hai:
   - object select
   - section auto switch to `fieldsRelationships`
   - selected field as initial search term pass

### Search remove karne par kya hoga
- user ko exact object pehle select karna padega.
- cross-object quick navigation खत्म.

### Performance handling
- input debounce
- short keyword guard
- request token (`latestGlobalSearchRequest`) to ignore stale responses
- result cap in Apex

### ASCII Data Flow Diagram - Global Search

```text
[User Types in Global Search]
          |
          v
objectManagerApp.handleGlobalSearchInput()
  - length >=2?
  - debounce(300ms)
          |
          v
Imperative Apex: searchMetadata(keyword)
          |
          v
ObjectManagerController.searchMetadata()
  - Iterate Objects
  - Iterate Fields
  - Match label/api
  - Limit 25
          |
          v
Return List<Map<String,String>>
          |
          v
LWC normalizes + renders dropdown
          |
          v
User selects result
          |
          v
Set selectedObject + activeSection=Fields
Pass fieldSearchTerm to sectionFields
```

---

## SECTION 6 - Bulk Field Add Feature Explanation

Related files:
- `lwc/sectionFields/sectionFields.html`
- `lwc/sectionFields/sectionFields.js`
- `classes/ObjectManagerController.cls`

### UI kaise kaam karta hai
- Add Fields button -> menu:
  - `Add Manually`
  - `Upload CSV`
- Manual mode:
  - row-based form
  - type-specific dynamic controls
  - review step before final create
- CSV mode:
  - file upload
  - parse/normalize/validate
  - preview with error highlights

### Multiple fields ka data collection
- Manual rows array `manualRows`
- CSV rows array `csvRows`
- `normalizeRowForSave` payload standard shape banata hai

### Single request me multiple field create
- LWC calls:
  `createFieldsBulk({ objectName, fieldDefinitions: rows })`
- Apex method `createFieldsBulk` list iterate karta hai.
- Har row ke liye Tooling `CustomField` create call.
- consolidated row-wise result वापस आता hai.

### Apex bulk logic
- input guards
- object customizable guard
- loop per row:
  - label/type validation
  - api normalization
  - metadata map build
  - Tooling create call
  - success/fail capture

### Error handling
- row-level fail does not stop whole batch.
- UI me `X succeeded, Y failed` toast.
- per-row message stored.

### Bulk logic galat ho to problems
- duplicate API names
- invalid precision/scale
- picklist values missing
- unsupported type mapping
- partial failures without clear feedback

### Governor limits impact
- har row par callout ho raha hai; बहुत बड़ी batches me callout limits risk.
- currently UI practical row size tak ठीक hai, but extreme bulk ke liye batching/async design chahiye.

### ASCII Data Flow Diagram - Bulk Field Creation

```text
[User Manual Rows OR CSV Upload]
            |
            v
sectionFields.js
  - normalize
  - validate
  - build payload list
            |
            v
Imperative Apex: createFieldsBulk(objectName, fieldDefinitions[])
            |
            v
ObjectManagerController.createFieldsBulk()
  loop each row:
    -> normalize api/type
    -> build metadata map
    -> POST /tooling/sobjects/CustomField
    -> collect success/error
            |
            v
Return row-wise results[]
            |
            v
LWC toast + refreshApex(getObjectFields)
            |
            v
Updated field table
```

---

## SECTION 7 - LWC to Apex Communication (Step-by-step)

Pattern:
`User Action -> LWC Method -> Apex Method -> Salesforce Data/API -> Response -> UI Update`

Examples:

1. Object load
- App init -> `@wire(getAllObjects)` -> `getAllObjects` -> Tooling/Describe -> dropdown/object list render.

2. Field list load
- sectionFields mount -> `@wire(getObjectFields)` -> describe + tooling ids -> table render.

3. Bulk create
- user confirm -> `saveRows()` -> `createFieldsBulk` -> Tooling create -> toast + refresh.

4. Delete field
- user delete confirm -> `handleDeleteField` -> `deleteField` -> Metadata SOAP delete -> toast + refresh.

5. Global search
- input -> `handleGlobalSearchInput` -> `searchMetadata` -> matches -> dropdown results.

---

## SECTION 8 - File Connections / Dependencies

### Major connections
- `objectManagerApp` -> `objectDropdown`, `sectionDetails`, `sectionFields`, `sectionRecordTypes`, `sectionPlaceholder`
- `sectionPlaceholder` -> `metadataService`
- All major LWCs -> `ObjectManagerController` Apex methods
- `ObjectManagerController` -> Named Credential `SalesforceSelf` for callouts

### ASCII File Dependency Diagram

```text
                +------------------------------+
                | ObjectManagerController.cls  |
                +--------------+---------------+
                               ^
                               |
     +-------------------------+-------------------------+
     |                         |                         |
+----+----------------+  +-----+----------------+  +-----+----------------+
| objectManagerApp.js |  | sectionFields.js     |  | sectionPlaceholder.js |
+----+----------------+  +-----+----------------+  +-----+----------------+
     |                            |                          |
     |                            |                          v
     |                            |                 metadataService.js
     v                            v
objectDropdown.js         (create/delete/get fields)
sectionDetails.js
sectionRecordTypes.js
sectionObjectLimits.js

NamedCredential:
ObjectManagerController ---> SalesforceSelf.namedCredential-meta.xml
```

---

## SECTION 10 - Important Salesforce Concepts (Beginner Friendly)

### `@AuraEnabled`
- Apex method ko LWC/Flow/Aura ke liye callable banata hai.
- `cacheable=true` read-only methods ke liye use hota hai.

### `@wire`
- reactive data binding.
- parameter change hote hi Apex auto re-call hota hai.

### Imperative Apex
- method manually call karte hain (e.g., button click par).
- create/delete jaise actions me use hota hai.

### Metadata Usage
- runtime metadata operations:
  - custom field create
  - custom field delete
  - layout/search metadata fetch

### Dynamic Field Creation
- payload me field type + properties build karke Tooling API ko POST.
- static schema change nahi, runtime metadata mutation.

---

## SECTION 11 - What If Removed

### Agar Apex class remove karein
- pura app ka backend खत्म.
- object/field data load nahi hoga.
- create/delete/search/metadata sections sab टूटेंगे.

### Agar search logic remove karein
- global cross-object quick find खत्म.
- UX slow ho jayega.

### Agar bulk logic remove karein
- field creation one-by-one manual ho jayegi.
- admin productivity बहुत घटेgi.

### Agar event handlers remove karein
- UI static page ban jayega.
- button clicks ka koi असर nahi.

---

## SECTION 12 - Beginner Summary

Simple words me:
- Ye app Salesforce Object Manager ka simplified custom version hai.
- Frontend LWC hai jo tables, filters, modals, dropdowns show karta hai.
- Backend Apex hai jo Salesforce se metadata/data fetch karta hai.
- Field creation/deletion normal data insert/delete nahi, metadata APIs se hota hai.
- Global search se aap kisi bhi field ko quickly dhoondh sakte ho.
- Bulk add se ek baar me multiple custom fields bana sakte ho.
- App ka design modular hai: har feature ka separate component, aur sabko Apex controller connect karta hai.

Real-life analogy:
- `objectManagerApp` = school principal dashboard
- `objectDropdown` = class selector
- `sectionFields` = student register management (add/remove/edit)
- `ObjectManagerController` = school office staff jo actual records system update karta hai
