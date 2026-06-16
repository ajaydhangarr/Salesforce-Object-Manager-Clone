import { createElement } from "@lwc/engine-dom";
import { registerApexTestWireAdapter } from "@salesforce/sfdx-lwc-jest";

import ObjectDropdown from "c/objectDropdown";
import getAllObjects from "@salesforce/apex/ObjectManagerController.getAllObjects";

const getAllObjectsAdapter = registerApexTestWireAdapter(getAllObjects);

const mockObjects = [
  {
    apiName: "Account",
    label: "Account",
    typeLabel: "Standard"
  },
  {
    apiName: "Custom_Object__c",
    label: "Custom Object",
    typeLabel: "Custom"
  }
];

const flushPromises = () => Promise.resolve();

describe("c-object-dropdown", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    jest.clearAllMocks();
  });

  it("shows the selected object label when an API name is provided", async () => {
    const element = createElement("c-object-dropdown", {
      is: ObjectDropdown
    });

    element.selectedObjectApiName = "Account";
    document.body.appendChild(element);

    getAllObjectsAdapter.emit(mockObjects);
    await flushPromises();

    const headerText = element.shadowRoot.querySelector(
      ".dropdown-header__text"
    );

    expect(headerText.textContent).toBe("Account");
  });

  it("resolves the selected object when a label is provided", async () => {
    const element = createElement("c-object-dropdown", {
      is: ObjectDropdown
    });

    element.selectedObjectApiName = "Custom Object";
    document.body.appendChild(element);

    getAllObjectsAdapter.emit(mockObjects);
    await flushPromises();

    const headerText = element.shadowRoot.querySelector(
      ".dropdown-header__text"
    );

    expect(headerText.textContent).toBe("Custom Object");
    expect(element.selectedObjectApiName).toBe("Custom_Object__c");
  });

  it("prefers an explicit selected object label when lookup data is missing", async () => {
    const element = createElement("c-object-dropdown", {
      is: ObjectDropdown
    });

    element.selectedObjectApiName = "Custom_Object__c";
    element.selectedObjectLabel = "Custom Object";
    document.body.appendChild(element);

    getAllObjectsAdapter.emit([]);
    await flushPromises();

    const headerText = element.shadowRoot.querySelector(
      ".dropdown-header__text"
    );

    expect(headerText.textContent).toBe("Custom Object");
  });
});
