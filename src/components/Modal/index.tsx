import { styled } from "styled-components";
import ModalPortal from "./modalPortal";
import React, { MouseEvent } from "react";
import { Icon } from "@team-return/design-system";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  width: number;
  closeAble?: boolean;
}

const Modal = ({ onClose, children, width, closeAble }: ModalProps) => {
  const BlockClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    <ModalPortal>
      <Background onClick={onClose}>
        <ModalContainer width={width} onClick={BlockClick}>
          {closeAble && <CloseIcon cursor="pointer" onClick={onClose} size={24} icon="Close" color="gray60" />}
          {children}
        </ModalContainer>
      </Background>
    </ModalPortal>
  );
};

export default Modal;

const Background = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  text-align: center;
  background-color: #00000033;
  z-index: 10000;
`;

const ModalContainer = styled.div<{ width: number }>`
  position: relative;
  width: ${({ width }) => width}px;
  min-height: 0px;
  background-color: white;
`;

const CloseIcon = styled(Icon)`
  position: absolute;
  top: 8px;
  right: 8px;
`;
