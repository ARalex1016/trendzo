import Swal from "sweetalert2";

interface AlertProps {
  title?: string;
  text?: string;
  icon?: "warning" | "success" | "error" | "question";
  showConfirmButton?: boolean;
  confirmButtonText?: string;
  showCancelButton?: boolean;
  timer?: number;
}

const Alert = async ({
  title = "Are you sure?",
  text,
  icon = "success",
  showConfirmButton = true,
  confirmButtonText = "Yes, delete it!",
  showCancelButton = false,
  timer,
}: AlertProps) => {
  return Swal.fire({
    title,
    text,
    icon,
    showConfirmButton,
    showCancelButton,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
    timer,
  });
};

export default Alert;
