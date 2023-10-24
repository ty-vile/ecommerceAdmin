"use client";

// shadcn
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// hooks
import { useEffect, useState } from "react";

type ModalProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}) => {
  // NOTES -- STOP HYDRATION ERROR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <>{children}</>
        </DialogContent>
      </Dialog>
    </div>
  );
};
