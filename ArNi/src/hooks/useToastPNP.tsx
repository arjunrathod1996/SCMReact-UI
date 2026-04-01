import { toast } from 'react-toastify';
import { ReactNode } from 'react';

export function useToastPNP() {
  // Success toast function
  const successTest = (title: ReactNode, body: ReactNode, delay = 4500) =>
    toast.success(<div><strong>{title}</strong><br />{body}</div>, { autoClose: delay });

  // Danger (Error) toast function
  const dangerTest = (title: ReactNode, body: ReactNode, delay = 4500) =>
    toast.error(<div><strong>{title}</strong><br />{body}</div>, { autoClose: delay });

  // Warning toast function
  const warningTest = (title: ReactNode, body: ReactNode, delay = 4500) =>
    toast.warning(<div><strong>{title}</strong><br />{body}</div>, { autoClose: delay });

  // Info toast function
  const infoTest = (title: ReactNode, body: ReactNode, delay = 4500) =>
    toast.info(<div><strong>{title}</strong><br />{body}</div>, { autoClose: delay });

  // Returning the toast functions
  return { successTest, dangerTest, warningTest, infoTest };
}
