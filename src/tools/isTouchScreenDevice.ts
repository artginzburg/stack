/** @see https://stackoverflow.com/a/72878777/11474669 */
export const getIsTouchScreenDevice = () => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
};

export const isTouchScreenDevice = getIsTouchScreenDevice();
