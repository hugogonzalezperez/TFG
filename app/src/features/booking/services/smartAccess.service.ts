import { smartAccessDal } from './smartAccess.dal';

export const smartAccessService = {
  async openDoor(bookingId: string): Promise<boolean> {
    try {
      await smartAccessDal.insertAccessLog(bookingId, 'open', true);
      return true;
    } catch (error) {
      console.error('Error opening door:', error);
      return false;
    }
  },

  async closeDoor(bookingId: string): Promise<boolean> {
    try {
      await smartAccessDal.insertAccessLog(bookingId, 'close', true);
      return true;
    } catch (error) {
      console.error('Error closing door:', error);
      return false;
    }
  }
};
