import { analyzeImpact } from "c/impactAnalyzer";

describe("c-impact-analyzer", () => {
  it("classifies field dependencies by severity", () => {
    const result = analyzeImpact(
      {
        type: "field",
        fieldApiName: "Amount__c",
        objectApiName: "Order__c"
      },
      {
        flows: [{ name: "Order Flow", referenceText: "Amount__c" }],
        validationRules: [
          { name: "Amount Required", isActive: true, referenceText: "Amount__c" }
        ],
        apexClasses: [{ name: "OrderService", referenceText: "Amount__c" }],
        reports: [{ name: "Order Report", referenceText: "Amount__c" }],
        dashboards: [{ name: "Order Dashboard", referenceText: "Amount__c" }],
        pageLayouts: [{ name: "Order Layout", fields: ["Amount__c"] }],
        workflowRules: [
          { name: "Order Workflow", isActive: false, referenceText: "Amount__c" }
        ],
        formulas: [{ name: "Total", referenceText: "Amount__c" }]
      }
    );

    expect(result.total).toBe(8);
    expect(result.critical).toHaveLength(4);
    expect(result.warning).toHaveLength(3);
    expect(result.safe).toHaveLength(1);
    expect(result.blocked).toBe(true);
  });
});
