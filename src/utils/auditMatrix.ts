// This file contains the matrix that maps audit types to their requirements

export type AuditChecklistItem = {
  id: string;
  clause: string;
  objective: string;
  description: string;
  required: boolean;
};

type AuditMatrix = Record<string, AuditChecklistItem[]>;

export const auditMatrix: AuditMatrix = {
  compliance: [
    {
      id: "c-1",
      clause: "145.A.10 Scope",
      objective: "Verify organization's scope of approval",
      description: "Assess if the organization operates within its defined and approved scope.",
      required: true,
    },
    {
      id: "c-2",
      clause: "145.A.15 Application for an organisation certificate",
      objective: "Verify application compliance",
      description: "Confirm that the organization has submitted the correct application forms and documentation.",
      required: true,
    },
    {
      id: "c-3",
      clause: "145.A.20 Terms of approval and scope of work",
      objective: "Verify terms of approval",
      description: "Check that the organization operates within the terms of its approval.",
      required: true,
    },
    {
      id: "c-4",
      clause: "145.A.25 Facility requirements",
      objective: "Verify facility compliance",
      description: "Assess if facilities meet the requirements for the work performed.",
      required: true,
    },
    {
      id: "c-5",
      clause: "145.A.30 Personnel requirements",
      objective: "Verify personnel qualifications",
      description: "Review personnel qualifications, experience, and training records.",
      required: true,
    },
    {
      id: "c-6",
      clause: "145.A.35 Certifying staff and support staff",
      objective: "Verify certifying staff compliance",
      description: "Check that certifying staff are properly qualified and authorized.",
      required: true,
    },
    {
      id: "c-7",
      clause: "145.A.37 Airworthiness review staff",
      objective: "Verify airworthiness review staff",
      description: "Ensure airworthiness review staff meet qualification and experience requirements.",
      required: true,
    },
    {
      id: "c-8",
      clause: "145.A.40 Equipment and tools",
      objective: "Verify equipment and tools",
      description: "Validate that equipment and tools are appropriate, calibrated and maintained.",
      required: true,
    },
    {
      id: "c-9",
      clause: "145.A.42 Components",
      objective: "Verify component management",
      description: "Review procedures for accepting and classifying components.",
      required: true,
    },
    {
      id: "c-10",
      clause: "145.A.45 Maintenance data",
      objective: "Verify maintenance data",
      description: "Check that appropriate and current maintenance data is available and used.",
      required: true,
    },
    {
      id: "c-11",
      clause: "145.A.47 Production planning",
      objective: "Verify production planning",
      description: "Assess the effectiveness of production planning procedures.",
      required: true,
    },
    {
      id: "c-12",
      clause: "145.A.48 Performance of maintenance",
      objective: "Verify maintenance performance",
      description: "Ensure maintenance is performed according to requirements.",
      required: true,
    },
    {
      id: "c-13",
      clause: "145.A.50 Certification of maintenance",
      objective: "Verify maintenance certification",
      description: "Check that maintenance is properly certified with appropriate documentation.",
      required: true,
    },
    {
      id: "c-14",
      clause: "145.A.55 Record-keeping",
      objective: "Verify maintenance records",
      description: "Review maintenance records for completeness and retention.",
      required: true,
    },
    {
      id: "c-15",
      clause: "145.A.60 Occurrence reporting",
      objective: "Verify occurrence reporting",
      description: "Assess the reporting of occurrences that seriously hazard aircraft.",
      required: true,
    },
    {
      id: "c-16",
      clause: "145.A.65 Maintenance procedures",
      objective: "Verify maintenance procedures",
      description: "Review the organization's maintenance procedures and processes.",
      required: true,
    },
    {
      id: "c-17",
      clause: "145.A.70 Maintenance organisation exposition (MOE)",
      objective: "Verify MOE compliance",
      description: "Check that the Maintenance Organization Exposition is current and followed.",
      required: true,
    },
    {
      id: "c-18",
      clause: "145.A.75 Privileges of the organisation",
      objective: "Verify organizational privileges",
      description: "Assess if the organization operates within its privileges.",
      required: true,
    },
    {
      id: "c-19",
      clause: "145.A.85 Changes to the organisation",
      objective: "Verify change management",
      description: "Review procedures for notifying the authority of changes.",
      required: true,
    },
    {
      id: "c-20",
      clause: "145.A.90 Continued validity",
      objective: "Verify continued validity",
      description: "Assess continued validity of organization approval.",
      required: true,
    },
    {
      id: "c-21",
      clause: "145.A.95 Findings and observations",
      objective: "Verify findings management",
      description: "Review how the organization deals with findings.",
      required: true,
    },
    {
      id: "c-22",
      clause: "145.A.120 Means of compliance",
      objective: "Verify means of compliance",
      description: "Check that the organization uses approved means of compliance.",
      required: true,
    },
    {
      id: "c-23",
      clause: "145.A.140 Access",
      objective: "Verify authority access",
      description: "Check that the organization provides appropriate authority access.",
      required: true,
    },
    {
      id: "c-24",
      clause: "145.A.155 Immediate reaction to a safety problem",
      objective: "Verify safety response",
      description: "Assess ability to respond to immediate safety threats.",
      required: true,
    },
    {
      id: "c-25",
      clause: "145.A.200 Management system",
      objective: "Verify management system",
      description: "Assess effectiveness of the organization's management system.",
      required: true,
    },
    {
      id: "c-26",
      clause: "145.A.200A Information security management system",
      objective: "Verify information security",
      description: "Review the organization's information security management system.",
      required: true,
    },
    {
      id: "c-27",
      clause: "145.A.202 Internal safety reporting scheme",
      objective: "Verify safety reporting",
      description: "Assess the internal safety reporting scheme effectiveness.",
      required: true,
    },
    {
      id: "c-28",
      clause: "145.A.205 Contracting and subcontracting",
      objective: "Verify contracting activities",
      description: "Review processes for contracting and subcontracting maintenance activities.",
      required: true,
    },
  ],
  product: [
    {
      id: "p-1",
      clause: "145.A.48 Performance of maintenance",
      objective: "Verify maintenance performance",
      description: "Ensure maintenance is performed according to requirements.",
      required: true,
    },
    {
      id: "p-2",
      clause: "145.A.50 Certification of maintenance",
      objective: "Verify maintenance certification",
      description: "Check that maintenance is properly certified with appropriate documentation.",
      required: true,
    },
    {
      id: "p-3",
      clause: "145.A.55 Record-keeping",
      objective: "Verify maintenance records",
      description: "Review maintenance records for completeness and retention.",
      required: true,
    },
    {
      id: "p-4",
      clause: "145.A.60 Occurrence reporting",
      objective: "Verify occurrence reporting",
      description: "Assess the reporting of occurrences that seriously hazard aircraft.",
      required: true,
    },
    {
      id: "p-5",
      clause: "145.A.65 Maintenance procedures",
      objective: "Verify maintenance procedures",
      description: "Review the organization's maintenance procedures and processes.",
      required: true,
    },
  ],
  process: [
    {
      id: "pr-1",
      clause: "145.A.75 Privileges of the organisation",
      objective: "Verify organizational privileges",
      description: "Assess if the organization operates within its privileges.",
      required: true,
    },
    {
      id: "pr-2",
      clause: "145.A.85 Changes to the organisation",
      objective: "Verify change management",
      description: "Review procedures for notifying the authority of changes.",
      required: true,
    },
    {
      id: "pr-3",
      clause: "145.A.90 Continued validity",
      objective: "Verify continued validity",
      description: "Assess continued validity of organization approval.",
      required: true,
    },
    {
      id: "pr-4",
      clause: "145.A.95 Findings and observations",
      objective: "Verify findings management",
      description: "Review how the organization deals with findings.",
      required: true,
    },
    {
      id: "pr-5",
      clause: "145.A.120 Means of compliance",
      objective: "Verify means of compliance",
      description: "Check that the organization uses approved means of compliance.",
      required: true,
    },
  ],
  unannounced: [
    {
      id: "u-1",
      clause: "145.A.140 Access",
      objective: "Verify authority access",
      description: "Check that the organization provides appropriate authority access.",
      required: true,
    },
    {
      id: "u-2",
      clause: "145.A.155 Immediate reaction to a safety problem",
      objective: "Verify safety response",
      description: "Assess ability to respond to immediate safety threats.",
      required: true,
    },
    {
      id: "u-3",
      clause: "145.A.200 Management system",
      objective: "Verify management system",
      description: "Assess effectiveness of the organization's management system.",
      required: true,
    },
    {
      id: "u-4",
      clause: "145.A.200A Information security management system",
      objective: "Verify information security",
      description: "Review the organization's information security management system.",
      required: true,
    },
    {
      id: "u-5",
      clause: "145.A.202 Internal safety reporting scheme",
      objective: "Verify internal safety reporting",
      description: "Assess the effectiveness of the internal safety reporting scheme.",
      required: true,
    },
  ],
  unscheduled: [
    {
      id: "us-1",
      clause: "145.A.205 Contracting and subcontracting",
      objective: "Verify contracting activities",
      description: "Review processes for contracting and subcontracting maintenance activities.",
      required: true,
    },
    {
      id: "us-2",
      clause: "145.A.42 Components",
      objective: "Verify component management",
      description: "Review procedures for accepting and classifying components.",
      required: true,
    },
    {
      id: "us-3",
      clause: "145.A.45 Maintenance data",
      objective: "Verify maintenance data",
      description: "Check that appropriate and current maintenance data is available and used.",
      required: true,
    },
    {
      id: "us-4",
      clause: "145.A.47 Production planning",
      objective: "Verify production planning",
      description: "Assess the effectiveness of production planning procedures.",
      required: true,
    },
    {
      id: "us-5",
      clause: "145.A.48 Performance of maintenance",
      objective: "Verify maintenance performance",
      description: "Ensure maintenance is performed according to requirements.",
      required: true,
    },
  ],
};

