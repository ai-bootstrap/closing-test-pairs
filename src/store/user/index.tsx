import { create } from 'zustand';

import { signOut } from '@/lib';
import { getItem, removeItem, setItem } from '@/lib/storage';
import { type IUserInfo } from '@/types';
import { createSelectors } from '@/utils';

interface UserState {
  userInfo: IUserInfo | null;
  setUserInfo: (userInfo: IUserInfo) => void;
  clearUserInfo: () => void;
  hydrate: () => void;
}

const _useUser = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => {
    // Before setting user info, we need to set it in storage as well
    setItem<IUserInfo>('userInfo', userInfo);
    set({ userInfo });
  },
  clearUserInfo: () => {
    removeItem('userInfo');
    set({ userInfo: null });
  },
  hydrate() {
    try {
      const userInfo = getItem<IUserInfo>('userInfo');
      console.log('userInfo in hydrate: ', userInfo);
      if (userInfo !== null) {
        set({ userInfo });
      } else {
        // login out user
        // set({ userInfo: null });
        signOut();
      }
    } catch (e) {
      // Handle error here
    }
  },
}));

export const useUserStore = createSelectors(_useUser);
export const useUserInfo = () => _useUser.getState().userInfo;
export const setUserInfo = (userInfo: IUserInfo) =>
  _useUser.getState().setUserInfo(userInfo);
export const clearUserInfo = () => _useUser.getState().clearUserInfo();
export const hydrateUserInfo = () => _useUser.getState().hydrate();
