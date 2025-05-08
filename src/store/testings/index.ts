/**
 * save testings that is editing
 */

import { AppFormType } from "@/types";


import { create } from "zustand";
import { createSelectors } from "@/utils"; 

interface TestingsState {
  currentEditingTesting: AppFormType | null;
  setCurrentEditingTesting: (testing: AppFormType | null) => void;
  clearCurrentEditingTesting: () => void;
} 

const _useTestings = create<TestingsState>((set) => ({
  currentEditingTesting: null,
  setCurrentEditingTesting: (testing) => {
    set({ currentEditingTesting: testing });
  },
  clearCurrentEditingTesting: () => {
    set({ currentEditingTesting: null });
  },
}));
export const useTestingsStore = createSelectors(_useTestings);
export const useCurrentEditingTesting = () => _useTestings.getState().currentEditingTesting;
export const setCurrentEditingTesting = (testing: AppFormType | null) => _useTestings.getState().setCurrentEditingTesting(testing);
