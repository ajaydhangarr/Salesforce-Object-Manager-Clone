# Line-by-Line Style Guide (Hindi, Range Based)

Is file ka goal hai ki har important source file ke line blocks cover ho jayein.  
Large files me exact single-line commentary practical nahi hota, isliye contiguous line-ranges ke hisab se explain kiya gaya hai.

---

## LWC JS Files

### `metadataService.js` (17 lines)
- 1: Apex import.
- 3-17: async wrapper + try/catch + fallback response.

### `objectDropdown.js` (131 lines)
- 1-3: imports.
- 5-20: component state variables.
- 22-40: `@api` getters/setters for selected object.
- 42-54: computed getters.
- 56-62: lifecycle listener attach/detach.
- 64-73: wire object fetch.
- 75-99: dropdown open + search filter.
- 101-116: selection + custom event emit.
- 118-132: outside-click close + helper methods.

### `objectManagerApp.js` (251 lines)
- 1-3: imports.
- 5-24: sections constant.
- 26: debounce constant.
- 28-49: state declarations.
- 52-59: lifecycle hooks.
- 61-68: wire object fetch.
- 70-187: computed getters for UI visibility/data shaping.
- 188-220: basic button/object navigation handlers.
- 221-262: global search debounce + Apex call + stale-request handling.
- 263-275: search result select.
- 276-307: helpers + timeout cleanup.

### `sectionDetails.js` (75 lines)
- 1-3: imports.
- 5-21: state + `@api objectName`.
- 23-71: computed detail rows/columns.
- 73-83: wire details fetch.
- 85-87: boolean formatting helper.

### `sectionObjectLimits.js` (39 lines)
- 1-3 imports.
- 5-21 state + object api property.
- 23-34 limitRows mapping.
- 37-39 wire response handler.

### `sectionPlaceholder.js` (149 lines)
- 1-3 imports.
- 5-36 state + api setters + trigger load.
- 38-68 table/message getters + row shaping.
- 70-132 section-specific link resolution.
- 134-162 section/field URL helpers.
- 164-end: async load from service with loading/error states.

### `sectionRecordTypes.js` (48 lines)
- 1-3 imports.
- 5-21 state + `@api`.
- 23-47 count/normalize/url helpers + wire fetch.

### `sectionFields.js` (1277 lines)
- 1-8 imports.
- 10-214 constants/type dictionaries/default schema.
- 216-269 state + API properties.
- 270-417 getters for filtered view, options, modal views.
- 418-440 field URL helpers.
- 441-530 field action logic (edit/delete confirm/delete call).
- 531-689 modal open/close/manual row editing.
- 690-756 manual save + review + confirm.
- 757-807 CSV read/save entry points.
- 808-888 common save routine + payload normalization.
- 889-1035 CSV parse + row normalization.
- 1036-1153 CSV utility parsers.
- 1154-1295 validation engine.
- 1296-1444 type normalization + durable/custom id selection + defaults.
- 1445-1486 UI text/error/toast helpers.
- 1487-1277 (final block): wire fields response mapping + normalization.

---

## LWC HTML/CSS Files (Block Coverage)

### `objectDropdown.html` (56)
- 1-12 header/select UI.
- 13-32 search input area.
- 33-53 list rendering + empty message.

### `objectDropdown.css` (140)
- 1-24 host/header base.
- 25-64 arrow + dropdown panel.
- 65-92 search box styling.
- 93-140 list rows + pills + empty state.

### `objectManagerApp.html` (174)
- 1-63 top header (dropdown + global search + actions).
- 64-112 selected object shell (sidebar + section routing).
- 113-173 object browser table fallback.

### `objectManagerApp.css` (282)
- 1-85 header + global search overlay.
- 86-154 app shell + sidebar/content.
- 155-259 object browser list table styles.
- 260-282 responsive rules.

### `sectionDetails.html/css`
- html 1-23: simple header + 2-column detail cards.
- css 1-60: section card + detail rows + mobile rule.

### `sectionObjectLimits.html/css`
- html 1-17: header + rows.
- css 1-51: limits row grid styles.

### `sectionRecordTypes.html/css`
- html 1-61: header + record types table + empty state.
- css 1-84: table/badge/link styles.

### `sectionPlaceholder.html/css`
- html 1-66: header + loading/table/message/error conditional views.
- css 1-87: generic table/message shell styling.

### `sectionFields.html/css`
- html 1-117: header/tools + fields table.
- html 118-436: manual modal edit UI.
- html 437-556: manual review + footer actions.
- html 557-646: CSV modal upload/preview/actions.
- css 1-105: header/tools/table base.
- css 106-194: modal controls/rows/validation styles.
- css 195-225: responsive tweaks.

---

## Apex File Line Guide

### `ObjectManagerController.cls` (3189 lines)
- 1-123: class setup + object list pipeline.
- 124-195: object detail API.
- 196-393: object fields + durable/custom id mapping.
- 394-535: bulk custom field creation.
- 536-775: delete + metadata SOAP parsing.
- 776-991: id normalization/validation helpers.
- 992-1428: metadata payload builder + type helpers.
- 1429-1541: global search.
- 1542-1668: limits + record types.
- 1669-1775: section dispatcher.
- 1776-2776: section-specific metadata handlers.
- 2777-2816: column/escape helpers.
- 2817-2981: REST/Tooling/database wrappers.
- 2982-3189: parse + map/list/value utility methods + section title map.

---

## Meta/Test/Config Files Coverage

- `*.js-meta.xml`: apiVersion + exposure info.
- `ObjectManagerController.cls-meta.xml`: class metadata.
- `SalesforceSelf.namedCredential-meta.xml`: callout auth setup.
- Jest test files in `objectDropdown`, `objectManagerApp`, `sectionDetails` scanned and explained in LWC document.
- `lwc/jsconfig.json` scanned as editor/module config utility.
