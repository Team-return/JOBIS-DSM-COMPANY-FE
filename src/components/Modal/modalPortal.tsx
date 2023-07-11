import { ReactNode } from "react";
import ReactDOM from "react-dom";

const ModalPortal = ({ children }: { children: ReactNode }) => {
  const modalRoot = document.querySelector("#modal-root");
  if (!modalRoot) return null;
  return ReactDOM.createPortal(children, modalRoot as HTMLDivElement);
};

export default ModalPortal;
