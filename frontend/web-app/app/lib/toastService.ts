import { toast } from "react-hot-toast";

export const showToast = (
  message: string | null | undefined,
  type: "success" | "error" | "info" | "warning" = "info"
) => {
  if (!message) {
    message = "Merci de réessayer ultérieurement.";
  }

  switch (type) {
    case "success":
      toast.success(message, { position: "bottom-right" });
      break;
    case "error":
      toast.error(message, { position: "bottom-right" });
      break;
    case "warning":
      toast(message, { position: "bottom-right", icon: "⚠️" });
      break;
    default:
      toast(message, { position: "bottom-right" });
  }
};
