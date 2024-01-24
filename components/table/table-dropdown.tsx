"use client";
// shadcnui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// components
import { Button } from "@/components/ui/button";
// icons
import { FaEllipsisVertical } from "react-icons/fa6";

type Props = {
  isLoading: boolean;
  actionButton: string;
  modalData: {
    modalTitle: string;
    modalContent: string;
    modalButton: string;
  };
  deleteData: {
    onDelete: (id: string) => Promise<void>;
    deleteId: string;
    deleteButton: string;
  };
  updateRole?: {
    onUpdateUserRole: (id: string, role: string, task: string) => Promise<void>;
    userRoleData: {
      id: string;
      role: string;
      task: string;
    };
  };
  navigateData?: {
    onNavigate: (path: string) => void;
    navigatePath: string;
  };
};

const TableDropdown = ({
  isLoading,
  actionButton,
  updateRole,
  deleteData,
  modalData,
  navigateData,
}: Props) => {
  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <FaEllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {updateRole && (
              <DropdownMenuItem
                onClick={() =>
                  updateRole.onUpdateUserRole(
                    updateRole.userRoleData.id,
                    updateRole.userRoleData.role,
                    updateRole.userRoleData.task
                  )
                }
              >
                {actionButton}
              </DropdownMenuItem>
            )}
            {navigateData && (
              <DropdownMenuItem
                onClick={() =>
                  navigateData.onNavigate(navigateData.navigatePath)
                }
              >
                {actionButton}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem className="bg-red-600 text-white hover:bg-red-700 transition-300">
                {deleteData.deleteButton}
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalData.modalTitle}</DialogTitle>
            <DialogDescription className="pt-2">
              {modalData.modalContent}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 transition-300"
              onClick={() => deleteData.onDelete(deleteData.deleteId)}
              disabled={isLoading}
            >
              {modalData.modalButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableDropdown;
