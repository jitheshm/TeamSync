import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { AlertDialogComponent } from "@/components/common/AlertDialogComponent"; 

interface ConfirmResult {
  isConfirm: boolean;
}

export function useAlertDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [resolveFn, setResolveFn] = useState<((value: ConfirmResult) => void) | null>(null);

  useEffect(() => {
    if (isOpen && typeof document !== "undefined") {
      const container = document.createElement("div");
      document.body.appendChild(container);

      const root = ReactDOM.createRoot(container);
      root.render(
        <AlertDialogComponent
          isOpen={isOpen}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      );

      return () => {
        setTimeout(() => {
          root.unmount();
          document.body.removeChild(container);
        });
      };
    }
  }, [isOpen]);

  const confirm = (): Promise<ConfirmResult> => {
    return new Promise<ConfirmResult>((resolve) => {
      setResolveFn(() => resolve);
      setIsOpen(true); 
    });
  };

  const handleCancel = () => {
    if (resolveFn) resolveFn({ isConfirm: false });
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (resolveFn) resolveFn({ isConfirm: true });
    setIsOpen(false);
  };

  const confirmWithDialog = async (): Promise<ConfirmResult> => {
    const result = await confirm();
    return result;
  };

  return { confirm: confirmWithDialog };
}
