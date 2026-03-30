"use client";

import { toast } from "sonner";

type ToastConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function toastAlert(message: string, description?: string) {
  toast(message, { description });
}

export function toastConfirm({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: ToastConfirmOptions) {
  return new Promise<boolean>((resolve) => {
    let settled = false;

    const settle = (value: boolean) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const toastId: string | number = toast(title, {
      description,
      duration: Infinity,
      action: {
        label: confirmLabel,
        onClick: () => {
          toast.dismiss(toastId);
          settle(true);
        },
      },
      cancel: {
        label: cancelLabel,
        onClick: () => {
          toast.dismiss(toastId);
          settle(false);
        },
      },
    });
  });
}
