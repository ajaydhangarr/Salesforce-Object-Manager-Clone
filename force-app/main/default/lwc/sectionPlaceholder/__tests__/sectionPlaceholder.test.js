import { createElement } from "@lwc/engine-dom";

import SectionPlaceholder from "c/sectionPlaceholder";
import { loadSectionData } from "c/metadataService";

jest.mock(
  "c/metadataService",
  () => {
    return {
      loadSectionData: jest.fn()
    };
  },
  { virtual: true }
);

const flushPromises = () => Promise.resolve();

describe("c-section-placeholder", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    jest.clearAllMocks();
  });

  it("opens the setup page when the buttons and links action edit button is clicked", async () => {
    loadSectionData.mockResolvedValue({
      type: "table",
      columns: [
        { key: "label", label: "Label" },
        { key: "editAction", label: "Edit" }
      ],
      rows: [
        {
          label: "My Custom Button",
          editAction: "Edit",
          editUrl:
            "/lightning/setup/ObjectManager/Account/ButtonsLinksActions/00bTEST000000123/view",
          canEdit: true
        }
      ]
    });

    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    const element = createElement("c-section-placeholder", {
      is: SectionPlaceholder
    });

    element.sectionLabel = "Buttons, Links, and Actions";
    element.objectName = "Account";
    element.sectionId = "buttonsLinksActions";
    document.body.appendChild(element);

    await flushPromises();
    await flushPromises();

    const actionButton = element.shadowRoot.querySelector(
      "button.action-button"
    );

    expect(actionButton).not.toBeNull();

    actionButton.click();

    expect(openSpy).toHaveBeenCalledWith(
      "/lightning/setup/ObjectManager/Account/ButtonsLinksActions/00bTEST000000123/view",
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("renders a disabled action button when no setup URL is available", async () => {
    loadSectionData.mockResolvedValue({
      type: "table",
      columns: [
        { key: "label", label: "Label" },
        { key: "editAction", label: "Edit" }
      ],
      rows: [
        {
          label: "Standard Button",
          editAction: "Edit",
          editUrl: "",
          canEdit: false
        }
      ]
    });

    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    const element = createElement("c-section-placeholder", {
      is: SectionPlaceholder
    });

    element.sectionLabel = "Buttons, Links, and Actions";
    element.objectName = "Account";
    element.sectionId = "buttonsLinksActions";
    document.body.appendChild(element);

    await flushPromises();
    await flushPromises();

    const actionButton = element.shadowRoot.querySelector(
      "button.action-button"
    );

    expect(actionButton).not.toBeNull();
    expect(actionButton.disabled).toBe(true);
    expect(openSpy).not.toHaveBeenCalled();
  });
});
