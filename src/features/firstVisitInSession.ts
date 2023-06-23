import { useSessionStorage } from 'usehooks-ts';
import { useEffect, useMemo } from 'react';

import { SessionStorageKeys } from '../shared/SessionStorageKeys';

export function useInitVisitInSession() {
  const [, setVisited] = useSessionStorage(SessionStorageKeys.Visited, false);

  useEffect(() => {
    setVisited(true);
  }, []);
}

export function useIsFirstVisitInSession() {
  const [visited] = useSessionStorage(SessionStorageKeys.Visited, false);
  const isFirstVisitInSession = useMemo(() => visited === false, []);

  return { isFirstVisitInSession };
}
