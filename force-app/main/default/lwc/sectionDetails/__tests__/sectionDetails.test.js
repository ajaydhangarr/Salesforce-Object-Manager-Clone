import { createElement } from "@lwc/engine-dom";
import { registerApexTestWireAdapter } from "@salesforce/sfdx-lwc-jest";

import SectionDetails from "c/sectionDetails";
import getDocumentationData from "@salesforce/apex/ObjectManagerController.getDocumentationData";
import getObjectDetails from "@salesforce/apex/ObjectManagerController.getObjectDetails";

jest.mock(
  "@salesforce/apex/ObjectManagerController.getDocumentationData",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

const getObjectDetailsAdapter =
  registerApexTestWireAdapter(getObjectDetails);

const flushPromises = () => Promise.resolve();

describe("c-section-details", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    jest.clearAllMocks();
  });

  it("opens the export modal from the detail header", async () => {
    getDocumentationData.mockResolvedValue([
      {
        name: "Order",
        apiName: "Order__c",
        type: "Custom Object",
        fields: [],
        validationRules: [],
        relationships: [],
        picklistValues: {},
        pageLayouts: [],
        additionalSections: []
      }
    ]);

    const element = createElement("c-section-details", {
      is: SectionDetails
    });

    element.objectName = "Order__c";
    document.body.appendChild(element);

    getObjectDetailsAdapter.emit({
      label: "Order",
      pluralLabel: "Orders",
      apiName: "Order__c",
      isCustom: true,
      isQueryable: true,
      isCreateable: true,
      isUpdateable: true,
      isDeletable: true
    });
    await flushPromises();

    const exportButton = Array.from(
      element.shadowRoot.querySelectorAll("lightning-button")
    ).find((button) => button.label === "Export Docs");

    exportButton.dispatchEvent(new CustomEvent("click"));
    await flushPromises();
    await flushPromises();

    const exportModal = element.shadowRoot.querySelector("c-export-modal");

    expect(exportModal).not.toBeNull();
    expect(exportModal.objectId).toBe("Order__c");
    expect(exportModal.mode).toBe("single");
  });

  it("does not render a delete button in the detail header", async () => {
    const element = createElement("c-section-details", {
      is: SectionDetails
    });

    element.objectName = "Order__c";
    document.body.appendChild(element);

    getObjectDetailsAdapter.emit({
      label: "Order",
      pluralLabel: "Orders",
      apiName: "Order__c",
      isCustom: true,
      isQueryable: true,
      isCreateable: true,
      isUpdateable: true,
      isDeletable: true
    });
    await flushPromises();

    const headerButtons = Array.from(
      element.shadowRoot.querySelectorAll("lightning-button")
    );

    expect(headerButtons.map((button) => button.label)).toEqual(["Export Docs"]);
  });
});
