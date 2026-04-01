import { useCallback, useState } from 'react';

export const useToggle = (
  initialState = false
): [boolean, () => void, () => void, () => void] => {
  const [state, setState] = useState<boolean>(initialState);

  const toggle = useCallback(() => setState(prevState => !prevState), []);
  const open = useCallback(() => setState(true), []);
  const close = useCallback(() => setState(false), []);

  return [state, toggle, open, close];
};
