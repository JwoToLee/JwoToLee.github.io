
import React from "react";
import { UserRole } from "@/types/user";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeName } from "@/utils/themeContext";

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: any;
  onUserChange: (field: string, value: any) => void;
  onSaveUser: () => void;
}

const UserDialog: React.FC<UserDialogProps> = ({
  isOpen,
  onOpenChange,
  currentUser,
  onUserChange,
  onSaveUser,
}) => {
  const themeOptions: { value: ThemeName; label: string }[] = [
    { value: 'light', label: 'Light Mode' },
    { value: 'dark', label: 'Dark Mode' },
    { value: 'green', label: 'Green Theme' },
    { value: 'blue', label: 'Blue Theme' },
    { value: 'purple', label: 'Purple Theme' },
    { value: 'amber', label: 'Amber Theme' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {currentUser && currentUser.id ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogDescription>
            Enter the user details below
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="pr-4 max-h-[60vh]">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={currentUser?.username || ""}
                onChange={(e) => onUserChange("username", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={currentUser?.password || ""}
                onChange={(e) => onUserChange("password", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select 
                value={currentUser?.role || ""} 
                onValueChange={(value) => onUserChange("role", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Auditor">Auditor</SelectItem>
                  <SelectItem value="Lead Auditor">Lead Auditor</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="theme" className="text-right">
                Theme
              </Label>
              <Select 
                value={currentUser?.theme || "light"} 
                onValueChange={(value) => onUserChange("theme", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select theme preference" />
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSaveUser}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
