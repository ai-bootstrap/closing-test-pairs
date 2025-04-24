import { create } from 'zustand';
import { IUserInfo } from '@/types';
import { createSelectors } from '@/lib/utils';


interface UserState {
  userInfo: IUserInfo | null; 
  setUserInfo: (userInfo: IUserInfo) => void;
  clearUserInfo: () => void;
}

const _useUser = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  clearUserInfo: () => set({ userInfo: null }),
}));

export const useUserStore = createSelectors(_useUser);
export const useUserInfo = () => _useUser.getState().userInfo;
export const setUserInfo = (userInfo: IUserInfo) => _useUser.getState().setUserInfo(userInfo);
export const clearUserInfo = () => _useUser.getState().clearUserInfo();