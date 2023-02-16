import { isTouchScreenDevice } from '../tools/isTouchScreenDevice';

export const tapOrClickBefore = isTouchScreenDevice ? 'tap' : 'click';
