
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Audit, AuditFinding, AuditTemplate } from '@/types/audit';
import { AuditChecklistItem } from '@/utils/auditMatrix';
import { User } from '@/types/user';

export const exportToExcel = (
  auditRef: string, 
  auditName: string, 
  checklist: AuditChecklistItem[], 
  findings: Record<string, any>
) => {
  // Convert findings to a format suitable for Excel
  const data = checklist.map(item => {
    const finding = findings[item.id] || { hasFinding: false, finding: '', observation: '' };
    
    return {
      'Clause': item.clause,
      'Objective': item.objective,
      'Description': item.description,
      'Finding Identified': finding.hasFinding ? 'Yes' : 'No',
      'Finding Details': finding.finding || '',
      'Observations': finding.observation || '',
      'Required': item.required ? 'Yes' : 'No',
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Add additional data about the audit
  XLSX.utils.sheet_add_aoa(worksheet, [
    [`Audit Reference: ${auditRef}`],
    [`Audit Name: ${auditName}`],
    [`Export Date: ${new Date().toLocaleDateString()}`],
    [''],  // Empty row before the data
  ], { origin: 'A1' });

  // Auto-size columns
  const max_width = data.reduce((w, r) => Math.max(w, r['Clause'].length), 10);
  const max_desc = data.reduce((w, r) => Math.max(w, r['Description'].length), 20);
  worksheet['!cols'] = [
    { wch: 15 },             // Clause
    { wch: 25 },             // Objective
    { wch: max_desc },       // Description
    { wch: 15 },             // Finding Identified
    { wch: 40 },             // Finding Details
    { wch: 40 },             // Observations
    { wch: 10 },             // Required
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Checklist');

  // Create buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  
  // Save file
  saveAs(blob, `Audit_${auditRef}_${new Date().toISOString().slice(0,10)}.xlsx`);
};

// Function to export all audits data to Excel
export const exportAllDataToExcel = (data: {
  users: User[];
  audits: Audit[];
  templates: AuditTemplate[];
}) => {
  // Create worksheet for audits
  const auditData = data.audits.map(audit => {
    return {
      'Reference': audit.reference,
      'Name': audit.name,
      'Type': audit.type,
      'Subtype': audit.subtype || '',
      'Description': audit.description,
      'Start Date': audit.startDate,
      'End Date': audit.endDate,
      'Status': audit.status,
      'Assigned Users': audit.assignedUsers.map(u => `${u.username} (${u.role})`).join(", "),
      'Created': audit.createdAt,
      'Updated': audit.updatedAt,
    };
  });

  const auditWorksheet = XLSX.utils.json_to_sheet(auditData);
  
  // Create worksheet for users
  const userData = data.users.map(user => {
    return {
      'Username': user.username,
      'Role': user.role,
      'Admin Access': user.isAdmin ? 'Yes' : 'No',
      'Theme': user.theme || 'Default',
      'Last Login': user.lastLogin || 'Never',
      'Usage Time': user.totalUsageTime ? `${Math.floor(user.totalUsageTime / 60)} minutes` : '0 minutes'
    };
  });
  
  const userWorksheet = XLSX.utils.json_to_sheet(userData);
  
  // Create worksheet for templates
  const templateData = data.templates.map(template => {
    return {
      'Type': template.type,
      'Subtype': template.subtype || '',
      'Objective': template.objective,
      'Scope': template.scope
    };
  });
  
  const templateWorksheet = XLSX.utils.json_to_sheet(templateData);
  
  // Auto-size columns
  auditWorksheet['!cols'] = [
    { wch: 12 },  // Reference
    { wch: 30 },  // Name
    { wch: 15 },  // Type
    { wch: 15 },  // Subtype
    { wch: 40 },  // Description
    { wch: 12 },  // Start Date
    { wch: 12 },  // End Date
    { wch: 12 },  // Status
    { wch: 40 },  // Assigned Users
    { wch: 20 },  // Created
    { wch: 20 },  // Updated
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, auditWorksheet, 'Audits');
  XLSX.utils.book_append_sheet(workbook, userWorksheet, 'Users');
  XLSX.utils.book_append_sheet(workbook, templateWorksheet, 'Templates');

  // Create buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  
  // Save file
  saveAs(blob, `All_Data_${new Date().toISOString().slice(0,10)}.xlsx`);
};

export const exportMatrixToExcel = (matrix: any[]) => {
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(matrix);
  
  // Auto-size columns
  worksheet['!cols'] = [
    { wch: 15 },  // Type
    { wch: 10 },  // ID
    { wch: 30 },  // Clause
    { wch: 40 },  // Objective
    { wch: 50 },  // Description
    { wch: 10 },  // Required
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Matrix');

  // Create buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  
  // Save file
  saveAs(blob, `Audit_Matrix_${new Date().toISOString().slice(0,10)}.xlsx`);
};
