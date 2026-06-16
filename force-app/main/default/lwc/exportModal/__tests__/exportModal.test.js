import { createElement } from "@lwc/engine-dom";

import ExportModal from "c/exportModal";
import getAllObjects from "@salesforce/apex/ObjectManagerController.getAllObjects";
import getDocumentationData from "@salesforce/apex/ObjectManagerController.getDocumentationData";

jest.mock(
  "@salesforce/apex/ObjectManagerController.getAllObjects",
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
  "lightning/platformResourceLoader",
  () => {
    return {
      loadScript: jest.fn(() => Promise.resolve())
    };
  },
  { virtual: true }
);

const flushPromises = () => Promise.resolve();

describe("c-export-modal", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    delete window.jspdf;
    jest.clearAllMocks();
  });

  it("updates the preview when format and section selections change", async () => {
    getAllObjects.mockResolvedValue([]);
    getDocumentationData.mockResolvedValue([
      {
        name: "Order",
        apiName: "Order__c",
        type: "Custom Object",
        fields: [
          {
            apiName: "Amount__c",
            label: "Amount",
            type: "Currency",
            required: true
          }
        ],
        validationRules: [],
        relationships: [],
        picklistValues: {
          Status__c: ["Draft", "Confirmed"]
        },
        pageLayouts: [],
        additionalSections: []
      }
    ]);

    const element = createElement("c-export-modal", {
      is: ExportModal
    });
    window.jspdf = {
      jsPDF: class {
        constructor() {
          this.internal = {
            pageSize: {
              getWidth() {
                return 595;
              },
              getHeight() {
                return 842;
              }
            }
          };
        }

        setFont() {}

        setFontSize() {}

        splitTextToSize(value) {
          return [value];
        }

        addPage() {}

        text() {}

        output() {
          return new Blob(["pdf"], { type: "application/pdf" });
        }
      }
    };

    element.mode = "single";
    element.objectId = "Order__c";
    document.body.appendChild(element);

    await flushPromises();
    await flushPromises();
    await flushPromises();

    const subtitle = element.shadowRoot.querySelector(".modal-subtitle");
    const preview = element.shadowRoot.querySelector(".preview-text");

    expect(subtitle.textContent).toBe("Order__c - Custom Object");
    expect(preview.textContent).toContain("## Fields & Types");
    expect(preview.textContent).toContain("## Picklist Values");

    const pdfButton = Array.from(
      element.shadowRoot.querySelectorAll(".format-option")
    ).find((button) => button.dataset.format === "pdf");

    pdfButton.click();
    await flushPromises();

    expect(preview.textContent).toContain("PDF Preview");
    expect(preview.textContent).not.toContain("## Fields & Types");
    expect(preview.textContent).toContain("Fields & Types:");

    const fieldsCheckbox = Array.from(
      element.shadowRoot.querySelectorAll("lightning-input")
    ).find((input) => input.label === "Fields & types");

    fieldsCheckbox.checked = false;
    fieldsCheckbox.dispatchEvent(new CustomEvent("change"));
    await flushPromises();

    expect(preview.textContent).not.toContain("Fields & Types:");
    expect(preview.textContent).toContain("Picklist Values:");
  });
});
