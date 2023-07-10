import { ModalType, useModalStateStore } from "@/store/modalStore";
import { useCallback } from "react";
import { useLockScroll } from "./useLockScroll";

export const useModal = () => {
  const { modalState, setModalState } = useModalStateStore();
  const { lockScroll, openScroll } = useLockScroll();

  const closeModal = useCallback(() => {
    openScroll();
    setModalState("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = useCallback((type: ModalType) => {
    lockScroll();
    setModalState(type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    modalState,
    openModal,
    closeModal,
  };
};
