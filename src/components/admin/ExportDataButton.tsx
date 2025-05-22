
import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { exportAllDataToExcel } from '@/utils/excelExport';
import { User } from "@/types/user";
import { Audit, AuditTemplate } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

interface ExportDataButtonProps {
  users: User[];
  audits: Audit[];
  templates: AuditTemplate[];
}

const ExportDataButton: React.FC<ExportDataButtonProps> = ({ 
  users, 
  audits, 
  templates 
}) => {
  const { toast } = useToast();

  const handleExport = () => {
    try {
      const data = {
        users,
        audits,
        templates
      };
      
      exportAllDataToExcel(data);
      toast({
        title: "Data exported",
        description: "All data exported successfully.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Error exporting data.",
      });
    }
  };

  return (
    <Button 
      onClick={handleExport}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Export All Data
    </Button>
  );
};

export default ExportDataButton;
