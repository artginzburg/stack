import { useSessionStorage } from 'usehooks-ts';
import { useEffect, useMemo } from 'react';

import { SessionStorageKeys } from '../shared/SessionStorageKeys';

export function useInitVisitInSession() {
  const [, setVisited] = useSessionStorage(SessionStorageKeys.Visited, false);

  useEffect(() => {
    setVisited(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useIsFirstVisitInSession() {
  const [visited] = useSessionStorage(SessionStorageKeys.Visited, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isFirstVisitInSession = useMemo(() => visited === false, []);

  return { isFirstVisitInSession };
}
