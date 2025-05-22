
// Default templates for audit reports
export const complianceAuditReportTemplate = `Audit Ref.	:  {{AUDIT_REF}}	Report date: {{REPORT_DATE}} 
Audit date	:  {{START_DATE}} – {{END_DATE}}						

{{AUDIT_TYPE}}: {{AUDIT_NAME}}

0.	Introduction

It is the regulatory requirement (Typical EASA 145.A.200(a)(6), etc.) to perform an independent audit for all aspects of the organisation to required standards every twelve (12) months.  According to {{AUDIT_YEAR}} Internal Audit Plan, a {{AUDIT_TYPE_LOWER}} to the maintenance activities in {{AUDIT_NAME}} was conducted in {{AUDIT_MONTH}}.

1.	Executive Summary

1.1	Audit Objective:	{{AUDIT_OBJECTIVE}}

1.2	Audit Scope:	{{AUDIT_SCOPE}}

1.3	Audit Criteria:	Various NAA's Part 145 regulations, 
{{CRITERIA_LIST}}

1.4 	Findings:	{{FINDING_COUNT}} Level 2 and {{OBSERVATION_COUNT}} Observations
1.4.1	Level 2:	{{FINDINGS_BULLET_LIST}}
1.4.2	Observation:	{{OBSERVATIONS_BULLET_LIST}}

{{AUDITOR_SIGNATURES}}
 
2.	Details of Compliance Audit

2.1	Previous Audit

{{PREVIOUS_AUDIT_DETAILS}}

2.2	Facility requirements (Typical 145.A.25)

2.2.1	Workstations were available for Engineers / Supervisors to perform their designated tasks. Sufficient working areas were provided for reading maintenance instructions and completing maintenance records.

2.2.2	The facilities were provided appropriate for all planned work and ensuring protection from weather elements. The component workshops were large enough to accommodate the components on planned maintenance.

2.2.3	The facilities were sufficiently illuminated throughout with conventional lights. The minimum background illumination of the surface to be inspected must be 2000 lux at 8" perpendicular to the work surface. In Bench Inspection, a demonstration of lighting intensity measurement was carried out and found over 2000 lux. It was verified and found satisfactory.

2.2.4	Temperature and Humidity Log Sheet (FORM03563) in Painting area and NDT Process Area Temperature Log (FORM03283) were sample reviewed and verified that temperature and humidity were under control and recorded.

2.2.5	The emergency shower and eye wash station at CR Shop and its record were checked and found satisfactory.

2.2.6	Record of temperature and humidity control in CR Phase II Calibration Room were reviewed. It was confirmed that results were all within ISO17025:2017 requirements and national standard specification. Storage conditions for pending or completed calibration tools were reviewed, the areas were segregated as appropriately to prevent from contamination and damage. For the details, refer to ISO/IEC 17025 internal audit report and audit checklist.

2.3	Personnel Requirements (Typical 145.A.30)

{{PERSONNEL_REQUIREMENTS}}

{{ADDITIONAL_SECTION_CONTENT}}

{{FINDINGS_SECTION}}

Appendix I: NAA Regulation Audit Matrix
  
Appendix II: Layout of Premises

Appendix III: Pictures/Evidence
`;

// Helper function to generate placeholder sections for new reports
export const getDefaultReportSections = () => {
  return {
    personnelRequirements: 
`2.3.1	Sample checked staff competency matrix. The mandatory gates 1 to 3 were completed within 3 years. For specific training requirement, it was verified OJT records for Gate 4 matrix aligned with the functions in their license record.

2.3.2	Reviewed Staff On-duties table of all workshop areas and found satisfactory.`,
    
    additionalSections:
`2.4	Certifying Staff and Support Staff (Typical 145.A.35)

2.4.1	The staff were sampled and reviewed against their scope of work and limitations. They had completed the regulatory, human factors and SMS training / refresher training. Their practical training record and experience log were also reviewed and found complied with the department procedures requirements.

2.5	Equipment and Tools (Typical 145.A.40)

2.5.1	The equipment and tools were maintained in accordance with the maintenance schedule which was recommended by the manufacturer. Equipment that required calibration was calibrated in accordance with the calibration schedule.

2.6	Components (Typical 145.A.42)

2.6.1	The materials were reviewed and found accompanied by Certificates of Conformity in accordance with standard procedures.

2.7	Maintenance Data (Typical 145.A.45)

2.7.1	Technical Services has prepared the working instructions and presented in the work card by using applicable Engine Manual.

2.8	Production Planning (Typical 145.A.47)

2.8.1	A Handover Book was utilized to ensure effective communication between shifts, and safe completion of maintenance.

2.9	Performance of Maintenance (Typical 145.A.48)

2.9.1	Sample maintenance tasks were observed and found to be performed in accordance with procedures.

2.10	Certification of Maintenance (Typical 145.A.50)

2.10.1	Certifying staff were sampled and reviewed for their release certification authorisation.

2.11	Record Keeping (Typical 145.A.55)

2.11.1	Maintenance records were randomly selected and reviewed for their correct transcription.

2.12	Occurrence Reporting (Typical 145.A.60)

2.12.1	Staff are knowledgeable and familiar with the Mandatory Occurrence Reporting (MOR).

2.13	Maintenance Procedures (Typical 145.A.65) 

2.13.1	Sample checked staff training record, it was confirmed that the human factor training was completed in the required period.

2.14	Maintenance Organisation Exposition (MOE) (Typical 145.A.70)

2.14.1	Procedure manuals and the scope of work were reviewed against applicable regulations.`,
    
    findingsSection:
`3.	Summary of Findings

There were {{FINDING_COUNT}} findings identified in this audit:

{{DETAILED_FINDINGS}}`
  };
};
