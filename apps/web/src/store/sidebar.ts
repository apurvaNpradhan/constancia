import * as zustand from "zustand";

interface SidebarState {
   calendarDate: string;
   setCaledarDate: (date: string | undefined) => void;
   leftOpen: boolean;
   setLeftOpen: (open: boolean) => void;
   rightOpen: boolean;
   setRightOpen: (open: boolean) => void;
}

export const useSidebarStore = zustand.create<SidebarState>((set) => ({
   calendarDate: new Date().toISOString().split("T")[0],
   setCaledarDate: (date: string | undefined) => set({ calendarDate: date }),
   leftOpen: false,
   setLeftOpen: (open: boolean) => set({ leftOpen: open }),
   rightOpen: false,
   setRightOpen: (open: boolean) => set({ rightOpen: open }),
}));
