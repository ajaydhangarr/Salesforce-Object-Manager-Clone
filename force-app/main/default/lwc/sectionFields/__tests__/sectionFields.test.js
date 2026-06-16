import { createElement } from "@lwc/engine-dom";
import { registerApexTestWireAdapter } from "@salesforce/sfdx-lwc-jest";

import SectionFields from "c/sectionFields";
import getImpactAnalysisMetadata from "@salesforce/apex/ObjectManagerController.getImpactAnalysisMetadata";
import getObjectFields from "@salesforce/apex/ObjectManagerController.getObjectFields";

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
  "@salesforce/apex/ObjectManagerController.createFieldsBulk",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/apex/ObjectManagerController.deleteField",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

const getObjectFieldsAdapter =
  registerApexTestWireAdapter(getObjectFields);

const flushPromises = () => Promise.resolve();

describe("c-section-fields", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    jest.clearAllMocks();
  });

  it("opens the impact analyzer modal from a field delete action", async () => {
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

    const element = createElement("c-section-fields", {
      is: SectionFields
    });

    element.objectName = "Order__c";
    document.body.appendChild(element);

    getObjectFieldsAdapter.emit([
      {
        label: "Amount",
        apiName: "Amount__c",
        dataType: "Currency",
        isRequired: true,
        isExternalId: false,
        isCustom: true,
        durableId: "01IgK0000000001.Amount__c",
        customFieldId: "00NgK0000000001"
      }
    ]);
    await flushPromises();
    await flushPromises();

    const actionMenu = element.shadowRoot.querySelector(
      'lightning-button-menu[data-field-api-name="Amount__c"]'
    );

    actionMenu.dispatchEvent(
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

    expect(impactModal).not.toBeNull();
    expect(impactModal.target).toEqual({
      type: "field",
      fieldId: "00NgK0000000001",
      fieldApiName: "Amount__c",
      objectId: "Order__c",
      objectApiName: "Order__c"
    });
  });
});