// Create matrices for compliance audit subtypes
export const complianceSubtypeMatrix: Record<string, string[]> = {
  "EO & CR": ["c-1", "c-2", "c-3", "c-10", "c-15", "c-20"],
  "QA": ["c-4", "c-14", "c-15", "c-24", "c-25", "c-27"],
  "TS": ["c-5", "c-7", "c-8", "c-9", "c-11", "c-12"],
  "CCB & PBS": ["c-6", "c-13", "c-14", "c-16", "c-17", "c-18"],
  "SP & MM": ["c-18", "c-19", "c-20", "c-21", "c-22", "c-23"],
  "SI": ["c-4", "c-8", "c-10", "c-24", "c-26", "c-28"],
  "IT": ["c-14", "c-15", "c-24", "c-26", "c-27", "c-28"]
};

// Create matrices for process audit subtypes
export const processSubtypeMatrix: Record<string, string[]> = {
  "NADCAP HT": ["pr-1", "pr-2", "pr-3"],
  "NADCAP SE": ["pr-2", "pr-3", "pr-4"],
  "NADCAP NDT": ["pr-1", "pr-3", "pr-5"],
  "NADCAP WELD": ["pr-2", "pr-4", "pr-5"],
  "NADCAP CP": ["pr-1", "pr-2", "pr-5"],
  "NADCAP COATING": ["pr-3", "pr-4", "pr-5"]
};

