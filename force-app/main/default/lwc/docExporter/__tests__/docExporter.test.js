jest.mock(
  "@salesforce/resourceUrl/docx",
  () => {
    return {
      default: "docx"
    };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/resourceUrl/fileSaver",
  () => {
    return {
      default: "fileSaver"
    };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/resourceUrl/jspdf",
  () => {
    return {
      default: "jspdf"
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

import { buildDownloadArtifact } from "c/docExporter";

const mockObjects = [
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
];

describe("c-doc-exporter", () => {
  afterEach(() => {
    delete window.docx;
  });

  it("builds a markdown blob with an LWS-safe mime type", async () => {
    const artifact = await buildDownloadArtifact(mockObjects, {
      format: "md",
      includeSections: {}
    });

    expect(artifact.fileName).toBe("Order__c-documentation.md");
    expect(artifact.blob.type).toBe("text/markdown");
  });

  it("builds a docx blob with an octet-stream mime type", async () => {
    window.docx = {
      Document: class {},
      Paragraph: class {},
      Table: class {},
      TableRow: class {},
      TableCell: class {},
      TextRun: class {},
      WidthType: {
        PERCENTAGE: "PERCENTAGE"
      },
      HeadingLevel: {
        HEADING_1: "HEADING_1",
        HEADING_2: "HEADING_2",
        HEADING_3: "HEADING_3",
        HEADING_4: "HEADING_4"
      },
      Packer: {
        toBlob: jest.fn(() =>
          Promise.resolve(
            new Blob(["docx"], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            })
          )
        )
      }
    };

    const artifact = await buildDownloadArtifact(mockObjects, {
      format: "docx",
      includeSections: {}
    });

    expect(artifact.fileName).toBe("Order__c-documentation.docx");
    expect(artifact.blob.type).toBe("application/octet-stream");
  });
});
