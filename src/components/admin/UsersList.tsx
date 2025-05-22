
import React, { useState } from "react";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  FileEdit, Trash2, Plus, Shield, ShieldAlert, Palette, 
  Clock, Calendar, Pen, RotateCw 
} from "lucide-react";
import SignatureModal from "./SignatureModal";
import { formatDistanceToNow } from "date-fns";

interface UsersListProps {
  users: User[];
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onSaveSignature: (user: User, signature: string) => void;
  onResetTime?: (userId: string) => void;
  currentUserId?: string;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onSaveSignature,
  onResetTime,
  currentUserId,
}) => {
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const getThemeDisplay = (theme?: string) => {
    if (!theme) return "Light (Default)";
    
    const themeName = theme.charAt(0).toUpperCase() + theme.slice(1);
    return themeName;
  };

  const formatTime = (time?: number) => {
    if (!time) return "0 minutes";
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  };

  const formatLoginDate = (date?: string) => {
    if (!date) return "Never";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleOpenSignatureModal = (user: User) => {
    setSelectedUser(user);
    setSignatureModalOpen(true);
  };

  const handleSaveSignature = (signature: string) => {
    if (selectedUser) {
      onSaveSignature(selectedUser, signature);
    }
  };
  
  const handleResetTime = (userId: string) => {
    if (onResetTime) {
      onResetTime(userId);
    }
  };

  const canEditSignature = (user: User) => {
    // Admin can edit any signature, users can only edit their own
    return user.id === currentUserId || (currentUserId && users.find(u => u.id === currentUserId)?.isAdmin);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Users</h2>
        <Button onClick={onAddUser}>
          <Plus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Admin Status</TableHead>
              <TableHead>Theme</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Total Usage</TableHead>
              <TableHead>Signature</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <span className="inline-flex items-center text-green-600">
                        <ShieldAlert className="h-4 w-4 mr-1" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-gray-600">
                        <Shield className="h-4 w-4 mr-1" />
                        Regular User
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center">
                      <Palette className="h-4 w-4 mr-1" />
                      {getThemeDisplay(user.theme)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatLoginDate(user.lastLogin)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(user.totalUsageTime)}
                      {onResetTime && user.id !== "Bryce" && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 ml-1"
                          onClick={() => handleResetTime(user.id)}
                        >
                          <RotateCw className="h-3 w-3" />
                        </Button>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.signature ? (
                      <div className="relative group">
                        <img 
                          src={user.signature} 
                          alt={`${user.username}'s signature`} 
                          className="h-10 max-w-[100px] object-contain"
                        />
                        {canEditSignature(user) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 text-white h-full w-full p-0"
                            onClick={() => handleOpenSignatureModal(user)}
                          >
                            <Pen className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    ) : (
                      canEditSignature(user) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenSignatureModal(user)}
                          className="inline-flex items-center"
                        >
                          <Pen className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditUser(user)}
                      className="inline-flex items-center"
                    >
                      <FileEdit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDeleteUser(user)}
                      className="inline-flex items-center text-destructive hover:text-destructive"
                      disabled={user.username === "Bryce"}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {signatureModalOpen && selectedUser && (
        <SignatureModal
          isOpen={signatureModalOpen}
          onClose={() => setSignatureModalOpen(false)}
          onSave={handleSaveSignature}
          currentSignature={selectedUser.signature}
        />
      )}
    </div>
  );
};

export default UsersList;
