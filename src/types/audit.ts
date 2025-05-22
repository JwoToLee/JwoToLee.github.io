
export interface Audit {
  id: string;
  reference: string;
  name: string;
  type: string;
  subtype?: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  assignedUsers: AssignedUser[];
  createdAt: string;
  updatedAt: string;
  objective?: string;
  scope?: string;
  introduction?: string;
}

export interface AssignedUser {
  id: string;
  username: string;
  role: string;
}

export interface StaffData {
  id: string;
  staffNumber: string;
  staffName: string;
  staffScope: string;
}

export interface ToolData {
  id: string;
  serialNumber: string;
  description: string;
  dueDate: string;
}

export interface ComponentData {
  id: string;
  batchNumber: string;
  description: string;
  arc: string; // Authorized Release Certificate
}

export interface MaintenanceData {
  id: string;
  reference: string; // PMO/WSO reference
  taskName: string;
  operationNumber: string;
  revisionIndicator: string;
}

export interface AuditFinding {
  id: string;
  auditRef: string;
  checklistItemId: string;
  finding: string;
  observation: string;
  year: string;
  isHistorical: boolean;
  findingLevel?: 'Level 1' | 'Level 2' | 'Observation';
  staffNumber?: string;
  staffName?: string;
  staffScope?: string;
  // Additional data for specific clauses
  staffData?: StaffData[];
  toolData?: ToolData[];
  componentData?: ComponentData[];
  maintenanceData?: MaintenanceData[];
  // For file attachments
  attachments?: {name: string, type: string, data: string}[];
  // Fields that might be in CSV imports
  clause?: string;
  reference?: string;
  date?: string;
}

export type AuditWithFindings = Audit & {
  findings: AuditFinding[];
};

export interface AuditTemplate {
  type: string;
  subtype?: string;
  objective: string;
  scope: string;
  introduction: string;
}
