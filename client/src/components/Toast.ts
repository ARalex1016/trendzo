import toast from "react-hot-toast";

const notify = {
  success: (message: string) => toast.success(message),

  error: (message: string) => toast.error(message),

  loading: (message: string) => toast.loading(message),

  dismiss: (id?: string) => toast.dismiss(id),

  custom: (message: string) => toast(message),
};

export default notify;
