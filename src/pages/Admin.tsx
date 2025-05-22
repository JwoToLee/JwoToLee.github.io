
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminData } from '@/hooks/useAdminData';
import UsersTab from '@/components/admin/UsersTab';
import AuditsTab from '@/components/admin/AuditsTab';
import TemplatesTab from '@/components/admin/TemplatesTab';
import ExportDataButton from '@/components/admin/ExportDataButton';

const Admin = () => {
  const {
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
  } = useAdminData();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="users" className="w-[100%]">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UsersTab 
            users={users}
            onAddUser={addUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
          />
        </TabsContent>
        
        <TabsContent value="audits">
          <AuditsTab 
            audits={audits}
            onAddAudit={addAudit}
            onUpdateAudit={updateAudit}
            onDeleteAudit={deleteAudit}
          />
        </TabsContent>
        
        <TabsContent value="templates">
          <TemplatesTab 
            templates={templates}
            onAddTemplate={addTemplate}
            onUpdateTemplate={updateTemplate}
            onDeleteTemplate={deleteTemplate}
          />
        </TabsContent>
      </Tabs>

      <ExportDataButton 
        users={users}
        audits={audits}
        templates={templates}
      />
    </div>
  );
};

export default Admin;
