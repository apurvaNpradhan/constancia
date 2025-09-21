import { create } from "zustand";
interface SettingsState {
   isOpen: boolean;
   openModal: () => void;
   closeModal: () => void;
}
export const useSettingsStore = create<SettingsState>((set) => ({
   isOpen: false,
   openModal: () => set({ isOpen: true }),
   closeModal: () => set({ isOpen: false }),
}));
