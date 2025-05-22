
// This is a proxy file that imports and re-exports from auditStorage.ts
// to maintain compatibility with existing code
import {
  getUsers,
  saveUser,
  deleteUser,
  getAudits,
  saveAudit,
  deleteAudit,
  getAuditTemplates,
  saveAuditTemplate,
  // deleteAuditTemplate is not exported from auditStorage.ts
} from './auditStorage';

export {
  getUsers,
  saveUser,
  deleteUser,
  getAudits,
  saveAudit,
  deleteAudit,
  getAuditTemplates,
  saveAuditTemplate,
  // We need to create this function ourselves since it's not exported from auditStorage
};

// Create the missing function
export const deleteAuditTemplateFromStorage = (type: string): void => {
  // Get the existing templates
  const templates = getAuditTemplates();
  // Filter out the template with the matching type
  const updatedTemplates = templates.filter((template: any) => template.type !== type);
  // Save the updated templates back to localStorage
  localStorage.setItem('auditTemplates', JSON.stringify(updatedTemplates));
};