export const getAuditChecklist = (auditType: string, subtype?: string): AuditChecklistItem[] => {
  const baseList = auditMatrix[auditType.toLowerCase()] || [];
  
  if (!subtype) return baseList;
  
  // For compliance audit subtypes
  if (auditType.toLowerCase() === "compliance" && complianceSubtypeMatrix[subtype]) {
    return baseList.filter(item => complianceSubtypeMatrix[subtype].includes(item.id));
  }
  
  // For process audit subtypes
  if (auditType.toLowerCase() === "process" && processSubtypeMatrix[subtype]) {
    return baseList.filter(item => processSubtypeMatrix[subtype].includes(item.id));
  }
  
  return baseList;
};

// Function to export the audit matrix
export const exportAuditMatrix = () => {
  const matrixData = Object.entries(auditMatrix).flatMap(([type, items]) =>
    items.map(item => ({
      type,
      id: item.id,
      clause: item.clause,
      objective: item.objective,
      description: item.description,
      required: item.required ? "Yes" : "No"
    }))
  );
  
  return matrixData;
};

// Function to import audit matrix data
export const importAuditMatrix = (matrixData: any[]) => {
  const newMatrix: AuditMatrix = {};
  
  matrixData.forEach(row => {
    if (!row.type || !row.id || !row.clause) return;
    
    if (!newMatrix[row.type]) {
      newMatrix[row.type] = [];
    }
    
    newMatrix[row.type].push({
      id: row.id,
      clause: row.clause,
      objective: row.objective || "",
      description: row.description || "",
      required: row.required === "Yes" || row.required === true
    });
  });
  
  return newMatrix;
};
