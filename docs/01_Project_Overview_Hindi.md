# Object Manager Clone: Project Overview (Hindi)

## SECTION 1 - Project Overview

### Ye pura project kya karta hai
Ye project Salesforce ke **Object Manager** ka clone banata hai jisme admin/user:
- object list dekh sakta hai
- object select karke uske sections dekh sakta hai
- fields dekh sakta hai
- custom fields bulk me create kar sakta hai (manual + CSV)
- custom fields delete kar sakta hai
- metadata sections (layouts, validation rules, flows, etc.) dekh sakta hai
- global search se kisi bhi object ke field tak jaldi pahunch sakta hai

### Ye Object Manager clone kaise kaam karta hai
High-level flow:
1. `objectManagerApp` LWC load hota hai.
2. `ObjectManagerController.getAllObjects()` call hoti hai.
3. User object select karta hai.
4. Side sections show hote hain:
   - Details
   - Fields & Relationships
   - Record Types
   - aur baaki placeholder sections (Apex metadata se data fetch).
5. Field screen par:
   - filter/search
   - edit/open in new tab
   - delete custom field
   - bulk add via form/CSV

### Real-world use
- Admin training ke liye (custom lightweight Object Manager UI)
- Internal metadata governance dashboards
- Faster object metadata audit without navigating full Setup tree
- CSV se field onboarding automation

### Technologies use hui hain
- **LWC (Lightning Web Components)**: frontend UI + interaction
- **Apex**: backend business logic + metadata/API calls
- **Salesforce Metadata/Tooling/REST/SOAP APIs**: dynamic metadata operations

### Kyun ye technologies use hui
- LWC native Salesforce UI layer hai, Lightning Experience ke sath best integration.
- Apex secure server-side layer deta hai jahan describe info, permissions, callouts handle ho sakte hain.
- Metadata/Tooling APIs ke bina runtime field create/delete possible nahi hota.

### Agar ye technologies use na karte
- Sirf LWC se direct metadata modify nahi kar sakte.
- Sirf Apex describe se creation/deletion nahi hoga (metadata APIs required).
- Sirf REST UI se granular Salesforce setup operations consistent tarike se manage nahi hote.

Real-life example:
Socho LWC ek "front desk" hai, Apex "back office", aur Metadata API "government office" jahan official registry update hoti hai. Front desk se request jaati hai, back office validate karta hai, phir registry update hoti hai.

---

## SECTION 2 - Folder Structure Explanation

## Source Scope Jo Scan Hua
Main source scan kiya:
- `force-app/main/default/lwc/**`
- `force-app/main/default/classes/**`
- `force-app/main/default/namedCredentials/**`
- related test files in `lwc/**/__tests__`

## Folder Structure (Relevant)

```text
force-app/main/default/
|- classes/
|  |- ObjectManagerController.cls
|  |- ObjectManagerController.cls-meta.xml
|- lwc/
|  |- jsconfig.json
|  |- metadataService/
|  |- objectDropdown/
|  |- objectManagerApp/
|  |- sectionDetails/
|  |- sectionFields/
|  |- sectionObjectLimits/
|  |- sectionPlaceholder/
|  |- sectionRecordTypes/
|- namedCredentials/
   |- SalesforceSelf.namedCredential-meta.xml
```

### `lwc` folder ka role
Ye pura UI layer hai:
- page shell
- dropdown
- search
- fields grid
- bulk modal
- record types
- placeholder table/message UI

Agar ye folder na ho: koi interactive frontend nahi bachega.

### `classes` folder ka role
Backend controller yahin hai:
- objects/fields fetch
- bulk field create
- field delete
- metadata section APIs
- global search

Agar ye na ho: LWC ke paas data source nahi hoga.

### `utils/services` ka role
- `lwc/metadataService/metadataService.js`
  - reusable wrapper jo `getSectionData` Apex ko call karta hai.
  - section placeholder component ko clean abstraction deta hai.

Agar service layer na ho:
- har component me duplicate Apex call logic likhna padega.
- code maintain karna mushkil ho jayega.

### Sub-folder wise role
- `objectManagerApp`: root container and orchestration
- `objectDropdown`: object picker with search
- `sectionDetails`: selected object basic details
- `sectionFields`: fields list + add/delete/filter
- `sectionRecordTypes`: record types listing
- `sectionObjectLimits`: object limits block
- `sectionPlaceholder`: common renderer for many metadata sections
- `metadataService`: helper service for placeholder
- `__tests__`: LWC Jest unit tests

### Folders kyun banaye gaye
Single Responsibility Principle:
- har UI part alag component
- readability better
- testability better
- future extension easy

---

## Quick File Inventory (LWC + Apex + Service)

### LWC Components
- `metadataService`
- `objectDropdown`
- `objectManagerApp`
- `sectionDetails`
- `sectionFields`
- `sectionObjectLimits`
- `sectionPlaceholder`
- `sectionRecordTypes`

### Apex
- `ObjectManagerController.cls`

### Config/Service Helpers
- `lwc/jsconfig.json`
- `namedCredentials/SalesforceSelf.namedCredential-meta.xml`
