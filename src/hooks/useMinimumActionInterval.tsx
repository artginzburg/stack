import { useState } from 'react';

export function useMinimumActionInterval(
  /** in milliseconds */
  minimumInterval: number,
) {
  const [isActing, setIsActing] = useState(false);

  function preventActionOrPrepareAndContinue() {
    if (isActing) return true;

    setIsActing(true);
    setTimeout(() => {
      setIsActing(false);
    }, minimumInterval);
  }

  return { preventActionOrPrepareAndContinue };
}
