
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  getUsers,
  saveUser,
  deleteUser as deleteUserFromStorage,
  getAudits,
  saveAudit,
  deleteAudit as deleteAuditFromStorage,
  getAuditTemplates,
  saveAuditTemplate,
  deleteAuditTemplateFromStorage,
} from '@/utils/dataStorage';
import { User } from "@/types/user";
import { Audit, AuditTemplate } from "@/types/audit";

export function useAdminData() {
  const [users, setUsers] = useState<User[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [templates, setTemplates] = useState<AuditTemplate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setUsers(getUsers());
    setAudits(getAudits());
    setTemplates(getAuditTemplates());
  };

  // User operations
  const addUser = (user: User) => {
    saveUser(user);
    loadData();
    toast({
      title: "User added",
      description: `Successfully added user ${user.username}.`,
    });
  };

  const updateUser = (user: User) => {
    saveUser(user);
    loadData();
    toast({
      title: "User updated",
      description: `Successfully updated user ${user.username}.`,
    });
  };

  const deleteUser = (id: string) => {
    deleteUserFromStorage(id);
    loadData();
    toast({
      title: "User deleted",
      description: "Successfully deleted user.",
    });
  };

  // Audit operations
  const addAudit = (audit: Audit) => {
    saveAudit(audit);
    loadData();
    toast({
      title: "Audit added",
      description: `Successfully added audit ${audit.name}.`,
    });
  };

  const updateAudit = (audit: Audit) => {
    saveAudit(audit);
    loadData();
    toast({
      title: "Audit updated",
      description: `Successfully updated audit ${audit.name}.`,
    });
  };

  const deleteAudit = (id: string) => {
    deleteAuditFromStorage(id);
    loadData();
    toast({
      title: "Audit deleted",
      description: "Successfully deleted audit.",
    });
  };

  // Template operations
  const addTemplate = (template: AuditTemplate) => {
    saveAuditTemplate(template);
    loadData();
    toast({
      title: "Template added",
      description: `Successfully added template ${template.type}.`,
    });
  };

  const updateTemplate = (template: AuditTemplate) => {
    saveAuditTemplate(template);
    loadData();
    toast({
      title: "Template updated",
      description: `Successfully updated template ${template.type}.`,
    });
  };

  const deleteTemplate = (id: string) => {
    deleteAuditTemplateFromStorage(id);
    loadData();
    toast({
      title: "Template deleted",
      description: "Successfully deleted template.",
    });
  };

  return {
    users,
    audits,
    templates,
    addUser,
    updateUser,
    deleteUser,
    addAudit,
    updateAudit,
    deleteAudit,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    loadData
  };
}
