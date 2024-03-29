import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ModalType =
  | "MAIN_ADDRESS"
  | "SUB_ADDRESS"
  | "HIRING_PROGRESS"
  | "GATHER_FIELD"
  | "USE_TECH"
  | "LICENSE"
  | "EDIT_RECRUIT_AREA"
  | "ADD_RECRUIT_AREA"
  | "";

export interface IModalState {
  modalState: ModalType;
  setModalState: (modalState: ModalType) => void;
}

export const useModalStateStore = create<IModalState>()(
  devtools((set) => ({
    modalState: "",
    setModalState: (modalState) => set(() => ({ modalState })),
  }))
);
