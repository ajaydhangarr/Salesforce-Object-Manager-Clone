import { createElement } from "@lwc/engine-dom";
import { registerApexTestWireAdapter } from "@salesforce/sfdx-lwc-jest";

import ObjectManagerApp from "c/objectManagerApp";
import deleteObject from "@salesforce/apex/ObjectManagerController.deleteObject";
import getAllObjects from "@salesforce/apex/ObjectManagerController.getAllObjects";
import getDocumentationData from "@salesforce/apex/ObjectManagerController.getDocumentationData";
import getImpactAnalysisMetadata from "@salesforce/apex/ObjectManagerController.getImpactAnalysisMetadata";
import searchMetadata from "@salesforce/apex/ObjectManagerController.searchMetadata";

jest.mock(
  "@salesforce/apex/ObjectManagerController.searchMetadata",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/apex/ObjectManagerController.getDocumentationData",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/apex/ObjectManagerController.getImpactAnalysisMetadata",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/apex/ObjectManagerController.deleteObject",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

const getAllObjectsAdapter = registerApexTestWireAdapter(getAllObjects);

const mockObjects = [
  {
    apiName: "Account",
    label: "Account",
    typeLabel: "Standard",
    isCustom: false
  },
  {
    apiName: "Custom_Object__c",
    label: "Custom Object",
    typeLabel: "Custom",
    isCustom: true
  }
];

const mockSearchResults = [
  {
    objectApiName: "Account",
    objectLabel: "Account",
    fieldName: "Name",
    fieldLabel: "Account Name"
  }
];

const mockDocumentationPayload = [
  {
    name: "Account",
    apiName: "Account",
    type: "Standard Object",
    fields: [],
    validationRules: [],
    relationships: [],
    picklistValues: {},
    pageLayouts: [],
    additionalSections: []
  }
];

const flushPromises = () => Promise.resolve();

describe("c-object-manager-app", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("keeps the object dropdown label in sync after selecting a global search result", async () => {
    jest.useFakeTimers();
    searchMetadata.mockResolvedValue(mockSearchResults);

    const element = createElement("c-object-manager-app", {
      is: ObjectManagerApp
    });

    document.body.appendChild(element);

    getAllObjectsAdapter.emit(mockObjects);
    await flushPromises();

    const searchInput = element.shadowRoot.querySelector(
      ".global-search-input"
    );
    searchInput.value = "Na";
    searchInput.dispatchEvent(new CustomEvent("input"));

    jest.runOnlyPendingTimers();
    await flushPromises();
    await flushPromises();

    const resultButton = element.shadowRoot.querySelector(
      ".global-search-result"
    );
    expect(resultButton).not.toBeNull();
    resultButton.click();
    await flushPromises();
    await flushPromises();

    const dropdown = element.shadowRoot.querySelector("c-object-dropdown");
    const headerText = dropdown.shadowRoot.querySelector(
      ".dropdown-header__text"
    );

    expect(dropdown.selectedObjectApiName).toBe("Account");
    expect(dropdown.selectedObjectLabel).toBe("Account");
    expect(headerText.textContent).toBe("Account");
  });

  it("opens the export modal from a list row without selecting the object", async () => {
    getDocumentationData.mockResolvedValue(mockDocumentationPayload);

    const element = createElement("c-object-manager-app", {
      is: ObjectManagerApp
    });

    document.body.appendChild(element);

    getAllObjectsAdapter.emit(mockObjects);
    await flushPromises();

    const actionMenu = element.shadowRoot.querySelector(
      'lightning-button-menu[data-object-id="Account"]'
    );

    expect(actionMenu).not.toBeNull();

    actionMenu.dispatchEvent(
      new CustomEvent("select", {
        detail: {
          value: "export"
        }
      })
    );
    await flushPromises();
    await flushPromises();

    const exportModal = element.shadowRoot.querySelector("c-export-modal");

    expect(element.shadowRoot.querySelector(".object-browser")).not.toBeNull();
    expect(element.shadowRoot.querySelector("c-section-details")).toBeNull();
    expect(exportModal).not.toBeNull();
    expect(exportModal.objectId).toBe("Account");
    expect(exportModal.mode).toBe("single");
  });

  it("renders a visible Actions header and icon-only row menu in object browser", async () => {
    const element = createElement("c-object-manager-app", {
      is: ObjectManagerApp
    });

    document.body.appendChild(element);

    getAllObjectsAdapter.emit(mockObjects);
    await flushPromises();

    const actionsHeader = element.shadowRoot.querySelector(
      ".object-list-view__actions-header"
    );
    const actionMenu = element.shadowRoot.querySelector(
      'lightning-button-menu[data-object-id="Account"]'
    );

    expect(actionsHeader).not.toBeNull();
    expect(actionsHeader.textContent.trim()).toBe("Actions");
    expect(actionMenu).not.toBeNull();
    expect(actionMenu.iconName).toBe("utility:down");
    expect(actionMenu.label).toBeUndefined();
  });

  it("opens the impact analyzer modal from a custom object row action menu", async () => {
    getImpactAnalysisMetadata.mockResolvedValue({
      flows: [],
      validationRules: [],
      apexClasses: [],
      reports: [],
      dashboards: [],
      pageLayouts: [],
      workflowRules: [],
      formulas: []
    });
    deleteObject.mockResolvedValue({
      success: true
    });

    const element = createElement("c-object-manager-app", {
      is: ObjectManagerApp
    });

    document.body.appendChild(element);

    getAllObjectsAdapter.emit(mockObjects);
    await flushPromises();
    await flushPromises();

    const customObjectMenu = element.shadowRoot.querySelector(
      'lightning-button-menu[data-object-id="Custom_Object__c"]'
    );

    expect(customObjectMenu).not.toBeNull();

    customObjectMenu.dispatchEvent(
      new CustomEvent("select", {
        detail: {
          value: "delete"
        }
      })
    );
    await flushPromises();
    await flushPromises();

    const impactModal = element.shadowRoot.querySelector(
      "c-impact-analyzer-modal"
    );

    expect(element.shadowRoot.querySelector(".object-browser")).not.toBeNull();
    expect(element.shadowRoot.querySelector("c-section-details")).toBeNull();
    expect(impactModal).not.toBeNull();
    expect(impactModal.target).toEqual({
      type: "object",
      id: "Custom_Object__c",
      name: "Custom Object",
      apiName: "Custom_Object__c"
    });
  });
});
