"use client";

// components
import { Modal } from "@/components/ui/modal";
// store
import { useStoreModal } from "@/hooks/useStoreModal";

export const StoreModal = () => {
  const storeModal = useStoreModal();

  return (
    <Modal
      title="Create Store"
      description="Create a new store to manage products"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      Future Create Store Form
    </Modal>
  );
};
